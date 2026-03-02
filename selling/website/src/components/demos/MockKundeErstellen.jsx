import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Info, X, PlusCircle } from "lucide-react"

const DocInfo = ({ title, children }) => (
    <div className="mt-4 mb-4 p-4 border border-blue-200 bg-blue-50/50 rounded-lg text-sm text-blue-900 shadow-sm dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-100">
        <div className="flex items-center gap-2 font-semibold mb-1">
            <Info className="h-4 w-4 text-primary" />
            {title}
        </div>
        <div className="text-muted-foreground leading-relaxed">{children}</div>
    </div>
)

export default function MockKundeErstellen() {
    const [istFirma, setIstFirma] = useState(false)

    return (
        <div className="flex-1 h-[800px] overflow-y-auto bg-background/50 flex items-start justify-center p-8">
            <div className="w-[600px] max-w-full">
                <DocInfo title="Neuen Kunden anlegen – Modal-Dialog">
                    Wenn Du in der Kundenverwaltung auf «Neuer Kunde» klickst, öffnet sich exakt dieses Formular als modaler Dialog. Hier erfasst Du alle Kontaktdaten des neuen Kunden in einem einzigen Schritt.
                </DocInfo>

                {/* The modal card (matches the ModalDialog from src) */}
                <div className="rounded-2xl border shadow-xl overflow-hidden bg-white dark:bg-card">

                    {/* Header (exact match from src) */}
                    <div className="p-5 flex justify-between items-center bg-muted/30">
                        <h2 className="text-xl font-semibold">Neuen Kunden anlegen</h2>
                        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                    <Separator />

                    {/* Body (matches the Stack from src) */}
                    <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5">

                        {/* Typ Toggle (exact match from src) */}
                        <div className="flex items-center justify-center gap-4 p-3 bg-muted/30 rounded-xl">
                            <span className={`text-sm font-medium transition-colors ${!istFirma ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                                Privatperson
                            </span>
                            <Switch
                                checked={istFirma}
                                onCheckedChange={setIstFirma}
                                className="data-[state=checked]:bg-primary"
                            />
                            <span className={`text-sm font-medium transition-colors ${istFirma ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                                Unternehmen
                            </span>
                        </div>

                        {/* Name Field */}
                        <div className="space-y-1.5">
                            <Label className="after:content-['*'] after:ml-0.5 after:text-destructive">
                                {istFirma ? "Firmenname" : "Vor- und Nachname"}
                            </Label>
                            <Input placeholder={istFirma ? "Musterfirma GmbH" : "Max Mustermann"} />
                        </div>

                        {/* Address: Straße + Nr */}
                        <div className="grid grid-cols-[2fr_1fr] gap-3">
                            <div className="space-y-1.5">
                                <Label>Straße</Label>
                                <Input placeholder="Hauptstraße" />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Nr.</Label>
                                <Input placeholder="1" />
                            </div>
                        </div>

                        {/* Address: PLZ + Ort */}
                        <div className="grid grid-cols-[1fr_2fr] gap-3">
                            <div className="space-y-1.5">
                                <Label>PLZ</Label>
                                <Input placeholder="12345" />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Ort</Label>
                                <Input placeholder="Musterstadt" />
                            </div>
                        </div>

                        {/* Land + Bundesland */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label>Land (ISO)</Label>
                                <Input defaultValue="DE" placeholder="DE" />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Bundesland</Label>
                                <Input placeholder="Bayern" />
                            </div>
                        </div>

                        {/* Divider: Kontakt */}
                        <div className="relative">
                            <Separator />
                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-card px-2 text-xs text-muted-foreground">Kontakt</span>
                        </div>

                        <div className="space-y-1.5">
                            <Label>Email Adresse</Label>
                            <Input placeholder="email@example.com" type="email" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Telefonnummer</Label>
                            <Input placeholder="+49 123 456789" />
                        </div>

                        {/* Firmen Details (only visible when istFirma) */}
                        {istFirma && (
                            <>
                                <div className="relative">
                                    <Separator />
                                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-card px-2 text-xs text-muted-foreground">Firmen Details</span>
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Ansprechpartner</Label>
                                    <Input placeholder="z.B. Frau Schmidt" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Umsatzsteuer-ID</Label>
                                    <Input placeholder="DE123456789" />
                                </div>
                            </>
                        )}

                        <div className="space-y-1.5">
                            <Label>Leitweg-ID (X-Rechnung)</Label>
                            <Input placeholder="0000-0000-00" />
                        </div>
                    </div>

                    <Separator />

                    {/* Footer (exact footer from src) */}
                    <div className="p-4 flex justify-end gap-2 bg-muted/20">
                        <Button variant="ghost">Abbrechen</Button>
                        <Button className="gap-2">
                            <PlusCircle className="h-4 w-4" />
                            Kunden erstellen
                        </Button>
                    </div>
                </div>

                <DocInfo title="Interaktiver Toggle: Privatperson vs. Firma">
                    Der Schalter oben im Formular wechselt die Ansicht dynamisch. Bei «Unternehmen» erscheinen zusätzliche Felder für Ansprechpartner und Umsatzsteuer-ID. Probiere es aus – der Toggle ist in dieser Demo live schaltbar!
                </DocInfo>
            </div>
        </div>
    )
}
