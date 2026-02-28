import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Info, User, Trash2, FileText, Printer, Send, DollarSign, Mail, Bell, ArrowLeft } from "lucide-react"

const DocInfo = ({ title, children }) => (
    <div className="mb-4 p-4 border border-blue-200 bg-blue-50/50 rounded-lg text-sm text-blue-900 shadow-sm dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-100">
        <div className="flex items-center gap-2 font-semibold mb-1">
            <Info className="h-4 w-4 text-primary" />
            {title}
        </div>
        <div className="text-muted-foreground leading-relaxed">{children}</div>
    </div>
)

// Matches the exact action list from RechnungsViewer.jsx
const actions = [
    { icon: DollarSign, label: "Zahlung erfassen", variant: "default" },
    { icon: Printer, label: "Drucken", variant: "secondary" },
    { icon: FileText, label: "PDF Export", variant: "secondary" },
    { icon: Send, label: "E-Rechnung (XML)", variant: "secondary" },
    { icon: Mail, label: "Per Email", variant: "secondary" },
    { icon: Bell, label: "Mahnung", variant: "secondary" },
    { icon: User, label: "Kunde öffnen", variant: "secondary" },
    { icon: Trash2, label: "Löschen", variant: "destructive" },
]

// Matches the columns from RechnungsViewer.jsx
const columns = [
    { key: 'position', label: 'Pos', style: { width: '8%', textAlign: 'center' } },
    { key: 'bezeichnung', label: 'Bezeichnung', style: { width: '42%', textAlign: 'left' } },
    { key: 'menge', label: 'Menge', style: { width: '15%', textAlign: 'center' } },
    { key: 'einzelpreis', label: 'Einzelpreis', style: { width: '15%', textAlign: 'right' } },
    { key: 'gesamt', label: 'Gesamt', style: { width: '20%', textAlign: 'right' } },
]

const sampleRows = [
    { pos: 1, bezeichnung: "Webdesign Beratung", menge: 5, einzelpreis: "90.00€", gesamt: "450.00€" },
    { pos: 2, bezeichnung: "Hosting & Domain", menge: 1, einzelpreis: "120.00€", gesamt: "120.00€" },
]

