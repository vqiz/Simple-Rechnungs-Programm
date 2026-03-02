import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Package, Tag, Calculator, Info } from "lucide-react"

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

export default function MockProduktAnlegen() {
    const [netto, setNetto] = useState("100.00")
    const [tax, setTax] = useState("19")

    // Simple reactive calculation for the mock
    const brutto = (parseFloat(netto || 0) * (1 + parseFloat(tax || 0) / 100)).toFixed(2)

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 h-[800px] overflow-y-auto w-full bg-muted/10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Produkt anlegen</h2>
                    <p className="text-muted-foreground mt-1">Fügen Sie einen neuen Artikel oder eine Dienstleistung hinzu.</p>
                </div>
            </div>

            <DocInfo title="Produkterstellung">
                Hier definieren Sie die Stammartikel für Ihre Rechnungen. Sie müssen lediglich den Nettopreis und den Steuersatz hinterlegen – Rechnix berechnet den Bruttopreis automatisch.
                Die Zuordnung zu einer Kategorie hilft Ihnen später, die Artikel in der Rechnungserstellung schnell zu finden.
            </DocInfo>

            <div className="max-w-3xl mx-auto">
                <Card className="shadow-sm border-muted">
                    <CardHeader className="bg-muted/30 border-b border-muted">
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-primary" />
                            Artikel Details
                        </CardTitle>
                        <CardDescription>Tragen Sie Stammdaten für das Inventar ein.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                            <div className="space-y-2 relative pb-4">
                                <Label htmlFor="name">Produktname <span className="text-red-500">*</span></Label>
                                <Input id="name" placeholder="z.B. Webdesign Basic Paket" />
                                <p className="text-[10px] text-muted-foreground mt-1 leading-tight absolute">
                                    (Zeitbasierte Produkte müssen "stunde" enthalten)
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category" className="flex items-center gap-2">
                                    <Tag className="h-4 w-4 text-muted-foreground" />
                                    Kategorie <span className="text-red-500">*</span>
                                </Label>
                                <Select defaultValue="dienstleistungen">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Kategorie wählen" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="dienstleistungen">Dienstleistungen</SelectItem>
                                        <SelectItem value="hardware">Hardware</SelectItem>
                                        <SelectItem value="software">Software</SelectItem>
                                        <SelectItem value="pakete">Pakete & Bundles</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="p-5 rounded-lg border bg-card/50 space-y-6">
                            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                <Calculator className="h-4 w-4" />
                                Preisgestaltung
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="netto">Nettopreis (€) <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="netto"
                                        type="number"
                                        value={netto}
                                        onChange={(e) => setNetto(e.target.value)}
                                        className="font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tax">Steuersatz (%) <span className="text-red-500">*</span></Label>
                                    <Select value={tax} onValueChange={setTax}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="19">19% (Standard)</SelectItem>
                                            <SelectItem value="7">7% (Ermäßigt)</SelectItem>
                                            <SelectItem value="0">0% (Steuerfrei)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="brutto">Bruttopreis (€)</Label>
                                    <Input
                                        id="brutto"
                                        value={brutto}
                                        disabled
                                        className="bg-muted/50 font-mono font-semibold"
                                    />
                                </div>
                            </div>
                        </div>

                    </CardContent>
                    <CardFooter className="bg-muted/30 border-t border-muted px-6 py-4 flex justify-between items-center">
                        <Button variant="ghost">Abbrechen</Button>
                        <Button className="gap-2 bg-primary">
                            <CheckCircle2 className="h-4 w-4" />
                            Produkt speichern
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
