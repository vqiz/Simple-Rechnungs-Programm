import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileDown, UploadCloud, PlusCircle, Search, RefreshCw, MoreVertical, Paperclip, Edit2, Trash2, Info } from "lucide-react"

const mockExpenses = [
    { id: 1, date: "Seit 01.01.2024", title: "Adobe Creative Cloud", category: "Software & Lizenzen", provider: "Adobe Systems", amount: "178.47", isRecurring: true, hasAttachment: true, isGrouped: true, count: 3 },
    { id: 2, date: "12.03.2024", title: "Tankfüllung Firmenwagen", category: "Fahrtkosten", provider: "Shell", amount: "84.20", isRecurring: false, hasAttachment: true },
    { id: 3, date: "05.03.2024", title: "Druckerpapier & Toner", category: "Büromaterial", provider: "Staples", amount: "142.50", isRecurring: false, hasAttachment: false },
    { id: 4, date: "01.01.2024 - 01.03.2024", title: "Büromiete", category: "Miete", provider: "Immobilien GmbH", amount: "2550.00", isRecurring: true, hasAttachment: true, isGrouped: true, count: 3 },
    { id: 5, date: "28.02.2024", title: "Geschäftsessen Kunde XYZ", category: "Bewirtung", provider: "Restaurant L'Osteria", amount: "112.80", isRecurring: false, hasAttachment: true },
]

// Custom Info Tooltip Wrapper for Documentation
const DocInfo = ({ title, children }) => (
    <div className="mt-4 mb-6 p-4 border border-blue-200 bg-blue-50/50 rounded-lg text-sm text-blue-900 shadow-sm dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-100">
        <div className="flex items-center gap-2 font-semibold mb-1">
            <Info className="h-4 w-4 text-primary" />
            {title}
        </div>
        <div className="text-muted-foreground leading-relaxed">
            {children}
        </div>
    </div>
)

export default function MockAusgaben() {
    return (
        <div className="flex-1 space-y-6 p-8 pt-6 h-[800px] overflow-y-auto w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Ausgaben</h2>
                    <p className="text-muted-foreground mt-1">Verwalten Sie Ihre geschäftlichen Ausgaben und wiederkehrenden Kosten.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="outline" className="gap-2 rounded-full">
                        <FileDown className="h-4 w-4" />
                        Exportieren
                    </Button>
                    <Button variant="outline" className="gap-2 rounded-full">
                        <UploadCloud className="h-4 w-4" />
                        Importieren
                    </Button>
                    <Button className="gap-2 bg-primary hover:bg-primary/90 rounded-md">
                        <PlusCircle className="h-4 w-4" />
                        Ausgabe erfassen
                    </Button>
                </div>
            </div>

            <DocInfo title="Ausgaben-Verwaltung">
                Erfassen Sie hier all Ihre Betriebsausgaben. Rechnix erkennt durch die Eingabe automatisch wiederkehrende Kosten und zieht diese Summen dynamisch in Echtzeit von der "Gewinn/Verlust"-Berechnung in der Finanzübersicht ab. Über den Import-Bereich können zudem elektronische Rechnungen (ZUGFeRD) mit einem Klick ausgelesen und übernommen werden.
            </DocInfo>

            <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Ausgaben suchen..."
                        className="pl-8 rounded-full focus-visible:ring-primary"
                    />
                </div>
                <Button variant="ghost" size="icon" className="rounded-xl">
                    <RefreshCw className="h-4 w-4 text-muted-foreground" />
                </Button>
            </div>

            <div className="rounded-md border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[120px] font-semibold">Datum</TableHead>
                            <TableHead className="font-semibold">Titel</TableHead>
                            <TableHead className="font-semibold">Kategorie</TableHead>
                            <TableHead className="font-semibold">Anbieter</TableHead>
                            <TableHead className="text-right font-semibold">Betrag</TableHead>
                            <TableHead className="w-[100px] font-semibold text-center">Abo</TableHead>
                            <TableHead className="w-[80px] text-right font-semibold">Aktionen</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockExpenses.map((expense) => (
                            <TableRow key={expense.id} className="hover:bg-muted/50 transition-colors cursor-default">
                                <TableCell className="text-muted-foreground whitespace-nowrap">{expense.date}</TableCell>
                                <TableCell className="font-medium">
                                    {expense.title}
                                    {expense.isGrouped && expense.count > 1 && (
                                        <span className="ml-2 text-xs font-normal text-muted-foreground">({expense.count} Raten)</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-muted/20">
                                        {expense.category}
                                    </span>
                                </TableCell>
                                <TableCell>{expense.provider}</TableCell>
                                <TableCell className="text-right font-mono text-red-500 font-medium">-{expense.amount} €</TableCell>
                                <TableCell className="text-center">
                                    {expense.isRecurring && (
                                        <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                                            Abo
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
