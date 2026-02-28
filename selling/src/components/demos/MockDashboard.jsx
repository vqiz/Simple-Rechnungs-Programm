import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"
import { Euro, TrendingUp, PiggyBank, FileText, Info } from "lucide-react"

const chartData = [
    { month: 'Jan', revenue: 1200 },
    { month: 'Feb', revenue: 1800 },
    { month: 'Mär', revenue: 2400 },
    { month: 'Apr', revenue: 2100 },
    { month: 'Mai', revenue: 3200 },
    { month: 'Jun', revenue: 3800 },
    { month: 'Jul', revenue: 4100 },
    { month: 'Aug', revenue: 4800 },
    { month: 'Sep', revenue: 5100 },
    { month: 'Okt', revenue: 5600 },
    { month: 'Nov', revenue: 6200 },
    { month: 'Dez', revenue: 7000 },
]

const recentInvoices = [
    { rechnung: "R-2024-001", id: "Max Mustermann", status: "Bezahlt" },
    { rechnung: "R-2024-002", id: "Anna Schmidt", status: "Offen" },
    { rechnung: "R-2024-003", id: "Tech Corp GmbH", status: "Überfällig" },
    { rechnung: "R-2024-004", id: "Design Studio", status: "Bezahlt" },
]

// Custom Info Tooltip Wrapper for Documentation
const DocInfo = ({ title, children }) => (
    <div className="mt-4 p-4 border border-blue-200 bg-blue-50/50 rounded-lg text-sm text-blue-900 shadow-sm dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-100">
        <div className="flex items-center gap-2 font-semibold mb-1">
            <Info className="h-4 w-4 text-primary" />
            {title}
        </div>
        <div className="text-muted-foreground leading-relaxed">
            {children}
        </div>
    </div>
)

export default function MockDashboard() {
    return (
        <div className="flex-1 space-y-6 p-8 pt-6 h-[800px] overflow-y-auto w-full">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>

            <DocInfo title="Das Dashboard in Rechnix">
                Hier werden in Echtzeit die wichtigsten Finanzkennzahlen Deines Unternehmens berechnet. Die Werte aktualisieren sich automatisch, sobald Du Rechnungen schreibst oder Ausgaben tätigst.
            </DocInfo>

            {/* 1:1 Metric Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col">
                    <Card className="border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg flex-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-white/90">Gesamter Umsatz</CardTitle>
                            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                                <Euro className="h-6 w-6 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">47.300,00€</div>
                            <p className="text-xs text-white/80">+20.1% vom letzten Monat</p>
                        </CardContent>
                    </Card>
                    <DocInfo title="Gesamtumsatz">Summe aller jemals in Rechnix erstellten Rechnungen (Netto oder Brutto je nach Einstellung).</DocInfo>
                </div>

                <div className="flex flex-col">
                    <Card className="border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg flex-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-white/90">Jahresumsatz</CardTitle>
                            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">24.500,00€</div>
                            <p className="text-xs text-white/80">Aktuelles Jahr</p>
                        </CardContent>
                    </Card>
                    <DocInfo title="Jahresumsatz">Zeigt den aggregierten Umsatz des jeweils laufenden Kalenderjahres.</DocInfo>
                </div>

                <div className="flex flex-col">
                    <Card className="border-0 bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg flex-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-white/90">Jahresgewinn</CardTitle>
                            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                                <PiggyBank className="h-6 w-6 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">18.200,00€</div>
                            <p className="text-xs text-white/80">Nach Abzug von 6.300,00€ Ausgaben</p>
                        </CardContent>
                    </Card>
                    <DocInfo title="Jahresgewinn">Berechnet sich automatisch aus Jahresumsatz abzüglich der im Tab "Ausgaben" erfassten Beträge.</DocInfo>
                </div>

                <div className="flex flex-col">
                    <Card className="border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg flex-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-white/90">Rechnungen</CardTitle>
                            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                                <FileText className="h-6 w-6 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">142</div>
                            <p className="text-xs text-white/80">Erstellt insgesamt</p>
                        </CardContent>
                    </Card>
                    <DocInfo title="Rechnungszähler">Die Anzahl aller ausgestellten Rechnungen. Dient auch zur automatischen Vergabe der nächsten Rechnungsnummer.</DocInfo>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 pt-4">
                {/* 1:1 Area Chart */}
                <div className="col-span-4 flex flex-col">
                    <Card className="flex-1">
                        <CardHeader>
                            <CardTitle>Umsatzübersicht {new Date().getFullYear()}</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
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
                                    <RechartsTooltip
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
                                        stroke="#8b5cf6"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <DocInfo title="Umsatzübersicht Diagramm">
                        Dieses Diagramm aggregiert vollautomatisch alle Rechnungen des aktuellen Jahres nach Monaten. Es ist interaktiv – wenn Du im Programm über die Knotenpunkte fährst, siehst Du den genauen Monatsumsatz. Das Diagramm ignoriert stornierte Dokumente.
                    </DocInfo>
                </div>

                {/* 1:1 Recent Invoices List */}
                <div className="col-span-3 flex flex-col">
                    <Card className="flex-1">
                        <CardHeader>
                            <CardTitle>Offene Rechnungen</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {recentInvoices.map((item) => (
                                    <div key={item.rechnung} className="flex items-center hover:bg-muted/50 p-2 rounded-md transition-colors cursor-default">
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">{item.rechnung}</p>
                                            <p className="text-sm text-muted-foreground">Kunde: {item.id}</p>
                                        </div>
                                        <div className="ml-auto font-medium">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${item.status === 'Bezahlt' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                                    item.status === 'Überfällig' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                                                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <DocInfo title="Offene Rechnungen Liste">
                        Dieses Modul bietet direkten Schnellzugriff auf die aktuellsten offenen Posten. Ein Klick auf einen Listeneintrag bringt Dich im echten Programm sofort zur Detailansicht des jeweiligen Kunden.
                    </DocInfo>
                </div>
            </div>
        </div>
    )
}
