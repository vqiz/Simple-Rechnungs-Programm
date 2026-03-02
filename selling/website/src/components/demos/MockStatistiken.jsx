import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Euro, TrendingUp, TrendingDown, FileText, Info, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

const chartData = [
    { month: 'Jan', income: 4200, expenses: 1200 },
    { month: 'Feb', income: 3800, expenses: 1500 },
    { month: 'Mär', income: 5100, expenses: 1100 },
    { month: 'Apr', income: 4200, expenses: 1800 },
    { month: 'Mai', income: 6300, expenses: 1400 },
    { month: 'Jun', income: 5800, expenses: 1900 },
]

const pieData = [
    { name: 'Software & Lizenzen', value: 800 },
    { name: 'Büromaterial', value: 300 },
    { name: 'Fahrtkosten', value: 450 },
    { name: 'Marketing', value: 1200 },
]
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']

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

export default function MockStatistiken() {
    return (
        <div className="flex-1 space-y-6 p-8 pt-6 h-[800px] overflow-y-auto w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Finanzübersicht</h2>
                    <p className="text-muted-foreground mt-1">Analysieren Sie Ihre Einnahmen und Ausgaben</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <select className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                        <option>2026</option>
                        <option>2025</option>
                    </select>
                    <select className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                        <option>Ganzes Jahr</option>
                        <option>Januar</option>
                        <option>Februar</option>
                    </select>
                    <Button className="gap-2 bg-primary hover:bg-primary/90">
                        <Download className="h-4 w-4" />
                        Exportieren (ZIP)
                    </Button>
                </div>
            </div>

            <DocInfo title="ZIP Jahresabschluss-Export">
                Mit dem neuen Export-Tool kannst Du ein ganzes Jahr oder einen ausgewählten Monat (z.B. für die monatliche UStVA) komplett als ZIP-Datei exportieren. Die Datei enthält ordnerstrukturiert alle Rechnungen, Ausgabebelege sowie formatierte PDF-Tabellen (Einnahmenüberschussrechnung).
            </DocInfo>

            {/* 1:1 Metric Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
                <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Gesamte Einnahmen</CardTitle>
                        <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">29.400,00 €</div>
                        <p className="text-xs text-muted-foreground mt-1">Bruttoeinkommen</p>
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
                        <div className="text-2xl font-bold text-red-600">8.900,00 €</div>
                        <p className="text-xs text-muted-foreground mt-1">Betriebsausgaben</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-primary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Gewinn / Verlust</CardTitle>
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-primary/10">
                            <Euro className="h-4 w-4 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">20.500,00 €</div>
                        <p className="text-xs text-muted-foreground mt-1">Jahresüberschuss</p>
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
                        <div className="text-2xl font-bold text-purple-600">4.694,11 €</div>
                        <p className="text-xs text-muted-foreground mt-1">Umsatzsteuer</p>
                    </CardContent>
                </Card>
            </div>

            <DocInfo title="Finanz-Kacheln">
                Die Übersicht berechnet dynamisch den Gewinn und Verlust anhand Deiner dokumentierten Einnahmen und hochgeladenen Ausgabenbelege. Rechnix erkennt auch vollautomatisch, wie viel Umsatzsteuer Du eingenommen hast.
            </DocInfo>

            {/* Charts Grid */}
            <div className="grid gap-6 lg:grid-cols-2 mt-6">
                <div className="flex flex-col">
                    <Card className="flex-1">
                        <CardHeader>
                            <CardTitle>Jahresverlauf</CardTitle>
                            <CardDescription>Einnahmen und Ausgaben pro Monat</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} />
                                        <YAxis stroke="#6b7280" fontSize={12} tickLine={false} tickFormatter={(value) => value + "€"} />
                                        <RechartsTooltip />
                                        <Bar dataKey="income" fill="#10b981" name="Einnahmen" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="expenses" fill="#ef4444" name="Ausgaben" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                    <DocInfo title="Jahresverlauf Diagramm">
                        Einnahmen und Ausgaben werden hier direkt gegenübergestellt, um saisonale Schwankungen schneller visuell identifizieren zu können.
                    </DocInfo>
                </div>

                <div className="flex flex-col">
                    <Card className="flex-1">
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
                                            label={({ name, percent }) => name + " (" + (percent * 100).toFixed(0) + "%)"}
                                            outerRadius={80}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={"cell-" + index} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip formatter={(value) => value.toFixed(2) + "€"} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                    <DocInfo title="Kategorisierte Ausgaben">
                        Beim Anlegen von Ausgaben (z.B. Tankquittungen, Software) weist Du diesen Kategorien zu. Dieses Diagramm schlüsselt exakt auf, wohin Dein Budget fließt.
                    </DocInfo>
                </div>
            </div>
        </div >
    )
}
