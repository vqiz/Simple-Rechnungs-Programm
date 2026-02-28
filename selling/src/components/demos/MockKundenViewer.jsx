import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Info, ArrowLeft, Building2, MapPin, Phone, Mail, User, Search, PlusCircle } from "lucide-react"

const DocInfo = ({ title, children }) => (
    <div className="mb-4 p-4 border border-blue-200 bg-blue-50/50 rounded-lg text-sm text-blue-900 shadow-sm dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-100">
        <div className="flex items-center gap-2 font-semibold mb-1">
            <Info className="h-4 w-4 text-primary" />
            {title}
        </div>
        <div className="text-muted-foreground leading-relaxed">{children}</div>
    </div>
)

export default function MockKundenViewer() {
    return (
        <div className="flex h-[800px] overflow-hidden bg-background">

            {/* LEFT SIDEBAR: PROFILE (matches KundenViewer.jsx exact layout) */}
            <div className="w-[320px] border-r bg-background/95 flex flex-col overflow-y-auto p-6 gap-6 shrink-0">
                {/* Back Button */}
                <div className="flex items-center gap-2 -ml-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <span className="text-sm text-muted-foreground">Zurück zur Übersicht</span>
                </div>

                {/* Avatar & Name (matches the Avatar component from MUI in src) */}
                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/10 text-primary text-3xl font-semibold flex items-center justify-center mb-4">
                        A
                    </div>
                    <h3 className="text-xl font-semibold mb-1">Acme Corp GmbH</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                        Firmenkunde
                    </span>
                </div>

                <hr className="border-border" />

                {/* KONTAKT Section (matches src) */}
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-primary mb-3">Kontakt</p>
                    <div className="space-y-3">
                        <div className="flex gap-3 items-start">
                            <Building2 className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm">Musterstraße 12</p>
                                <p className="text-sm">10115 Berlin</p>
                            </div>
                        </div>
                        <div className="flex gap-3 items-center">
                            <Phone className="h-5 w-5 text-muted-foreground shrink-0" />
                            <p className="text-sm">+49 30 123456</p>
                        </div>
                        <div className="flex gap-3 items-center">
                            <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
                            <p className="text-sm break-all">kontakt@acmecorp.de</p>
                        </div>
                    </div>
                </div>

                {/* ANSPRECHPARTNER (shown for Firmenkunde, matches src) */}
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-primary mb-3">Ansprechpartner</p>
                    <div className="flex gap-3 items-center">
                        <User className="h-5 w-5 text-muted-foreground shrink-0" />
                        <p className="text-sm">Frau Schmidt</p>
                    </div>
                </div>

                {/* META Section (matches src) */}
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-primary mb-3">Meta</p>
                    <div className="space-y-2">
                        <div className="flex gap-3 items-center">
                            <span className="text-xs text-muted-foreground w-20">Kunden-Nr</span>
                            <span className="text-xs">K-10043</span>
                        </div>
                        <div className="flex gap-3 items-center">
                            <span className="text-xs text-muted-foreground w-20">Seit</span>
                            <span className="text-xs">01.01.2024</span>
                        </div>
                    </div>
                </div>

                {/* Edit Button (matches src actions at bottom) */}
                <div className="mt-auto flex flex-col gap-2">
                    <Button variant="outlined" className="w-full gap-2 border">
                        Bearbeiten
                    </Button>
                </div>
            </div>

            {/* MAIN CONTENT: INVOICES (matches src) */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Toolbar Header (exact match from src) */}
                <div className="p-6 border-b bg-background flex items-center justify-between shrink-0">
                    <h4 className="text-xl font-semibold">Rechnungen</h4>
                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechnung suchen..."
                                className="pl-9 min-w-[250px] rounded-[20px]"
                            />
                        </div>
                        <Button className="gap-2">
                            <PlusCircle className="h-4 w-4" />
                            Neue Rechnung
                        </Button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
                    <DocInfo title="Kundendetail-Ansicht (2-Spalten Layout)">
                        Der linke Bereich zeigt das vollständige Kundenprofil mit Avatar, Adresse, Kontaktdaten und Metadaten. Rechts findest Du die vollständige Rechnungshistorie dieses Kunden mit Bezahlstatus.
                    </DocInfo>

                    {/* Invoice Table (matches swiss-card Table from src) */}
                    <div className="rounded-xl border shadow-sm bg-card overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-[#FAFAFA] dark:bg-muted/50 border-b">
                                <tr>
                                    <th className="w-[60px] py-3 px-4 text-left text-muted-foreground font-semibold"></th>
                                    <th className="py-3 px-4 text-left text-muted-foreground font-semibold">Rechnung Nr.</th>
                                    <th className="py-3 px-4 text-left text-muted-foreground font-semibold">Datum</th>
                                    <th className="py-3 px-4 text-left text-muted-foreground font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                <tr className="hover:bg-muted/30 transition-colors cursor-pointer">
                                    <td className="py-3 px-4 text-center text-muted-foreground">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l-4-4 4-4M15 10h5M5 18h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                    </td>
                                    <td className="py-3 px-4 font-medium">R-2025-0228-123</td>
                                    <td className="py-3 px-4 text-muted-foreground">28.02.2025</td>
                                    <td className="py-3 px-4">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Offen</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-muted/30 transition-colors cursor-pointer">
                                    <td className="py-3 px-4 text-center text-muted-foreground">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l-4-4 4-4M15 10h5M5 18h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                    </td>
                                    <td className="py-3 px-4 font-medium">R-2025-0115-118</td>
                                    <td className="py-3 px-4 text-muted-foreground">15.01.2025</td>
                                    <td className="py-3 px-4">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Bezahlt</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
