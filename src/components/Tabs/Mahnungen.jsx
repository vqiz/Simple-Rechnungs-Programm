import React, { useEffect, useState } from 'react';
import { handleLoadFile } from '../../Scripts/Filehandler';
import { AlertCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

function Mahnungen() {
    const [mahnungen, setMahnungen] = useState([]);
    const [stats, setStats] = useState({ count: 0, total: 0 });

    const loadMahnungen = async () => {
        try {
            const dbStr = await handleLoadFile("fast_accsess/mahnungen.db");
            if (!dbStr || dbStr === "{}") {
                setMahnungen([]);
                setStats({ count: 0, total: 0 });
                return;
            }
            const db = JSON.parse(dbStr);
            const list = db.list || [];

            // Sort by date desc
            list.sort((a, b) => b.date - a.date);
            setMahnungen(list);

            // Calculate Stats
            const total = list.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
            setStats({ count: list.length, total: total.toFixed(2) });

        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        loadMahnungen();
    }, []);

    return (
        <div className="flex-1 w-full h-full overflow-y-auto bg-background p-8">
            <div className="space-y-6">
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-[24px] font-semibold tracking-tight text-foreground">Mahnungswesen</h2>
                        <p className="text-sm text-muted-foreground mt-1">Überwachen und verwalten Sie offene Forderungen und Mahnverfahren.</p>
                    </div>
                    <Button variant="outline" className="gap-2" onClick={loadMahnungen}>
                        <RefreshCw className="h-4 w-4" />
                        Aktualisieren
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-900 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-orange-800 dark:text-orange-400 flex flex-row items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                Offene Mahnungen
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-orange-600 dark:text-orange-500">{stats.count}</div>
                            <p className="text-xs text-orange-700/80 dark:text-orange-400/80 mt-1">Gesendete Mahnverfahren</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-red-800 dark:text-red-400 flex flex-row items-center gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                Forderungssumme
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-red-600 dark:text-red-500">{stats.total} €</div>
                            <p className="text-xs text-red-700/80 dark:text-red-400/80 mt-1">Inklusive Mahngebühren</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="rounded-xl border shadow-sm bg-card overflow-hidden mt-6">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#FAFAFA] dark:bg-muted/50 border-b">
                            <tr>
                                <th className="py-3 px-4 font-semibold text-muted-foreground w-[120px]">Datum</th>
                                <th className="py-3 px-4 font-semibold text-muted-foreground">Rechnung</th>
                                <th className="py-3 px-4 font-semibold text-muted-foreground">Kunde</th>
                                <th className="py-3 px-4 font-semibold text-muted-foreground">Mahnstufe</th>
                                <th className="py-3 px-4 font-semibold text-muted-foreground text-right w-[150px]">Betrag</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-sm">
                            {mahnungen.map((m, i) => (
                                <tr key={i} className="hover:bg-muted/40 transition-colors">
                                    <td className="py-3 px-4 whitespace-nowrap">{new Date(m.date).toLocaleDateString()}</td>
                                    <td className="py-3 px-4 font-medium">{m.rechnungId}</td>
                                    <td className="py-3 px-4 text-muted-foreground">{m.kundenName}</td>
                                    <td className="py-3 px-4">
                                        <Badge variant={m.level === 1 ? 'secondary' : 'destructive'} className={m.level === 1 ? 'bg-orange-100 text-orange-800 hover:bg-orange-100 border-none' : ''}>
                                            {m.level === 1 ? 'Erinnerung' : `${m.level}. Mahnung`}
                                        </Badge>
                                    </td>
                                    <td className="py-3 px-4 text-right font-semibold">{Number(m.amount).toFixed(2)} €</td>
                                </tr>
                            ))}
                            {mahnungen.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                                        Keine offenen Mahnungen gefunden
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Mahnungen;