export default function MockRechnungsViewer() {
    return (
        <div className="flex flex-col lg:flex-row h-[800px] overflow-hidden bg-background/50">
            {/* LEFT: A4 PDF Preview Area (matches src exactly) */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-8 flex flex-col items-center gap-4 bg-zinc-100/50">

                <DocInfo title="Rechnungs-PDF Vorschau (Links)">
                    Die linke Seite zeigt eine vollständige A4-Vorschau der Rechnung. Das Layout entspricht dem fertigen PDF. Jede Rechnung wird präzise auf den Millimeter gerendert.
                </DocInfo>

                {/* A4 Page Mock (210mm ≈ 794px at 96dpi) */}
                <div style={{
                    width: '210mm',
                    minHeight: '297mm',
                    background: 'white',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    padding: '15mm',
                    display: 'flex',
                    flexDirection: 'column',
                    color: 'black',
                    maxWidth: '100%'
                }}>
                    {/* Invoice Header */}
                    <div style={{ width: '100%', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#000', margin: 0 }}>Muster GmbH</h2>
                            <p style={{ fontSize: '9px', color: '#666', margin: '4px 0 0 0' }}>Musterstraße 1 · 80331 München</p>
                        </div>
                        <div style={{ width: '60px', height: '40px', background: '#f4f4f4', border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: '#999' }}>
                            Logo
                        </div>
                    </div>

                    {/* Recipient & Invoice Info */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div>
                            <p style={{ fontSize: '10pt', margin: 0, color: '#000' }}>Herr/Frau</p>
                            <p style={{ fontSize: '10pt', fontWeight: 'bold', margin: 0, color: '#000' }}>Max Mustermann</p>
                            <p style={{ fontSize: '10pt', margin: 0, color: '#000' }}>Beispielgasse 5</p>
                            <p style={{ fontSize: '10pt', margin: 0, color: '#000' }}>10115 Berlin</p>
                        </div>
                        <div style={{ minWidth: 150, textAlign: 'right' }}>
                            <h4 style={{ fontSize: '16px', margin: '0 0 4px 0', color: '#000' }}>Rechnung</h4>
                            <p style={{ fontSize: '9pt', margin: 0, color: '#555' }}>Nr: 123</p>
                            <p style={{ fontSize: '9pt', margin: 0, color: '#555' }}>Datum: 28.02.2025</p>
                            <p style={{ fontSize: '9pt', margin: 0, color: '#555' }}>Kundennr: K-10042</p>
                        </div>
                    </div>

                    {/* Positions Table */}
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #000' }}>
                                {columns.map(col => (
                                    <th key={col.key} style={{ ...col.style, padding: '8px 4px', fontSize: '12px', fontWeight: 'bold', color: 'black' }}>{col.label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sampleRows.map((row) => (
                                <tr key={row.pos} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ ...columns[0].style, padding: '8px 4px', fontSize: '12px' }}>{row.pos}</td>
                                    <td style={{ ...columns[1].style, padding: '8px 4px', fontSize: '12px' }}>{row.bezeichnung}</td>
                                    <td style={{ ...columns[2].style, padding: '8px 4px', fontSize: '12px' }}>{row.menge}</td>
                                    <td style={{ ...columns[3].style, padding: '8px 4px', fontSize: '12px' }}>{row.einzelpreis}</td>
                                    <td style={{ ...columns[4].style, padding: '8px 4px', fontSize: '12px' }}>{row.gesamt}</td>
                                </tr>
                            ))}
                            {/* Totals Row (matches src) */}
                            <tr>
                                <td colSpan={3}></td>
                                <td style={{ padding: '8px 4px', fontSize: '12px', textAlign: 'right', fontWeight: 'bold', borderTop: '2px solid #000' }}>Netto</td>
                                <td style={{ padding: '8px 4px', fontSize: '12px', textAlign: 'right', fontWeight: 'bold', borderTop: '2px solid #000' }}>570.00€</td>
                            </tr>
                            <tr>
                                <td colSpan={3}></td>
                                <td style={{ padding: '4px', fontSize: '12px', textAlign: 'right' }}>zzgl. USt.</td>
                                <td style={{ padding: '4px', fontSize: '12px', textAlign: 'right' }}>108.30€</td>
                            </tr>
                            <tr>
                                <td colSpan={3}></td>
                                <td style={{ padding: '8px 4px', fontSize: '14px', textAlign: 'right', fontWeight: 'bold' }}>Brutto</td>
                                <td style={{ padding: '8px 4px', fontSize: '14px', textAlign: 'right', fontWeight: 'bold' }}>678.30€</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Footer – matches src */}
                    <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #eee' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '9px', color: '#666' }}>
                            <div>
                                <b>Muster GmbH</b><br />
                                Musterstraße 1, 80331 München<br />
                                Tel: +49 89 123456 • www.muster.de
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                Zahlungsempfänger: Max Muster<br />
                                Musterbank<br />
                                IBAN: DE00 1234 5678 9012 3456 78 • BIC: MSTDEMMXXX<br />
                                USt-ID: DE123456789
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT: Action Panel (matches src exactly) */}
            <div className="w-full lg:w-80 h-screen bg-background border-t lg:border-t-0 lg:border-l flex flex-col p-6 gap-6 overflow-y-auto z-10 shadow-lg lg:shadow-none">
                <h2 className="text-lg font-semibold tracking-tight">Aktionen</h2>

                <DocInfo title="Aktions-Panel (Rechts)">
                    Hier führst Du alle Aktionen für diese Rechnung aus: Zahlung erfassen, als PDF exportieren, per E-Mail versenden oder eine Mahnung erstellen.
                </DocInfo>

                {/* Status Card (matches src) */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-muted-foreground">Status</span>
                            <span className="inline-flex items-center rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5">Offen</span>
                        </div>
                        <div className="text-3xl font-bold">678.30€</div>
                    </CardContent>
                </Card>

                {/* Action Buttons – exact order from src */}
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                    {actions.map((action, idx) => (
                        <Button
                            key={idx}
                            variant={action.variant}
                            className="w-full justify-start gap-2"
                        >
                            <action.icon className="h-4 w-4" />
                            {action.label}
                        </Button>
                    ))}
                </div>

                <div className="mt-auto pt-6 border-t hidden lg:block">
                    <div className="text-xs text-muted-foreground">
                        <p className="font-medium text-foreground mb-1">R-2025-0228-123</p>
                        <p>Erstellt am 28.02.2025</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
