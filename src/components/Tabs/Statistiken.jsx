import React, { useEffect, useState, useRef } from 'react';
import { Select, Option } from '@mui/joy';
import { getFinancialData } from '../../Scripts/StatsHandler';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import html2pdf from 'html2pdf.js';
import { Download, TrendingUp, TrendingDown, Euro, CreditCard, AlertCircle, FileText } from 'lucide-react';

// Shadcn imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function Statistiken() {
    const [year, setYear] = useState(new Date().getFullYear());
    const [exportMonth, setExportMonth] = useState("all");
    const [stats, setStats] = useState(null);
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState("");
    const pdfRef = useRef();

    useEffect(() => {
        const fetch = async () => {
            const data = await getFinancialData(year);
            setStats(data);
        };
        fetch();
    }, [year]);

    const handleZIPExport = async () => {
        if (!stats) return;
        setIsExporting(true);
        setExportProgress("ZIP wird vorbereitet...");

        try {
            const JSZip = (await import('jszip')).default;
            const zip = new JSZip();

            // Load settings and logo
            const settingsStr = await window.api.readFile("settings/unternehmen.rechnix");
            const unternehmen = settingsStr ? JSON.parse(settingsStr) : {};
            let logoPath = null;
            try { logoPath = "file://" + await window.api.getFullpath("logo.png"); } catch (e) { }

            const { getKunde } = await import('../../Scripts/Filehandler');
            const { generateInvoicePdfBuffer } = await import('../Export/generateInvoicePdfBuffer');

            // --- Helper: Generate PDF from an HTML table string ---
            const generateTablePdf = async (htmlContent, filename) => {
                const wrapper = document.createElement('div');
                wrapper.style.cssText = "font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; padding: 20px; color: #111;";
                wrapper.innerHTML = htmlContent;
                document.body.appendChild(wrapper);
                const opt = {
                    margin: [10, 10, 10, 10],
                    filename,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, backgroundColor: '#ffffff' },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                };
                const buffer = await html2pdf().set(opt).from(wrapper).outputPdf('arraybuffer');
                document.body.removeChild(wrapper);
                return buffer;
            };

            let incomeList = stats.incomeList || [];
            let expensesList = stats.expensesList || [];

            if (exportMonth !== "all") {
                incomeList = incomeList.filter(i => new Date(i.date).getMonth() === exportMonth);
                expensesList = expensesList.filter(e => new Date(e.date).getMonth() === exportMonth);
            }

            const filteredProfit = incomeList.reduce((acc, curr) => acc + curr.amount, 0)
                - expensesList.reduce((acc, curr) => acc + curr.amount, 0);

            const periodName = exportMonth === "all"
                ? `${year}`
                : `${new Date(year, exportMonth, 1).toLocaleString('de-DE', { month: 'long' })} ${year}`;
            const safePeriodName = exportMonth === "all" ? `${year}` : `${(exportMonth + 1).toString().padStart(2, '0')}_${year}`;

            // ── 1. Einnahmen-Überschuss-Rechnung (EÜR) as a crisp PDF table ──
            setExportProgress("Generiere EÜR-Tabelle...");
            const tdStyle = "padding:8px 10px; border-bottom:1px solid #e0e0e0;";
            const thStyle = "padding:8px 10px; background:#f4f4f8; font-weight:600; text-align:left; border-bottom:2px solid #c0c0d0;";

            let euerHtml = `
                <h2 style="margin-bottom:4px; font-size:16px;">Einnahmen-Überschuss-Rechnung — ${periodName}</h2>
                <p style="color:#555; margin-bottom:16px; font-size:11px;">Erstellt am ${new Date().toLocaleDateString('de-DE')}</p>
                <table style="width:100%; border-collapse:collapse;">
                    <thead><tr>
                        <th style="${thStyle}">Typ</th>
                        <th style="${thStyle}">Datum</th>
                        <th style="${thStyle}">Bezeichnung</th>
                        <th style="${thStyle} text-align:right;">Betrag (€)</th>
                    </tr></thead>
                    <tbody>`;

            incomeList.forEach(i => {
                euerHtml += `<tr>
                    <td style="${tdStyle} color:#16a34a; font-weight:500;">Einnahme</td>
                    <td style="${tdStyle}">${new Date(i.date).toLocaleDateString('de-DE')}</td>
                    <td style="${tdStyle}">${i.customerName || ''} – ${i.id}</td>
                    <td style="${tdStyle} text-align:right;">+${i.amount.toFixed(2)}</td>
                </tr>`;
            });

            expensesList.forEach(e => {
                euerHtml += `<tr>
                    <td style="${tdStyle} color:#dc2626; font-weight:500;">Ausgabe</td>
                    <td style="${tdStyle}">${new Date(e.date).toLocaleDateString('de-DE')}</td>
                    <td style="${tdStyle}">${e.title || e.category || 'Unbekannt'}${e.provider ? ' / ' + e.provider : ''}</td>
                    <td style="${tdStyle} text-align:right;">−${e.amount.toFixed(2)}</td>
                </tr>`;
            });

            const profitColor = filteredProfit >= 0 ? '#16a34a' : '#dc2626';
            euerHtml += `
                    </tbody>
                    <tfoot>
                        <tr style="background:#f8f8fc;">
                            <td colspan="3" style="padding:10px; font-weight:700; font-size:13px;">Ergebnis (Gewinn/Verlust)</td>
                            <td style="padding:10px; text-align:right; font-weight:700; font-size:13px; color:${profitColor};">${filteredProfit >= 0 ? '+' : ''}${filteredProfit.toFixed(2)} €</td>
                        </tr>
                    </tfoot>
                </table>`;

            const euerBuffer = await generateTablePdf(euerHtml, `EÜR_${safePeriodName}.pdf`);
            zip.folder("Übersicht").file(`EÜR_${safePeriodName}.pdf`, euerBuffer);

            // ── 2. Ausgaben-Übersicht ──
            setExportProgress("Generiere Ausgaben-Übersicht...");
            let ausgabenHtml = `
                <h2 style="margin-bottom:4px; font-size:16px;">Ausgabenübersicht — ${periodName}</h2>
                <p style="color:#555; margin-bottom:16px; font-size:11px;">Erstellt am ${new Date().toLocaleDateString('de-DE')}</p>
                <table style="width:100%; border-collapse:collapse;">
                    <thead><tr>
                        <th style="${thStyle}">Datum</th>
                        <th style="${thStyle}">Kategorie</th>
                        <th style="${thStyle}">Titel / Empfänger</th>
                        <th style="${thStyle}">Abo</th>
                        <th style="${thStyle} text-align:right;">Betrag (€)</th>
                        <th style="${thStyle}">Belege</th>
                    </tr></thead>
                    <tbody>`;

            const totalAusgaben = expensesList.reduce((s, e) => s + e.amount, 0);

            expensesList.forEach((e, idx) => {
                // Collect all attachment names for this expense
                const attNames = [];
                if (e.attachments && e.attachments.length > 0) {
                    e.attachments.forEach(a => attNames.push(a.name || 'Anhang'));
                } else if (e.attachmentPath) {
                    attNames.push(e.file || 'Anhang');
                }
                const attCell = attNames.length > 0 ? attNames.join(', ') : '—';

                ausgabenHtml += `<tr style="background:${idx % 2 === 0 ? '#fff' : '#fafafa'};">
                    <td style="${tdStyle}">${new Date(e.date).toLocaleDateString('de-DE')}</td>
                    <td style="${tdStyle}">${e.category || '—'}</td>
                    <td style="${tdStyle}">${e.title || '—'}${e.provider ? ' / ' + e.provider : ''}</td>
                    <td style="${tdStyle}">${e.isRecurring ? 'Ja' : '—'}</td>
                    <td style="${tdStyle} text-align:right;">${e.amount.toFixed(2)}</td>
                    <td style="${tdStyle} font-size:10px; color:#555;">${attCell}</td>
                </tr>`;
            });

            ausgabenHtml += `
                    </tbody>
                    <tfoot>
                        <tr style="background:#f8f8fc;">
                            <td colspan="4" style="padding:10px; font-weight:700;">Gesamt</td>
                            <td style="padding:10px; text-align:right; font-weight:700; color:#dc2626;">−${totalAusgaben.toFixed(2)} €</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>`;

            const ausgabenUebersichtBuffer = await generateTablePdf(ausgabenHtml, 'Ausgaben_Übersicht.pdf');
            zip.folder("Ausgaben").file(`Ausgaben_Übersicht_${safePeriodName}.pdf`, ausgabenUebersichtBuffer);

            // ── 3. Ausgaben Anhänge ──
            for (let j = 0; j < expensesList.length; j++) {
                const exp = expensesList[j];
                const safeTitle = (exp.title || "Beleg_" + j).replace(/[/\\?%*:|"<>]/g, '-');
                const safeCategory = (exp.category || "Sonstiges").replace(/[/\\?%*:|"<>]/g, '-');
                const mimeMap = { 'image/jpeg': '.jpg', 'image/png': '.png', 'application/pdf': '.pdf', 'text/xml': '.xml', 'application/xml': '.xml' };

                // Combine both legacy (attachmentPath) and new (attachments[]) formats
                const allAttachments = [];
                if (exp.attachments && exp.attachments.length > 0) {
                    exp.attachments.forEach(a => { if (a.path) allAttachments.push({ path: a.path, name: a.name }); });
                } else if (exp.attachmentPath) {
                    allAttachments.push({ path: exp.attachmentPath, name: exp.file || null });
                }

                if (allAttachments.length === 0) continue;

                setExportProgress(`Lade Belege für "${exp.title || 'Ausgabe'}" (${j + 1}/${expensesList.length})...`);

                for (let k = 0; k < allAttachments.length; k++) {
                    const att = allAttachments[k];
                    try {
                        const dataUrl = await window.api.readAttachment(att.path);
                        if (!dataUrl) continue;
                        const base64Data = dataUrl.split(',')[1];
                        const mimeMatch = dataUrl.match(/data:([a-zA-Z0-9/+.-]+);/);
                        const ext = mimeMatch && mimeMap[mimeMatch[1]] ? mimeMap[mimeMatch[1]] : '.bin';
                        const attName = att.name ? att.name.replace(/[/\\?%*:|"<>]/g, '-') : `Beleg_${k + 1}${ext}`;
                        // Structure: Ausgaben/Details/[Kategorie]/[Ausgabe Name]/Beleg
                        zip.folder("Ausgaben").folder("Details").folder(safeCategory).folder(safeTitle).file(attName, base64Data, { base64: true });
                    } catch (e) {
                        console.error("Failed to add attachment", att.path, e);
                    }
                }
            }

            // ── 4. Kundendaten & Rechnungen ──
            const kundenCache = {};
            for (let i = 0; i < incomeList.length; i++) {
                const inv = incomeList[i];
                setExportProgress(`Generiere Rechnung ${i + 1} von ${incomeList.length}...`);
                try {
                    let kunde = kundenCache[inv.data.kundenId];
                    if (!kunde) {
                        try { kunde = await getKunde(inv.data.kundenId); kundenCache[inv.data.kundenId] = kunde; }
                        catch (e) { kunde = { name: inv.customerName || "Unbekannt" }; }
                    }
                    const pdfBuffer = await generateInvoicePdfBuffer(inv.id, inv.data, kunde, unternehmen, logoPath);
                    const safeKundenName = (kunde.name || "Unbekannt").replace(/[/\\?%*:|"<>]/g, '-');
                    const safeInvName = (inv.id).replace(/[/\\?%*:|"<>]/g, '-');
                    zip.folder("Rechnungen").folder(safeKundenName).file(`${safeInvName}.pdf`, pdfBuffer);
                } catch (e) {
                    console.error("Failed to generate PDF for invoice", inv.id, e);
                }
            }

            // ── 5. Save Dialog ──
            setExportProgress("Wähle Speicherort...");
            const { filePath } = await window.api.showSaveDialog({
                title: 'Export Speichern',
                defaultPath: `Buchhaltung_${safePeriodName}.zip`,
                filters: [{ name: 'ZIP Archive', extensions: ['zip'] }]
            });

            if (filePath) {
                setExportProgress("Speichere ZIP-Datei...");
                const content = await zip.generateAsync({ type: 'uint8array' });
                await window.api.saveFileToPath({ filePath, content });
                setExportProgress("Erfolgreich gespeichert! ✓");
                setTimeout(() => setIsExporting(false), 2000);
            } else {
                setIsExporting(false);
            }
        } catch (error) {
            console.error("Export error", error);
            alert("Fehler beim Exportieren: " + error.message);
            setIsExporting(false);
        }
    };

    if (!stats) {
        return (
            <div className="flex items-center justify-center h-full p-8">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
                    <p className="text-muted-foreground">Lade Statistiken...</p>
                </div>
            </div>
        );
    }

    const { chartData, summary, expensesList } = stats;

    // Prepare Pie Chart Data
    const categoryData = {};
    expensesList.forEach(e => {
        const cat = e.category || "Sonstiges";
        categoryData[cat] = (categoryData[cat] || 0) + e.amount;
    });
    const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

    const currentMonthIndex = new Date().getMonth();
    const isCurrentYear = year === new Date().getFullYear();
    const currentMonthStats = (isCurrentYear && chartData && chartData[currentMonthIndex]) ? chartData[currentMonthIndex] : null;

    return (
        <div className="h-full overflow-y-auto bg-background">

            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Finanzübersicht</h1>
                        <p className="text-muted-foreground mt-1">Analysieren Sie Ihre Einnahmen und Ausgaben für {year}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Select
                            value={year}
                            onChange={(e, val) => setYear(val)}
                            sx={{ minWidth: 100 }}
                        >
                            <Option value={2023}>2023</Option>
                            <Option value={2024}>2024</Option>
                            <Option value={2025}>2025</Option>
                            <Option value={2026}>2026</Option>
                        </Select>
                        <Select
                            value={exportMonth}
                            onChange={(e, val) => setExportMonth(val)}
                            sx={{ minWidth: 140 }}
                        >
                            <Option value="all">Ganzes Jahr</Option>
                            <Option value={0}>Januar</Option>
                            <Option value={1}>Februar</Option>
                            <Option value={2}>März</Option>
                            <Option value={3}>April</Option>
                            <Option value={4}>Mai</Option>
                            <Option value={5}>Juni</Option>
                            <Option value={6}>Juli</Option>
                            <Option value={7}>August</Option>
                            <Option value={8}>September</Option>
                            <Option value={9}>Oktober</Option>
                            <Option value={10}>November</Option>
                            <Option value={11}>Dezember</Option>
                        </Select>
                        {isExporting ? (
                            <div className="flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 py-2 inline-flex justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2"></div>
                                {exportProgress}
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Button onClick={handleZIPExport} className="gap-2 bg-primary hover:bg-primary/90">
                                    <Download className="h-4 w-4" />
                                    Exportieren (ZIP)
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-l-4 border-l-green-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Gesamte Einnahmen</CardTitle>
                            <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                                <TrendingUp className="h-4 w-4 text-green-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{summary.totalIncome?.toFixed(2)} €</div>
                            <p className="text-xs text-muted-foreground mt-1">Bruttoeinkommen {year}</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-red-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Gesamte Ausgaben</CardTitle>
                            <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                                <TrendingDown className="h-4 w-4 text-red-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{summary.totalExpenses?.toFixed(2)} €</div>
                            <p className="text-xs text-muted-foreground mt-1">Betriebsausgaben {year}</p>
                        </CardContent>
                    </Card>

                    <Card className={`border-l-4 ${summary.profit >= 0 ? 'border-l-primary' : 'border-l-orange-500'}`}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Gewinn / Verlust</CardTitle>
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${summary.profit >= 0 ? 'bg-primary/10' : 'bg-orange-500/10'}`}>
                                <Euro className={`h-4 w-4 ${summary.profit >= 0 ? 'text-primary' : 'text-orange-600'}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${summary.profit >= 0 ? 'text-primary' : 'text-orange-600'}`}>
                                {summary.profit?.toFixed(2)} €
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{summary.profit >= 0 ? 'Jahresüberschuss' : 'Jahresfehlbetrag'}</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-purple-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">USt. Eingenommen</CardTitle>
                            <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                <FileText className="h-4 w-4 text-purple-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">{summary.totalTaxCollected?.toFixed(2)} €</div>
                            <p className="text-xs text-muted-foreground mt-1">Umsatzsteuer {year}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Payment Status */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                Bezahlte Rechnungen
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summary.paidAmount?.toFixed(2)} €</div>
                            <p className="text-xs text-muted-foreground mt-1">{summary.paidCount || 0} Rechnungen</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                                Offene Rechnungen
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summary.openAmount?.toFixed(2)} €</div>
                            <p className="text-xs text-muted-foreground mt-1">{summary.openCount || 0} Rechnungen</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                Überfällige Rechnungen
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{summary.overdueAmount?.toFixed(2)} €</div>
                            <p className="text-xs text-muted-foreground mt-1">{summary.overdueCount || 0} Rechnungen</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Grid */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Monthly Revenue Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Jahresverlauf</CardTitle>
                            <CardDescription>Einnahmen und Ausgaben pro Monat</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis
                                            dataKey="month"
                                            stroke="#6b7280"
                                            fontSize={12}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            stroke="#6b7280"
                                            fontSize={12}
                                            tickLine={false}
                                            tickFormatter={(value) => `${value}€`}
                                        />
                                        <RechartsTooltip
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                            }}
                                            formatter={(value) => [`${value.toFixed(2)}€`, '']}
                                        />
                                        <Legend />
                                        <Bar dataKey="income" fill="#10b981" name="Einnahmen" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="expenses" fill="#ef4444" name="Ausgaben" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Expense Categories Pie Chart */}
                    {pieData.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Ausgaben nach Kategorie</CardTitle>
                                <CardDescription>Verteilung der Betriebsausgaben</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip formatter={(value) => `${value.toFixed(2)}€`} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
