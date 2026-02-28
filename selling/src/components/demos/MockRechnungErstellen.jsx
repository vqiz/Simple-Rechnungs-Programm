import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Info, Search, PlusCircle, Trash2, FileText, Save, ChevronsUpDown, MinusCircle } from "lucide-react"

const DocInfo = ({ title, children, className = "" }) => (
    <div className={`mt-4 p-4 border border-blue-200 bg-blue-50/50 rounded-lg text-sm text-blue-900 shadow-sm dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-100 ${className}`}>
        <div className="flex items-center gap-2 font-semibold mb-1">
            <Info className="h-4 w-4 text-primary" />
            {title}
        </div>
        <div className="text-muted-foreground leading-relaxed">
            {children}
        </div>
    </div>
)

export default function MockRechnungErstellen() {
    return (
        <div className="flex flex-col h-[800px] w-full bg-muted/20 relative">

            {/* Real Header matching src */}
            <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6 shadow-sm">
                <div className="flex items-center gap-2 font-semibold text-lg">
                    <FileText className="h-6 w-6 text-primary" />
                    <h1>Neue Rechnung</h1>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <Button variant="outline">Abbrechen</Button>
                    <Button>
                        <Save className="mr-2 h-4 w-4" />
                        Rechnung erstellen
                    </Button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar: Product Browser matching src */}
                <aside className="w-80 border-r bg-background flex flex-col shrink-0">
                    <div className="p-4 border-b space-y-4">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Produkte suchen..." className="pl-8" />
                        </div>
                        <Button className="w-full" variant="secondary">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Neues Produkt
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        <div>
                            <h3 className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                DIENSTLEISTUNGEN
                            </h3>
                            <div className="space-y-1">
                                <div className="group flex items-center justify-between rounded-md p-2 hover:bg-accent hover:text-accent-foreground text-sm transition-colors cursor-default">
                                    <div className="font-medium">Webdesign Beratung</div>
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="icon" className="h-6 w-6"><MinusCircle className="h-4 w-4" /></Button>
                                        <span className="w-4 text-center font-bold text-primary">5</span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6"><PlusCircle className="h-4 w-4" /></Button>
                                    </div>
                                </div>
                                <div className="group flex items-center justify-between rounded-md p-2 hover:bg-accent hover:text-accent-foreground text-sm transition-colors cursor-default">
                                    <div className="font-medium">SEO Audit</div>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <PlusCircle className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <DocInfo title="Produkt-Sidebar">
                            Suche und klicke auf Produkte, um sie direkt Deiner Rechnung rechts hinzuzufügen. Das Mengenzähler-Interface erscheint automatisch beim ersten Klick.
                        </DocInfo>
                    </div>
                </aside>

                {/* Main Content: Invoice Preview matching src */}
                <main className="flex-1 overflow-y-auto p-8 flex flex-col items-center bg-gray-50/50">
                    <Card className="w-full max-w-4xl h-fit min-h-[600px] flex flex-col shadow-lg border-border/50">
                        <CardHeader className="flex flex-row justify-between items-start border-b pb-6 space-y-0 relative z-10 bg-card rounded-t-xl">
                            <div>
                                <CardTitle className="text-2xl font-bold">Rechnung</CardTitle>
                                <CardDescription>Entwurf</CardDescription>
                            </div>
                            <div className="w-72">
                                <Label className="text-xs text-muted-foreground">Kunde</Label>
                                <Button variant="outline" role="combobox" className="w-full justify-between mt-1.5 font-normal">
                                    Max Mustermann
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                                <div className="mt-2 text-sm text-muted-foreground pl-1">
                                    <div>Musterstraße 1</div>
                                    <div>80331 München</div>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="flex-1 py-6 bg-card">
                            <div className="space-y-6">
                                {/* Positions Table */}
                                <div className="rounded-md border">
                                    <div className="grid grid-cols-[3fr_1fr_1fr_1fr_40px] gap-4 p-3 bg-muted/50 text-xs font-medium text-muted-foreground border-b uppercase tracking-wider">
                                        <div>Position</div>
                                        <div className="text-center">Menge</div>
                                        <div className="text-right">Einzelpreis</div>
                                        <div className="text-right">Gesamt</div>
                                        <div></div>
                                    </div>

                                    <div className="grid grid-cols-[3fr_1fr_1fr_1fr_40px] gap-4 p-3 items-center text-sm border-b hover:bg-muted/20 transition-colors">
                                        <div className="font-medium">Webdesign Beratung</div>
                                        <div className="text-center cursor-pointer hover:underline text-primary">5</div>
                                        <div className="text-right text-muted-foreground">90.00 €</div>
                                        <div className="text-right font-medium">450.00 €</div>
                                        <div className="flex justify-end">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-[3fr_1fr_1fr_1fr_40px] gap-4 p-3 items-center text-sm hover:bg-muted/20 transition-colors">
                                        <div className="font-medium">Hosting & Domain</div>
                                        <div className="text-center cursor-pointer hover:underline text-primary">1</div>
                                        <div className="text-right text-muted-foreground">120.00 €</div>
                                        <div className="text-right font-medium">120.00 €</div>
                                        <div className="flex justify-end">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Info & Comments */}
                                <div className="grid grid-cols-2 gap-8 pt-4">
                                    <div className="space-y-2">
                                        <Label>Interne Notizen / Kommentar</Label>
                                        <Textarea
                                            placeholder="Wird auf der Rechnung angezeigt..."
                                            className="resize-none"
                                            rows={4}
                                            defaultValue="vielen Dank für Ihren Auftrag. Anbei erhalten Sie die Rechnung über die erbrachten Leistungen."
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="bg-muted/30 border-t p-6 rounded-b-xl z-10">
                            <div className="w-full flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Switch id="tax-mode" checked={true} />
                                    <Label htmlFor="tax-mode">Preise Netto anzeigen</Label>
                                </div>
                                <div className="text-right space-y-1">
                                    <div className="text-sm text-muted-foreground">Gesamtsumme (€)</div>
                                    <div className="text-3xl font-bold tracking-tight text-primary">
                                        570.00 €
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        exkl. MwSt.
                                    </div>
                                </div>
                            </div>
                        </CardFooter>
                    </Card>

                    <div className="w-full max-w-4xl mt-6">
                        <DocInfo title="1:1 Rechnungsvorschau">
                            So exakt sieht der Editor im Programm aus. Die Berechnung der Gesamtsummen und Steuern erfolgt in Echtzeit während Du Änderungen vornimmst.
                        </DocInfo>
                    </div>
                </main>
            </div>
        </div>
    )
}
