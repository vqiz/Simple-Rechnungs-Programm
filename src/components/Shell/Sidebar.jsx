import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Receipt, Users, Package, Wallet, BarChart3, Bell, Settings, FileText, HardDrive } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const sections = [
        {
            title: 'Übersicht',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
            ]
        },
        {
            title: 'Rechnungen',
            items: [
                { label: 'Rechnung erstellen', icon: FileText, path: '/invoices/create' },
                { label: 'Rechnungen', icon: Receipt, path: '/invoices' },
                { label: 'Mahnwesen', icon: Bell, path: '/mahnungen' },
            ]
        },
        {
            title: 'Kunden',
            items: [
                { label: 'Kundenverwaltung', icon: Users, path: '/clients' },
            ]
        },
        {
            title: 'Katalog',
            items: [
                { label: 'Produkte', icon: Package, path: '/products' },
            ]
        },
        {
            title: 'Auswertungen',
            items: [
                { label: 'Statistiken', icon: BarChart3, path: '/statistics' },
                { label: 'Ausgaben', icon: Wallet, path: '/expenses' },
            ]
        },
        {
            title: 'Einstellungen',
            items: [
                { label: 'Unternehmen', icon: Settings, path: '/settings' },
                { label: 'Datensicherung', icon: HardDrive, path: '/backup' },
            ]
        },
    ];

    return (
        <div className="w-64 border-r bg-background flex flex-col h-screen bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="p-6 pb-2">
                <div className="flex items-center gap-2 mb-4">
                    <img src={process.env.PUBLIC_URL + "/icon.png"} alt="Rechnix Logo" className="h-8 w-auto rounded-md shadow-sm" />
                    <div>
                        <h1 className="text-lg font-semibold tracking-tight">Rechnix</h1>
                        <p className="text-xs text-muted-foreground">Workspace</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 space-y-6">
                {sections.map((section, index) => (
                    <div key={index} className="space-y-1">
                        <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {section.title}
                        </h3>
                        <div className="space-y-1">
                            {section.items.map((item) => {
                                const Icon = item.icon;
                                const isExactMatch = sections.flatMap(s => s.items).some(i => i.path === location.pathname);
                                const isPathPrefixActive = item.path !== '/' && location.pathname.startsWith(item.path + '/');
                                const isActive = location.pathname === item.path || (isPathPrefixActive && !isExactMatch);

                                return (
                                    <Button
                                        key={item.path}
                                        variant={isActive ? "default" : "ghost"}
                                        className={cn(
                                            "w-full justify-start gap-3 font-normal",
                                            isActive && "bg-primary text-primary-foreground font-medium shadow-md hover:bg-primary/90"
                                        )}
                                        onClick={() => navigate(item.path)}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {item.label}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-auto p-6 border-t bg-background/50">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-zinc-200 flex items-center justify-center">
                        <Users className="h-4 w-4 text-zinc-500" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium">Benutzer</p>
                        <p className="text-xs text-muted-foreground">Pro Plan</p>
                    </div>
                </div>
                <div className="mt-4 text-[10px] text-center text-muted-foreground/50">
                    v1.0.0 • Stable
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
