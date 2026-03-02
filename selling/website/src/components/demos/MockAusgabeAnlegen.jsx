import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadCloud, CheckCircle2, Wallet, Calendar, AlertCircle, Info, Trash2 } from "lucide-react"

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

export default function MockAusgabeAnlegen() {
    const [isRecurring, setIsRecurring] = useState(false)

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 h-[800px] overflow-y-auto w-full bg-muted/10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Ausgabe erfassen</h2>
                    <p className="text-muted-foreground mt-1">Legen Sie eine neue betriebliche Ausgabe an.</p>
                </div>
            </div>

            <DocInfo title="Ausgaben Formular">
                Über dieses Formular erfassen Sie neue Kosten. Rechnix erlaubt es Ihnen, Belege (PDF/Bilder) direkt an die Ausgabe anzuhängen. Wenn Sie die Ausgabe als "Wiederkehrend" markieren, wird sie automatisch jeden Monat/Jahr in Ihren Statistiken berücksichtigt, ohne dass Sie diese erneut eintragen müssen.
            </DocInfo>

            <div className="max-w-3xl mx-auto">
                <Card className="shadow-sm border-muted">
                    <CardHeader className="bg-muted/30 border-b border-muted">
                        <CardTitle className="flex items-center gap-2">
                            <Wallet className="h-5 w-5 text-primary" />
                            Neue Betriebsausgabe
                        </CardTitle>
                        <CardDescription>Tragen Sie die Details der Rechnung oder Quittung ein.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Titel/Beschreibung <span className="text-red-500">*</span></Label>
                                <Input id="title" placeholder="z.B. Büromaterial Staples" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="provider">Anbieter/Lieferant</Label>
                                <Input id="provider" placeholder="z.B. Staples GmbH" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="category">Kategorie <span className="text-red-500">*</span></Label>
                                <Select defaultValue="buero">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Kategorie wählen" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="buero">Büromaterial</SelectItem>
                                        <SelectItem value="fahrt">Fahrtkosten</SelectItem>
                                        <SelectItem value="software">Software & Lizenzen</SelectItem>
                                        <SelectItem value="miete">Miete & Nebenkosten</SelectItem>
                                        <SelectItem value="werbung">Werbung & Marketing</SelectItem>
                                        <SelectItem value="sonstiges">Sonstiges</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date" className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    Belegdatum <span className="text-red-500">*</span>
                                </Label>
                                <Input id="date" type="date" className="w-full" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount">Bruttobetrag (€) <span className="text-red-500">*</span></Label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-muted-foreground">€</span>
                                <Input id="amount" type="number" placeholder="0.00" className="pl-8 text-lg font-medium" />
                            </div>
                        </div>

                        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-semibold text-primary">Abonnement / Wiederkehrend</Label>
                                    <p className="text-sm text-muted-foreground">Wird dieser Betrag regelmäßig abgebucht?</p>
                                </div>
                                <Switch checked={isRecurring} onCheckedChange={setIsRecurring} />
                            </div>

                            {isRecurring && (
                                <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                    <div className="space-y-2">
                                        <Label>Intervall</Label>
                                        <Select defaultValue="monatlich">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Intervall wählen" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="monatlich">Monatlich</SelectItem>
                                                <SelectItem value="quartal">Quartalsweise</SelectItem>
                                                <SelectItem value="jaehrlich">Jährlich</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2 flex items-center pt-6 text-sm text-amber-600 font-medium">
                                        <AlertCircle className="h-4 w-4 mr-2" />
                                        Wird in den Statistiken fortlaufend berechnet.
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Beleg anhängen (PDF, JPG, PNG)</Label>

                            <div className="space-y-3">
                                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                    <UploadCloud className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                    <div className="text-sm font-medium">Dateien hinzufügen (PDF, JPG, PNG, XML)</div>
                                </div>

                                {/* Mock Pending File 1 */}
                                <div className="p-3 border rounded-md bg-muted/30 relative flex items-center justify-between">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="h-10 w-10 flex items-center justify-center bg-background rounded border text-muted-foreground">
                                            📄
                                        </div>
                                        <div className="flex flex-col truncate">
                                            <span className="text-sm font-medium truncate">Server-Miete-Januar.pdf</span>
                                            <span className="text-xs text-muted-foreground">Neue Datei</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Mock Pending File 2 */}
                                <div className="p-3 border rounded-md bg-muted/30 relative flex items-center justify-between">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="h-10 w-10 flex items-center justify-center bg-background rounded border text-muted-foreground">
                                            📄
                                        </div>
                                        <div className="flex flex-col truncate">
                                            <span className="text-sm font-medium truncate">Server-Miete-Februar.pdf</span>
                                            <span className="text-xs text-muted-foreground">Neue Datei</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                    </CardContent>
                    <CardFooter className="bg-muted/30 border-t border-muted px-6 py-4 flex justify-between items-center">
                        <Button variant="ghost">Abbrechen</Button>
                        <Button className="gap-2 bg-primary">
                            <CheckCircle2 className="h-4 w-4" />
                            Ausgabe speichern
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
