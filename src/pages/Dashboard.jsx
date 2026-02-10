import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Euro, TrendingUp, PiggyBank, FileText } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Scripts
import { get_uRechnungen, handleLoadFile } from '../Scripts/Filehandler';
import { getNetto } from '../Scripts/ERechnungInterpretter';
import { checkRecurringExpenses, getAusgaben } from '../Scripts/AusgabenHandler';

// Components
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import PaymentStatusBadge from '../components/Payment/PaymentStatusBadge';

const Dashboard = () => {
    const navigate = useNavigate();
    const [u_rechnungen, setURechnung] = useState();
    const [count, setCount] = useState(0);
    const [ges, setGes] = useState(0);
    const [monthUmsatz, setMonthUmsatz] = useState(0);
    const [yearUmsatz, setYearUmsatz] = useState(0);
    const [yearGewinn, setYearGewinn] = useState(0);
    const [expensesSum, setExpensesSum] = useState(0);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            await checkRecurringExpenses();

            try {
                const data = await get_uRechnungen();
                setURechnung(data);
            } catch (e) { console.error(e); }

            try {
                const jsonstring = await handleLoadFile("fast_accsess/config.rechnix");
                const json = JSON.parse(jsonstring);
                setCount(json.count || 0);
            } catch (e) { console.error(e); }

            try {
                const filedata = await window.api.listfiles("rechnungen/");
                if (!filedata) return;

                const uniqueFiles = [...new Set(filedata)].filter(f => f.name && f.name.startsWith("R"));
                const currentYear = new Date().getFullYear();
                const currentMonth = new Date().getMonth() + 1;

                let total = 0, year = 0, month = 0;
                const monthlyData = {};

                const updates = await Promise.all(uniqueFiles.map(async (file) => {
                    let amount = 0;
                    try {
                        const string = await handleLoadFile("rechnungen/" + file.name);
                        const json = JSON.parse(string);
                        amount = Number(getNetto(json)) || 0;
                    } catch (e) { console.error(e); }

                    const parts = file.name.split("-");
                    let fileYear = 0, fileMonth = 0;
                    if (parts.length >= 2) {
                        fileYear = parseInt(parts[0].replace("R", ""));
                        fileMonth = parseInt(parts[1]);
                    }
                    return { amount, fileYear, fileMonth };
                }));

                for (let u of updates) {
                    total += u.amount;
                    if (u.fileYear === currentYear) {
                        year += u.amount;
                        if (u.fileMonth === currentMonth) {
                            month += u.amount;
                        }
                        // Aggregate for chart
                        if (u.fileMonth >= 1 && u.fileMonth <= 12) {
                            if (!monthlyData[u.fileMonth]) {
                                monthlyData[u.fileMonth] = 0;
                            }
                            monthlyData[u.fileMonth] += u.amount;
                        }
                    }
                }

                // Prepare chart data for all 12 months
                const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
                const chartArray = months.map((name, idx) => ({
                    month: name,
                    revenue: monthlyData[idx + 1] || 0
                }));
                setChartData(chartArray);

                let expSum = 0;
                try {
                    const expensesData = await getAusgaben();
                    if (expensesData && expensesData.list) {
                        const now = new Date();
                        expensesData.list.forEach(exp => {
                            const d = new Date(exp.date);
                            if (d.getFullYear() === currentYear && d <= now) {
                                expSum += Number(exp.amount) || 0;
                            }
                        });
                    }
                } catch (err) { console.error(err); }

                setGes(total.toFixed(2));
                setYearUmsatz(year.toFixed(2));
                setMonthUmsatz(month.toFixed(2));
                setExpensesSum(expSum.toFixed(2));
                setYearGewinn((year - expSum).toFixed(2));
            } catch (e) { console.error(e); }
        };
        loadData();
    }, []);

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Revenue Card - Blue Gradient */}
                <Card className="border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-white/90">Gesamter Umsatz</CardTitle>
                        <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                            <Euro className="h-6 w-6 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white">{ges}€</div>
                        <p className="text-xs text-white/80">+20.1% vom letzten Monat</p>
                    </CardContent>
                </Card>

                {/* Yearly Revenue - Purple Gradient */}
                <Card className="border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-white/90">Jahresumsatz</CardTitle>
                        <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white">{yearUmsatz}€</div>
                        <p className="text-xs text-white/80">Aktuelles Jahr</p>
                    </CardContent>
                </Card>

                {/* Profit - Green Gradient */}
                <Card className="border-0 bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-white/90">Jahresgewinn</CardTitle>
                        <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                            <PiggyBank className="h-6 w-6 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white">{yearGewinn}€</div>
                        <p className="text-xs text-white/80">Nach Abzug von {expensesSum}€ Ausgaben</p>
                    </CardContent>
                </Card>

                {/* Invoice Count - Orange Gradient */}
                <Card className="border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-white/90">Rechnungen</CardTitle>
                        <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                            <FileText className="h-6 w-6 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white">{count}</div>
                        <p className="text-xs text-white/80">Erstellt insgesamt</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Umsatzübersicht {new Date().getFullYear()}</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis
                                    dataKey="month"
                                    stroke="#6b7280"
                                    style={{ fontSize: '12px' }}
                                />
                                <YAxis
                                    stroke="#6b7280"
                                    style={{ fontSize: '12px' }}
                                    tickFormatter={(value) => `${value}€`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                    formatter={(value) => [`${value.toFixed(2)}€`, 'Umsatz']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Offene Rechnungen</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {u_rechnungen?.list?.slice(0, 5).map((item) => (
                                <div key={item.rechnung} className="flex items-center cursor-pointer hover:bg-muted/50 p-2 rounded-md" onClick={() => navigate("/kunden-viewer/" + item.id)}>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{item.rechnung}</p>
                                        <p className="text-sm text-muted-foreground">Kunde: {item.id}</p>
                                    </div>
                                    <div className="ml-auto font-medium">
                                        <PaymentStatusBadge invoiceNumber={item.rechnung} />
                                    </div>
                                </div>
                            ))}
                            {(!u_rechnungen?.list || u_rechnungen?.list?.length === 0) && (
                                <p className="text-center text-sm text-muted-foreground p-4">Keine offenen Rechnungen.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
