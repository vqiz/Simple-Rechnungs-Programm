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

            // 1. Übersicht (EÜR)
            setExportProgress("Generiere EÜR-Übersicht...");
            if (pdfRef.current) {
                const opt = {
                    margin: 0,
                    filename: `EUER_${year}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                };
                const euerPdfBuffer = await html2pdf().set(opt).from(pdfRef.current).outputPdf('arraybuffer');
                zip.folder("Übersicht").file(`EÜR_Übersicht_${year}.pdf`, euerPdfBuffer);
            }

            // Load settings and logo
            const settingsStr = await window.api.readFile("settings/unternehmen.rechnix");
            const unternehmen = settingsStr ? JSON.parse(settingsStr) : {};
            let logoPath = null;
            try { logoPath = "file://" + await window.api.getFullpath("logo.png"); } catch (e) { }

            const { getKunde } = await import('../../Scripts/Filehandler');
            const { generateInvoicePdfBuffer } = await import('../Export/generateInvoicePdfBuffer');

            // --- Generate HTML Tables for Overviews ---
            const generateTablePdf = async (htmlContent, filename) => {
                const div = document.createElement('div');
                div.innerHTML = htmlContent;
                document.body.appendChild(div);
                const opt = { margin: 10, filename, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } };
                const buffer = await html2pdf().set(opt).from(div).outputPdf('arraybuffer');
                document.body.removeChild(div);
                return buffer;
            };

            const incomeList = stats.incomeList || [];
            const expensesList = stats.expensesList || [];

            // 1b. Überschussrechnung (Liste aller Rechnungen & Ausgaben)
            setExportProgress("Generiere Überschussrechnung-Liste...");
            let listHtml = `<h2>Einnahmenüberschussrechnung (Details) - ${year}</h2><table border="1" style="width:100%;border-collapse:collapse;font-family:sans-serif;font-size:12px;"><tr><th>Typ</th><th>Datum</th><th>Name/Bezeichnung</th><th>Betrag (€)</th></tr>`;
            incomeList.forEach(i => listHtml += `<tr><td>Einnahme</td><td>${new Date(i.date).toLocaleDateString()}</td><td>${i.customerName} (Rechnung: ${i.id})</td><td style="text-align:right">${i.amount.toFixed(2)}</td></tr>`);
            expensesList.forEach(e => listHtml += `<tr><td>Ausgabe</td><td>${new Date(e.date).toLocaleDateString()}</td><td>${e.title || e.category}</td><td style="text-align:right">-${e.amount.toFixed(2)}</td></tr>`);
            listHtml += `<tr><td colspan="3"><b>Gewinn/Verlust:</b></td><td style="text-align:right"><b>${stats.summary.profit?.toFixed(2)}</b></td></tr></table>`;

            const ueberschussBuffer = await generateTablePdf(listHtml, 'Ueberschussrechnung_Details.pdf');
            zip.folder("Überschuss rechnung").file(`Details_${year}.pdf`, ueberschussBuffer);

            // 2. Kunden Rechnungen
            const kundenCache = {};

            for (let i = 0; i < incomeList.length; i++) {
                const inv = incomeList[i];
                setExportProgress(`Generiere Rechnung ${i + 1} von ${incomeList.length}...`);

                try {
                    let kunde = kundenCache[inv.data.kundenId];
                    if (!kunde) {
                        try {
                            kunde = await getKunde(inv.data.kundenId);
                            kundenCache[inv.data.kundenId] = kunde;
                        } catch (e) {
                            kunde = { name: inv.customerName || "Unbekannt" };
                        }
                    }

                    const pdfBuffer = await generateInvoicePdfBuffer(inv.id, inv.data, kunde, unternehmen, logoPath);
                    const safeKundenName = (kunde.name || "Unbekannt").replace(/[/\\?%*:|"<>]/g, '-');
                    const safeInvName = (inv.id).replace(/[/\\?%*:|"<>]/g, '-');

                    zip.folder("Kunden").folder(safeKundenName).file(`${safeInvName}.pdf`, pdfBuffer);
                } catch (e) {
                    console.error("Failed to generate PDF for invoice", inv.id, e);
                }
            }

            // 3. Ausgaben Belege & Übersicht
            setExportProgress("Generiere Ausgaben-Übersicht...");
            let ausgabenHtml = `<h2>Ausgabenübersicht - ${year}</h2><table border="1" style="width:100%;border-collapse:collapse;font-family:sans-serif;font-size:12px;"><tr><th>Datum</th><th>Kategorie</th><th>Titel/Empfänger</th><th>Betrag (€)</th></tr>`;
            expensesList.forEach(e => ausgabenHtml += `<tr><td>${new Date(e.date).toLocaleDateString()}</td><td>${e.category}</td><td>${e.title || 'Unbekannt'}</td><td style="text-align:right">${e.amount.toFixed(2)}</td></tr>`);
            ausgabenHtml += `</table>`;
            const ausgabenUebersichtBuffer = await generateTablePdf(ausgabenHtml, 'Ausgabenuebersicht.pdf');
            zip.folder("Ausgaben").file(`Ausgaben_Übersicht_${year}.pdf`, ausgabenUebersichtBuffer);

            for (let j = 0; j < expensesList.length; j++) {
                const exp = expensesList[j];
                if (exp.attachmentPath) {
                    setExportProgress(`Lade Beleg ${j + 1} von ${expensesList.length}...`);
                    try {
                        const attachmentDataUrl = await window.api.readAttachment(exp.attachmentPath);
                        if (attachmentDataUrl) {
                            const base64Data = attachmentDataUrl.split(',')[1];
                            const safeTitle = (exp.title || "Beleg_" + j).replace(/[/\\?%*:|"<>]/g, '-');
                            const mimeMap = { 'image/jpeg': '.jpg', 'image/png': '.png', 'application/pdf': '.pdf', 'text/xml': '.xml' };
                            const mimeMatch = attachmentDataUrl.match(/data:([a-zA-Z0-9/+-]+);/);
                            const ext = mimeMatch && mimeMap[mimeMatch[1]] ? mimeMap[mimeMatch[1]] : '.png';

                            zip.folder("Ausgaben").folder(safeTitle).file(`Beleg_${safeTitle}${ext}`, base64Data, { base64: true });
                        }
                    } catch (e) {
                        console.error("Failed to add attachment for expense", exp.title, e);
                    }
                }
            }

            // 4. Save Dialog
            setExportProgress("Wähle Speicherort...");
            const { filePath } = await window.api.showSaveDialog({
                title: 'Jahresabschluss Exportieren',
                defaultPath: `Jahresabschluss_${year}.zip`,
                filters: [{ name: 'ZIP Archive', extensions: ['zip'] }]
            });

            if (filePath) {
                setExportProgress("Speichere ZIP-Datei...");
                const content = await zip.generateAsync({ type: 'uint8array' });
                await window.api.saveFileToPath({ filePath, content });
                setExportProgress("Erfolgreich gespeichert!");
                setTimeout(() => setIsExporting(false), 2000);
            } else {
                setIsExporting(false); // Cancelled
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
        <div className="h-full overflow-y-auto bg-background" ref={pdfRef}>
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
                            sx={{ minWidth: 140 }}
                        >
                            <Option value={2022}>2022</Option>
                            <Option value={2023}>2023</Option>
                            <Option value={2024}>2024</Option>
                            <Option value={2025}>2025</Option>
                            <Option value={2026}>2026</Option>
                        </Select>
                        {isExporting ? (
                            <div className="flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2"></div>
                                {exportProgress}
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Button onClick={handleZIPExport} className="gap-2">
                                    <Download className="h-4 w-4" />
                                    Jahresabschluss ZIP
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

                    <Card className={`border-l-4 ${summary.profit >= 0 ? 'border-l-blue-500' : 'border-l-orange-500'}`}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Gewinn / Verlust</CardTitle>
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${summary.profit >= 0 ? 'bg-blue-500/10' : 'bg-orange-500/10'}`}>
                                <Euro className={`h-4 w-4 ${summary.profit >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${summary.profit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
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
