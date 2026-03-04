import React, { useState } from 'react';
import { Box, Typography } from '@mui/joy';
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Download, Upload, ShieldAlert, CheckCircle2, Loader2 } from 'lucide-react';

export default function Datensicherung() {
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    const handleCreateBackup = async () => {
        setIsExporting(true);
        try {

            const result = await window.api.createBackup();


            if (result && result.success) {
                console.log("Backup successful", result.path);
            }
        } catch (error) {
            console.error("Backup failed", error);
        } finally {
            setIsExporting(false);
        }
    };

    const handleRestoreBackup = async () => {
        setIsImporting(true);
        try {

            const result = await window.api.restoreBackup();


            if (result && result.success) {
                console.log("Restore successful");

            }
        } catch (error) {
            console.error("Restore failed", error);
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <Box sx={{ p: 4, height: '100%', overflowY: 'auto' }}>
            <Box sx={{ mb: 6 }}>
                <Typography level="h2" sx={{ fontSize: '24px', fontWeight: 600 }}>Datensicherung</Typography>
                <Typography level="body-sm">
                    Erstellen Sie lokale Sicherheitskopien Ihrer Geschäftsdaten oder stellen Sie alte Backups wieder her.
                </Typography>
            </Box>

            <div className="grid gap-6 md:grid-cols-2 max-w-5xl">
                {/* Backup Create Card */}
                <Card className="border-border/50 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                        <Download className="w-32 h-32" />
                    </div>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Download className="h-5 w-5 text-primary" />
                            Backup erstellen
                        </CardTitle>
                        <CardDescription>
                            Sichern Sie Ihre Rechnungen, Kunden, Ausgaben und Einstellungen in einer verschlüsselten Datei.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="rounded-lg bg-primary/5 p-4 flex gap-3 items-start border border-primary/10">
                            <ShieldAlert className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div className="text-sm text-primary/90">
                                <p className="font-medium mb-1">Passwortgeschützt</p>
                                <p>Beim Export werden Sie gebeten, ein Passwort festzulegen. Bitte bewahren Sie dieses gut auf, da Backups ohne dieses Passwort nicht wiederhergestellt werden können.</p>
                            </div>
                        </div>

                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex gap-2 items-center"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Alle Rechnungs- und Kundendaten</li>
                            <li className="flex gap-2 items-center"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Ausgaben und angehängte Belege</li>
                            <li className="flex gap-2 items-center"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Unternehmenseinstellungen & Logo</li>
                        </ul>

                        <div className="pt-4 flex justify-end border-t border-border/50">
                            <Button
                                onClick={handleCreateBackup}
                                disabled={isExporting || isImporting}
                                className="bg-primary hover:bg-primary/90 min-w-[200px]"
                            >
                                {isExporting ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Backup wird erstellt...</>
                                ) : (
                                    "Neues Backup speichern"
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Backup Restore Card */}
                <Card className="border-border/50 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                        <Upload className="w-32 h-32" />
                    </div>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="h-5 w-5 text-blue-500" />
                            Backup wiederherstellen
                        </CardTitle>
                        <CardDescription>
                            Importieren Sie eine bestehende Rechnix-Sicherungsdatei (.rechnix-backup), um einen alten Stand wiederherzustellen.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="rounded-lg bg-orange-500/10 p-4 flex gap-3 items-start border border-orange-500/20">
                            <ShieldAlert className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                            <div className="text-sm text-orange-800 dark:text-orange-400">
                                <p className="font-medium mb-1">Achtung: Daten werden überschrieben</p>
                                <p>Das Wiederherstellen eines Backups überschreibt <b>alle</b> aktuell im Programm vorhandenen Daten irreversibel.</p>
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4">
                            Sie benötigen das Passwort, welches Sie bei der Erstellung des Backups vergeben haben. Nach erfolgreichem Import muss Rechnix neu gestartet werden.
                        </p>

                        <div className="pt-8 flex justify-end border-t border-border/50 mt-auto">
                            <Button
                                variant="outline"
                                onClick={handleRestoreBackup}
                                disabled={isExporting || isImporting}
                                className="min-w-[200px]"
                            >
                                {isImporting ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Importiere...</>
                                ) : (
                                    "Sicherung auswählen"
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Box>
    );
}
