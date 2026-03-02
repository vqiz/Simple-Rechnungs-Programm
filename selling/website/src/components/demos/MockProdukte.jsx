import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Search, RefreshCw, MoreVertical, Info, Layers, Package } from "lucide-react"

const mockProducts = [
    { id: 1, name: "Consulting Stunde", category: "Dienstleistungen", price: "120.00", tax: "19" },
    { id: 2, name: "Webdesign Basic", category: "Pakete", price: "1500.00", tax: "19" },
    { id: 3, name: "Wartungsvertrag Monat", category: "Dienstleistungen", price: "250.00", tax: "19" },
    { id: 4, name: "SEO Optimierung", category: "Pakete", price: "800.00", tax: "19" },
    { id: 5, name: "Domain Registrierung", category: "Hosting", price: "15.00", tax: "19" },
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

export default function MockProdukte() {
    return (
        <div className="flex-1 space-y-6 p-8 pt-6 h-[800px] overflow-y-auto w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Produkte</h2>
                    <p className="text-muted-foreground mt-1">Verwalten Sie Ihr Inventar und Dienstleistungen.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="outline" className="gap-2 rounded-full">
                        <Layers className="h-4 w-4" />
                        Kategorie erstellen
                    </Button>
                    <Button className="gap-2 bg-primary hover:bg-primary/90 rounded-md">
                        <PlusCircle className="h-4 w-4" />
                        Neues Produkt
                    </Button>
                </div>
            </div>

            <DocInfo title="Produktverwaltung">
                Legen Sie hier all Ihre Artikel, Materialien oder Dienstleistungen an. Rechnix speichert Ihre Einträge sicher ab. Beim Erstellen einer Rechnung oder eines Angebots können Sie auf diesen Katalog direkt zurückgreifen und Positionen mit einem Klick in das Dokument laden – inklusive der vorkonfigurierten Preise und MwSt.-Sätze.
            </DocInfo>

            <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Produkt suchen..."
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
                            <TableHead className="font-semibold w-[30%]">Produktname</TableHead>
                            <TableHead className="font-semibold w-[20%]">Kategorie</TableHead>
                            <TableHead className="text-right font-semibold w-[15%]">Netto (€)</TableHead>
                            <TableHead className="text-right font-semibold w-[15%]">Steuer (%)</TableHead>
                            <TableHead className="text-right font-semibold w-[10%]">Aktionen</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockProducts.map((product) => (
                            <TableRow key={product.id} className="hover:bg-muted/50 transition-colors cursor-default">
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        {product.name}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-muted/20">
                                        {product.category}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right font-mono font-medium">{product.price} €</TableCell>
                                <TableCell className="text-right">{product.tax} %</TableCell>
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
