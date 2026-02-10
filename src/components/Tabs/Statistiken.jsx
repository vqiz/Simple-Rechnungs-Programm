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
    const pdfRef = useRef();

    useEffect(() => {
        const fetch = async () => {
            const data = await getFinancialData(year);
            setStats(data);
        };
        fetch();
    }, [year]);

    const handleExportEUR = () => {
        if (!pdfRef.current) return;
        const element = pdfRef.current;
        const opt = {
            margin: 0,
            filename: `EÜR_${year}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
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
                            sx={{ minWidth: 140 }}
                        >
                            <Option value={2022}>2022</Option>
                            <Option value={2023}>2023</Option>
                            <Option value={2024}>2024</Option>
                            <Option value={2025}>2025</Option>
                            <Option value={2026}>2026</Option>
                        </Select>
                        <Button onClick={handleExportEUR} className="gap-2">
                            <Download className="h-4 w-4" />
                            EÜR Exportieren
                        </Button>
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
