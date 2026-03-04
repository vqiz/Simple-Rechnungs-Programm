import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Info, ArrowLeft, Clock, Banknote, Tag, Paperclip, UploadCloud, Trash2, MoreVertical, Edit2 } from "lucide-react"

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

const mockSubExpenses = [
    { id: 1, date: "01.03.2024", amount: "59.49", attachments: [{ name: "adobe_march_invoice.pdf" }] },
    { id: 2, date: "01.02.2024", amount: "59.49", attachments: [{ name: "adobe_feb_invoice.pdf" }] },
    { id: 3, date: "01.01.2024", amount: "59.49", attachments: [] },
]

export default function MockAusgabenViewer() {
    return (
        <div className="flex-1 w-full h-[800px] p-8 bg-background overflow-y-auto">
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" className="rounded-full">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Adobe Creative Cloud</h2>
                        <p className="text-muted-foreground flex items-center gap-2 mt-1">Wiederkehrendes Abo</p>
                    </div>
                </div>
            </div>

            <DocInfo title="Ausgabe ansehen (Abo-Management)">
                In dieser exklusiven Detail-Ansicht für wiederkehrende Ausgaben (Abos) können Sie jede einzelne monatliche Abbuchung separat verwalten. Fügen Sie punktgenaue Belege (z.B. monatliche Einzelrechnungen) exakt zum zutreffenden Buchungsmonat hinzu. Das Abo-System errechnet automatisch die Gesamtsumme all Ihrer Zahlungen.
            </DocInfo>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left Column: Master Details */}
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Info className="h-5 w-5 text-primary" />
                                Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Banknote className="h-4 w-4" /> Anbieter / Zweck
                                </h4>
                                <p className="mt-1 text-base">Adobe Systems</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Tag className="h-4 w-4" /> Kategorie
                                </h4>
                                <p className="mt-1 text-base">
                                    <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-muted/20">
                                        Software & Lizenzen
                                    </span>
                                </p>
                            </div>

                            <div className="pt-4 border-t">
                                <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    Betrag pro Rate
                                </h4>
                                <p className="mt-1 text-2xl font-semibold text-foreground">
                                    -59.49 €
                                </p>
                            </div>
                            <div className="pt-2 border-t">
                                <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    Bisherige Buchungen
                                </h4>
                                <p className="mt-1 text-xl font-medium text-muted-foreground">
                                    3 <span className="text-sm font-normal text-muted-foreground">Monate/Raten</span>
                                </p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    Gesamtsumme
                                </h4>
                                <p className="mt-1 text-2xl font-bold text-red-500">
                                    -178.47 €
                                </p>
                            </div>
                        </CardContent>
                        <div className="p-6 pt-0 mt-4">
                            <Button variant="outline" className="w-full gap-2 hover:bg-muted/50 transition-colors">
                                <Edit2 className="h-4 w-4" /> Abo / Master bearbeiten
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Deductions / Attachments */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-primary" />
                                Abbuchungen & Belege
                            </CardTitle>
                            <CardDescription>
                                Hier sehen Sie jede einzelne Abbuchung dieses Abos. Sie können Rechnungen spezifisch für den jeweiligen Monat anheften.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead className="w-[120px]">Datum</TableHead>
                                            <TableHead>Betrag</TableHead>
                                            <TableHead>Anhänge</TableHead>
                                            <TableHead className="text-right">Aktionen</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {mockSubExpenses.map((exp) => (
                                            <TableRow key={exp.id}>
                                                <TableCell className="font-medium whitespace-nowrap">
                                                    {exp.date}
                                                </TableCell>
                                                <TableCell className="font-mono text-red-500">
                                                    -{exp.amount} €
                                                </TableCell>
                                                <TableCell>
                                                    {exp.attachments && exp.attachments.length > 0 ? (
                                                        <div className="flex flex-col gap-1">
                                                            {exp.attachments.map((att, idx) => (
                                                                <Button
                                                                    key={idx}
                                                                    variant="link"
                                                                    className="h-auto p-0 text-xs justify-start text-primary"
                                                                >
                                                                    <Paperclip className="h-3 w-3 mr-1" />
                                                                    <span className="truncate max-w-[150px]">{att.name}</span>
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">Keine Belege</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    )
}
