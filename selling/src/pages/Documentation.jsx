import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { LayoutDashboard, FileText, Users, Settings, HardDrive, UserCircle, Receipt, UserPlus } from "lucide-react"

import MockDashboard from "../components/demos/MockDashboard"
import MockRechnungErstellen from "../components/demos/MockRechnungErstellen"
import MockKunden from "../components/demos/MockKunden"
import MockUnternehmen from "../components/demos/MockUnternehmen"
import MockBackup from "../components/demos/MockBackup"
import MockRechnungsViewer from "../components/demos/MockRechnungsViewer"
import MockKundenViewer from "../components/demos/MockKundenViewer"
import MockKundeErstellen from "../components/demos/MockKundeErstellen"

const SECTIONS = [
    {
        title: "Übersicht",
        tabs: [
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, component: MockDashboard },
        ]
    },
    {
        title: "Rechnungen",
        tabs: [
            { id: "rechnungen", label: "Rechnung erstellen", icon: FileText, component: MockRechnungErstellen },
            { id: "rechnungsviewer", label: "Rechnungs-Viewer", icon: Receipt, component: MockRechnungsViewer },
        ]
    },
    {
        title: "Kunden",
        tabs: [
            { id: "kunden", label: "Kundenverwaltung", icon: Users, component: MockKunden },
            { id: "kundenviewer", label: "Kunden-Viewer", icon: UserCircle, component: MockKundenViewer },
            { id: "kundeerstellen", label: "Kunde anlegen", icon: UserPlus, component: MockKundeErstellen },
        ]
    },
    {
        title: "Einstellungen",
        tabs: [
            { id: "einstellungen", label: "Unternehmen", icon: Settings, component: MockUnternehmen },
            { id: "backup", label: "Datensicherung", icon: HardDrive, component: MockBackup },
        ]
    }
]

const ALL_TABS = SECTIONS.flatMap(s => s.tabs)

export default function Documentation() {
    const [activeTab, setActiveTab] = useState(ALL_TABS[0].id)

    const ActiveComponent = ALL_TABS.find((tab) => tab.id === activeTab)?.component || MockDashboard
    const activeLabel = ALL_TABS.find((tab) => tab.id === activeTab)?.label || ""

    return (
        <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
            {/* Sidebar Navigation */}
            <aside className="w-64 border-r bg-muted/20 flex flex-col h-full shrink-0">
                <div className="p-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 font-bold text-primary group">
                        <svg className="h-4 w-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Zurück
                    </Link>
                    <img src="/icon.png" alt="Logo" className="h-6 w-auto rounded-md shadow-sm" />
                </div>
                <Separator />

                <ScrollArea className="flex-1 py-4">
                    <div className="px-3 space-y-5">
                        {SECTIONS.map((section) => (
                            <div key={section.title}>
                                <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    {section.title}
                                </h3>
                                <div className="space-y-1">
                                    {section.tabs.map((tab) => {
                                        const Icon = tab.icon
                                        return (
                                            <Button
                                                key={tab.id}
                                                variant={activeTab === tab.id ? "secondary" : "ghost"}
                                                className="w-full justify-start font-medium"
                                                onClick={() => setActiveTab(tab.id)}
                                            >
                                                <Icon className="mr-2 h-4 w-4" />
                                                {tab.label}
                                            </Button>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                <header className="h-14 border-b flex items-center px-6 bg-background/95 backdrop-blur z-10 sticky top-0">
                    <h1 className="text-xl font-semibold">
                        Interaktive Demo: {activeLabel}
                    </h1>
                </header>

                <div className="flex-1 overflow-auto bg-background">
                    <ActiveComponent />
                </div>
            </main>
        </div>
    )
}
