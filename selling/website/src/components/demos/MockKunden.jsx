import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, PlusCircle, Upload, Download, RefreshCw, Building2, User, Info } from "lucide-react"

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

export default function MockKunden() {
    return (
        <div className="flex-1 w-full h-[800px] overflow-y-auto bg-background p-8">
            {/* Header Area exactly matching MUI implementation */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-[24px] font-semibold tracking-tight text-foreground">Kunden</h2>
                    <p className="text-sm text-muted-foreground">Verwalten Sie Ihre Kundenkontakte und Firmen.</p>
                </div>
                <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 h-10 shadow rounded-md font-medium">
                    <PlusCircle className="h-5 w-5" />
                    Neuer Kunde
                </Button>
            </div>

            <DocInfo title="Echtes Kundenverwaltungs-Layout">
                Dies ist die 1:1 Nachbildung der Kundenlisten-Ansicht. Die echte App nutzt hierfür ein Material-UI inspiriertes, klares Design, das für die schnelle Identifikation von Firmen und Privatkunden optimiert ist.
            </DocInfo>

            {/* Toolbar */}
            <div className="mb-6 flex gap-4 items-center mt-6">
                <div className="relative flex-grow max-w-[400px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Suchen..."
                        className="pl-10 h-10 rounded-[24px] border-input focus-visible:ring-primary shadow-sm"
                    />
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="h-10 w-10 text-muted-foreground rounded-xl hover:bg-accent border-input shadow-sm">
                        <Upload className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-10 w-10 text-muted-foreground rounded-xl hover:bg-accent border-input shadow-sm">
                        <Download className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground rounded-xl hover:bg-accent">
                        <RefreshCw className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Table Card (equivalent to "swiss-card" Box) */}
            <div className="rounded-xl border shadow-sm bg-card overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#FAFAFA] dark:bg-muted/50 border-b">
                        <tr>
                            <th className="w-[60px] py-3 px-4 font-semibold text-muted-foreground"></th>
                            <th className="py-3 px-4 font-semibold text-muted-foreground">Name</th>
                            <th className="py-3 px-4 font-semibold text-muted-foreground">Typ</th>
                            <th className="py-3 px-4 font-semibold text-muted-foreground">Email</th>
                            <th className="py-3 px-4 font-semibold text-muted-foreground">Ort</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-sm">

                        {/* Row 1 - Firma */}
                        <tr className="hover:bg-muted/40 transition-colors cursor-pointer group">
                            <td className="py-3 px-4 text-center">
                                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                                    <Building2 className="h-5 w-5" />
                                </div>
                            </td>
                            <td className="py-3 px-4">
                                <div className="font-medium text-[15px] group-hover:text-primary transition-colors">Acme Corp GmbH</div>
                                <div className="text-xs text-muted-foreground">K-10043</div>
                            </td>
                            <td className="py-3 px-4">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary">
                                    Firma
                                </span>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">kontakt@acmecorp.de</td>
                            <td className="py-3 px-4 text-muted-foreground">10115 Berlin</td>
                        </tr>

                        {/* Row 2 - Privat */}
                        <tr className="hover:bg-muted/40 transition-colors cursor-pointer group">
                            <td className="py-3 px-4 text-center">
                                <div className="h-10 w-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto">
                                    <User className="h-5 w-5" />
                                </div>
                            </td>
                            <td className="py-3 px-4">
                                <div className="font-medium text-[15px] group-hover:text-primary transition-colors">Max Mustermann</div>
                                <div className="text-xs text-muted-foreground">K-10042</div>
                            </td>
                            <td className="py-3 px-4">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-muted text-foreground">
                                    Privat
                                </span>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">max@mustermann.de</td>
                            <td className="py-3 px-4 text-muted-foreground">80331 München</td>
                        </tr>

                        {/* Row 3 - Firma w/o Email */}
                        <tr className="hover:bg-muted/40 transition-colors cursor-pointer group">
                            <td className="py-3 px-4 text-center">
                                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                                    <Building2 className="h-5 w-5" />
                                </div>
                            </td>
                            <td className="py-3 px-4">
                                <div className="font-medium text-[15px] group-hover:text-primary transition-colors">Tech Solutions Ltd.</div>
                                <div className="text-xs text-muted-foreground">K-10041</div>
                            </td>
                            <td className="py-3 px-4">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary">
                                    Firma
                                </span>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">-</td>
                            <td className="py-3 px-4 text-muted-foreground">20095 Hamburg</td>
                        </tr>

                    </tbody>
                </table>
            </div>

            <DocInfo title="Nahtloser Export & Import">
                Oben in der Werkzeugleiste befinden sich die Buttons für den sofortigen JSON/CSV Daten-Export sowie für das reibungslose Importieren Tausender bestehender Kundenkontakte mit nur wenigen Klicks.
            </DocInfo>
        </div>
    )
}
