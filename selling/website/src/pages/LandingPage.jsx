import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, ShoppingCart, BarChart3, ShieldCheck, Zap } from "lucide-react"

export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col items-center bg-background text-foreground">
            {/* Navigation */}
            <header className="w-full max-w-7xl mx-auto px-6 py-4 flex justify-between items-center border-b">
                <div className="flex items-center gap-3">
                    <img src="/icon.png" alt="Rechnix Logo" className="h-10 w-10 object-contain rounded-xl shadow-sm" />
                    <span className="text-xl font-bold text-primary tracking-tight">Rechnix</span>
                </div>
                <nav className="flex items-center gap-6 text-sm font-medium">
                    <a href="#features" className="hover:text-primary transition-colors">Funktionen</a>
                    <a href="#pricing" className="hover:text-primary transition-colors">Preise</a>
                    <Link to="/docs" className="hover:text-primary transition-colors">Dokumentation</Link>
                    <Button asChild>
                        <Link to="/docs">Jetzt Starten</Link>
                    </Button>
                </nav>
            </header>

            {/* Hero Section */}
            <main className="flex-1 w-full flex flex-col items-center text-center px-6">
                <section className="max-w-4xl py-24 flex flex-col items-center gap-8">
                    <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold text-primary bg-primary/10">
                        🎉 Die smarte Lösung für Deine Buchhaltung
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                        Schreibe Rechnungen in <span className="text-primary">Sekunden</span>, nicht Stunden.
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                        Das moderne Rechnungsprogramm für Selbstständige, Freelancer und kleine Unternehmen.
                        Behalte den Überblick über Kunden, Produkte und Finanzen – intuitiv und sicher.
                    </p>
                    <div className="flex gap-4 mt-4">
                        <Button size="lg" className="h-12 px-8 text-base shadow-lg hover:shadow-primary/25 transition-all" asChild>
                            <Link to="/docs">Kostenlos testen</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
                            <Link to="/docs">Zur Dokumentation</Link>
                        </Button>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="w-full max-w-7xl py-24 border-t">
                    <div className="flex flex-col items-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Alles, was Dein Business braucht</h2>
                        <p className="text-muted-foreground text-center max-w-2xl">
                            Rechnix bietet Dir eine All-in-One Plattform für Deine tägliche Arbeit. Von der Rechnungserstellung bis zur Kundenverwaltung.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-lg mb-4 text-primary">
                                    <FileText size={24} />
                                </div>
                                <CardTitle>Rechnungserstellung</CardTitle>
                                <CardDescription>
                                    Erstelle professionelle Rechnungen mit wenigen Klicks. Speichere Vorlagen und automatisiere Deinen Workflow.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-lg mb-4 text-primary">
                                    <Users size={24} />
                                </div>
                                <CardTitle>Kundenverwaltung</CardTitle>
                                <CardDescription>
                                    Verwalte all Deine Kundenkontakte an einem Ort. Behalte Historien und offene Posten stets im Blick.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-lg mb-4 text-primary">
                                    <ShoppingCart size={24} />
                                </div>
                                <CardTitle>Produkte & Leistungen</CardTitle>
                                <CardDescription>
                                    Lege Deine Artikel und Dienstleistungen an, um Rechnungen noch schneller zu schreiben.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-lg mb-4 text-primary">
                                    <BarChart3 size={24} />
                                </div>
                                <CardTitle>Statistiken & Dashboard</CardTitle>
                                <CardDescription>
                                    Dein Umsatz auf einen Blick. Grafische Auswertungen helfen Dir, Dein Wachstum zu verstehen.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-lg mb-4 text-primary">
                                    <ShieldCheck size={24} />
                                </div>
                                <CardTitle>Sicher & Datenschutzkonform</CardTitle>
                                <CardDescription>
                                    Deine Daten gehören Dir. Moderne Verschlüsselung und Einhaltung von Datenschutzstandards.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-lg mb-4 text-primary">
                                    <Zap size={24} />
                                </div>
                                <CardTitle>Mahnwesen</CardTitle>
                                <CardDescription>
                                    Automatisierte Erinnerungen und Mahnungen für überfällige Rechnungen reduzieren Zahlungsausfälle.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="w-full bg-primary/5 py-24 flex flex-col items-center rounded-3xl mb-12 border">
                    <h2 className="text-3xl font-bold mb-4">Bereit, Zeit zu sparen?</h2>
                    <p className="text-muted-foreground mb-8 text-center max-w-md">
                        Lerne Rechnix in unserer interaktiven Dokumentation kennen und probiere alle Funktionen direkt aus.
                    </p>
                    <Button size="lg" asChild>
                        <Link to="/docs">Zur interaktiven Dokumentation</Link>
                    </Button>
                </section>
            </main>

            {/* Footer */}
            <footer className="w-full border-t py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} Rechnix. Alle Rechte vorbehalten.</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <a href="#" className="hover:text-foreground">Impressum</a>
                        <a href="#" className="hover:text-foreground">Datenschutz</a>
                        <a href="#" className="hover:text-foreground">AGB</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
