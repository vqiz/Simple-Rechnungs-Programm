import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Building2, Image as ImageIcon, Info } from "lucide-react"

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

export default function MockUnternehmen() {
    return (
        <div className="flex-1 space-y-6 p-8 pt-6 h-[800px] overflow-y-auto w-full max-w-6xl mx-auto">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Einstellungen</h2>
            </div>

            {/* Information Banner (1:1 from original) */}
            <div className="flex items-start gap-4 rounded-lg border border-blue-200 bg-blue-50/50 p-4 shadow-sm dark:bg-blue-900/20 dark:border-blue-800">
                <Info className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
                <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-300">Information</h3>
                    <div className="mt-1 text-sm text-blue-800/90 dark:text-blue-200/90">
                        Hier werden die Unternehmensdaten ihres <strong>eigenen</strong> Unternehmens bearbeitet. Diese werden später auf Rechnungen bei <strong>Verkäufer</strong> angezeigt.<br />
                        Alle Pflichtfelder sind für eine E-Rechnung bzw. XRechnung nach geltendem gesetzlichen Standard <strong>unverzichtbar</strong>!
                    </div>
                </div>
            </div>

            <DocInfo title="Zentrale Profileinstellungen">
                Dieser Tab ist das Herzstück Deiner Rechnix-Installation. Die hier hinterlegten Daten (Firma, Bank, Steuernummern) werden dynamisch in alle erstellten PDFs und E-Rechnungen eingefügt.
            </DocInfo>

            <div className="grid gap-6">
                {/* Unternehmensdaten */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-muted-foreground" />
                            Unternehmensdaten <span className="text-sm font-normal text-muted-foreground ml-2">(Pflichtdaten)</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            <div className="md:col-span-9 space-y-2">
                                <Label>Unternehmensname*</Label>
                                <Input defaultValue="Max Mustermann Webdesign" />
                            </div>
                            <div className="md:col-span-3 space-y-2">
                                <Label>Postleitzahl*</Label>
                                <Input type="number" defaultValue="80331" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            <div className="md:col-span-6 space-y-2">
                                <Label>Straße*</Label>
                                <Input defaultValue="Musterstraße" />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <Label>Hausnummer*</Label>
                                <Input defaultValue="1" />
                            </div>
                            <div className="md:col-span-4 space-y-2">
                                <Label>Stadt | Ort*</Label>
                                <Input defaultValue="München" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            <div className="md:col-span-4 space-y-2">
                                <Label>Länder Code | ISO-Code*</Label>
                                <Input defaultValue="DE" />
                            </div>
                            <div className="md:col-span-4 space-y-2">
                                <Label>Umsatzsteuer-ID</Label>
                                <Input defaultValue="DE123456789" />
                            </div>
                            <div className="md:col-span-4 space-y-2">
                                <Label>Steuer-Nr*</Label>
                                <Input defaultValue="143/123/45678" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Inhaber*</Label>
                                <Input defaultValue="Max Mustermann" />
                            </div>
                            <div className="space-y-2">
                                <Label>Bundesland*</Label>
                                <Input defaultValue="Bayern" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <DocInfo title="E-Rechnungs-Kompatibilität">
                    Alle markierten Pflichtfelder sind zwingend erforderlich, um konforme elektronische Rechnungen (ZUGFeRD/XRechnung) nach aktuellem EU-Standard zu generieren. Fehlen Felder, warnt Dich das System aktiv vor dem Export.
                </DocInfo>

                {/* formatierungen */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Rechnungs- & Währungsformat</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Präfix</Label>
                                <Input defaultValue="R" />
                            </div>
                            <div className="space-y-2">
                                <Label>Datumsformat</Label>
                                <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                    <option value="YYYY">2024</option>
                                    <option value="YYYY-MM-DD">2024-03-01</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Trennzeichen</Label>
                                <Input defaultValue="-" />
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md border border-border">
                            Vorschau: <span className="font-mono text-primary bg-background px-2 py-0.5 rounded ml-2 shadow-sm border border-border">R-2024-123</span>
                        </p>
                    </CardContent>
                </Card>

                <DocInfo title="Individuelle Nummernkreise">
                    Du hast die volle Kontrolle über das Format Deiner Rechnungsnummern. Rechnix baut die nächste freie Nummer dynamisch aus Deinem gewünschten Präfix, dem Datumskürzel und einem hochzählenden Suffix zusammen.
                </DocInfo>

                {/* Logo */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                            Firmenlogo
                        </CardTitle>
                        <CardDescription>Dieses Logo wird auf Ihren Rechnungen rechts oben abgebildet.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-4 pt-2">
                            <Button className="w-full sm:w-auto min-w-[140px]">
                                Logo Ändern
                            </Button>
                            <Button variant="destructive" className="w-full sm:w-auto min-w-[140px]">
                                Logo Entfernen
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <DocInfo title="Logo Platzierung">
                    Lädst Du hier ein Bild hoch, wird es automatisch skaliert, quadratisch zugeschnitten im integrierten Editor und auf jedem PDF oben rechts neben Deiner Absenderadresse positioniert.
                </DocInfo>

            </div>
        </div>
    );
}
