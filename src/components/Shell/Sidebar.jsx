import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Receipt, Users, Package, Wallet, BarChart3, Bell, Settings, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { label: 'Rechnungen', icon: Receipt, path: '/invoices' },
        { label: 'Kunden', icon: Users, path: '/clients' },
        { label: 'Produkte', icon: Package, path: '/products' },
        { label: 'Ausgaben', icon: Wallet, path: '/expenses' },
        { label: 'Statistiken', icon: BarChart3, path: '/statistics' },
        { label: 'Mahnwesen', icon: Bell, path: '/mahnungen' },
        { label: 'Einstellungen', icon: Settings, path: '/settings' },
    ];

    return (
        <div className="w-64 border-r bg-background flex flex-col h-screen bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-8">
                    <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                        R
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold tracking-tight">Rechnix</h1>
                        <p className="text-xs text-muted-foreground">Workspace</p>
                    </div>
                </div>

                <div className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

                        return (
                            <Button
                                key={item.path}
                                variant={isActive ? "default" : "ghost"}
                                className={cn(
                                    "w-full justify-start gap-3 font-normal",
                                    isActive && "bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium shadow-md hover:from-blue-700 hover:to-blue-800"
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
