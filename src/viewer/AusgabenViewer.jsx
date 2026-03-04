import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAusgaben, getAusgabenRaw, saveAusgabe, deleteAusgabe } from '../Scripts/AusgabenHandler';
import { ArrowLeft, Clock, Info, Calendar, Edit2, Trash2, Paperclip, UploadCloud, Banknote, Tag, MoreVertical } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dropdown, Menu, MenuButton, MenuItem, ListItemDecorator } from '@mui/joy';
import AusgabenEditor from '../components/Ausgaben/AusgabenEditor';

export default function AusgabenViewer() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [masterAboExpense, setMasterAboExpense] = useState(null);
    const [subExpenses, setSubExpenses] = useState([]);
    const [isAboGroup, setIsAboGroup] = useState(false);
    const [isEditingMaster, setIsEditingMaster] = useState(false);

    const loadData = async () => {
        setIsLoading(true);
        const data = await getAusgaben();
        const allExpenses = data.list || [];

        const rawData = await getAusgabenRaw();
        const allRawExpenses = rawData.list || [];


        const exactMatchRaw = allRawExpenses.find(e => String(e.id) === String(id));

        if (exactMatchRaw && exactMatchRaw.isRecurring) {

            const subExp = allExpenses.filter(e => String(e.masterId) === String(exactMatchRaw.id));
            subExp.sort((a, b) => b.date - a.date);
            setSubExpenses(subExp);
            setMasterAboExpense(exactMatchRaw);
            setIsAboGroup(true);
        } else {
            const exactMatchVirtual = allExpenses.find(e => String(e.id) === String(id));

            if (exactMatchVirtual && exactMatchVirtual.isVirtual) {

                const parentMaster = allRawExpenses.find(m => String(m.id) === String(exactMatchVirtual.masterId));
                const subExp = allExpenses.filter(e => String(e.masterId) === String(parentMaster.id));

                subExp.sort((a, b) => b.date - a.date);
                setSubExpenses(subExp);
                setMasterAboExpense(parentMaster);
                setIsAboGroup(true);
            } else if (exactMatchRaw) {

                setMasterAboExpense(exactMatchRaw);
                setSubExpenses([exactMatchRaw]);
                setIsAboGroup(false);
            } else {
                setMasterAboExpense(null);
            }
        }

        setIsLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [id]);

    const handleUploadAttachmentForSub = async (subExpenseId) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = '.xml,.pdf,.jpg,.jpeg,.png';

        input.onchange = async (e) => {
            const files = Array.from(e.target.files);
            if (!files || files.length === 0) return;

            const expenseToUpdate = subExpenses.find(ex => ex.id === subExpenseId);
            if (!expenseToUpdate) return;

            setIsLoading(true);

            let finalAttachments = expenseToUpdate.attachments ? [...expenseToUpdate.attachments] : [];

            for (const f of files) {
                try {

                    const base64Data = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = error => reject(error);
                        reader.readAsDataURL(f);
                    });

                    const pendingObj = {
                        name: f.name,
                        data: base64Data
                    };

                    const result = await window.api.saveAttachment(pendingObj);

                    if (result && result.success) {
                        finalAttachments.push({ path: result.path, name: f.name });
                    } else {
                        console.error("Upload failed for: ", f.name, result?.error);
                        alert(`Fehler beim Speichern von ${f.name}`);
                    }
                } catch (error) {
                    console.error("File processing failed", error);
                }
            }

            expenseToUpdate.attachments = finalAttachments;
            await saveAusgabe(expenseToUpdate);

            await loadData();
        };
        input.click();
    };

    const handleDeleteSub = async (subExpenseId) => {
        if (window.confirm(isAboGroup ? "Möchten Sie den Beleg/die Abo-Abbuchung für diesen Monat wirklich löschen?" : "Möchten Sie diese Ausgabe wirklich löschen?")) {
            await deleteAusgabe(subExpenseId);
            if (subExpenses.length === 1 && isAboGroup) {

                navigate("/expenses");
            } else if (!isAboGroup) {
                navigate("/expenses");
            } else {
                loadData();
            }
        }
    };

    const handleViewAttachment = async (path) => {
        if (!path) return;
        try {
            await window.api.openExternal(path);
        } catch (e) {
            console.error(e);
            alert("Konnte Datei nicht öffnen.");
        }
    };

    if (isLoading) {
        return <div className="p-8">Lade Daten...</div>;
    }

    if (!masterAboExpense) {
        return (
            <div className="p-8">
                <Button variant="ghost" onClick={() => navigate("/expenses")} className="mb-4">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Zurück
                </Button>
                <div>Ausgabe nicht gefunden.</div>
            </div>
        );
    }

    const totalCalculated = subExpenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

    return (
        <div className="flex-1 w-full h-full p-8 bg-background overflow-y-auto">
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="rounded-full">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            {masterAboExpense.title}
                        </h2>
                        <p className="text-muted-foreground flex items-center gap-2 mt-1">
                            {isAboGroup ? 'Wiederkehrendes Abo' : 'Einzelne Ausgabe'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left Column: Master Details */}
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Info className="h-5 w-5 text-primary" />
                                Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Banknote className="h-4 w-4" /> Anbieter / Zweck
                                </h4>
                                <p className="mt-1 text-base">{masterAboExpense.provider || masterAboExpense.title}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Tag className="h-4 w-4" /> Kategorie
                                </h4>
                                <p className="mt-1 text-base">
                                    <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-muted/20">
                                        {masterAboExpense.category || "Keine Kategorie"}
                                    </span>
                                </p>
                            </div>

                            {isAboGroup && (
                                <>
                                    <div className="pt-4 border-t">
                                        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                            Betrag pro Rate
                                        </h4>
                                        <p className="mt-1 text-2xl font-semibold text-foreground">
                                            -{parseFloat(masterAboExpense.amount).toFixed(2)} €
                                        </p>
                                    </div>
                                    <div className="pt-2 border-t">
                                        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                            <Calendar className="h-4 w-4" /> Bisherige Buchungen
                                        </h4>
                                        <p className="mt-1 text-xl font-medium text-muted-foreground">
                                            {subExpenses.length} <span className="text-sm">Monate/Raten</span>
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                            Gesamtsumme
                                        </h4>
                                        <p className="mt-1 text-2xl font-bold text-red-500">
                                            -{totalCalculated.toFixed(2)} €
                                        </p>
                                    </div>
                                </>
                            )}
                            {!isAboGroup && (
                                <div className="pt-4 border-t">
                                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        Betrag
                                    </h4>
                                    <p className="mt-1 text-2xl font-bold text-red-500">
                                        -{parseFloat(masterAboExpense.amount).toFixed(2)} €
                                    </p>
                                </div>
                            )}

                        </CardContent>
                        <div className="p-6 pt-0 mt-4">
                            <Button variant="outline" className="w-full gap-2" onClick={() => setIsEditingMaster(true)}>
                                <Edit2 className="h-4 w-4" /> Abo / Master bearbeiten
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Deductions / Attachments */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-primary" />
                                {isAboGroup ? "Abbuchungen & Belege" : "Informationen & Belege"}
                            </CardTitle>
                            <CardDescription>
                                {isAboGroup ? "Hier sehen Sie jede einzelne Abbuchung dieses Abos. Sie können Rechnungen spezifisch für den jeweiligen Monat anheften." : "Details und Anhänge zu dieser Ausgabe."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead className="w-[120px]">Datum</TableHead>
                                            <TableHead>Betrag</TableHead>
                                            <TableHead>Anhänge</TableHead>
                                            <TableHead className="text-right">Aktionen</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {subExpenses.map((exp) => {

                                            let allAtts = exp.attachments ? [...exp.attachments] : [];
                                            if (exp.attachmentPath && allAtts.length === 0) {
                                                allAtts.push({ path: exp.attachmentPath, name: "Rechnung (Original)" });
                                            }

                                            return (
                                                <TableRow key={exp.id}>
                                                    <TableCell className="font-medium whitespace-nowrap">
                                                        {new Date(exp.date).toLocaleDateString("de-DE")}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-red-500">
                                                        -{parseFloat(exp.amount).toFixed(2)} €
                                                    </TableCell>
                                                    <TableCell>
                                                        {allAtts.length > 0 ? (
                                                            <div className="flex flex-col gap-1">
                                                                {allAtts.map((att, idx) => (
                                                                    <Button
                                                                        key={idx}
                                                                        variant="link"
                                                                        className="h-auto p-0 text-xs justify-start text-primary"
                                                                        onClick={() => handleViewAttachment(att.path)}
                                                                    >
                                                                        <Paperclip className="h-3 w-3 mr-1" />
                                                                        <span className="truncate max-w-[150px]">{att.name || "Datei"}</span>
                                                                    </Button>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground">Keine Belege</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Dropdown>
                                                            <MenuButton slots={{ root: 'button' }} slotProps={{ root: { className: 'inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground h-8 w-8 text-muted-foreground' } }}>
                                                                <MoreVertical className="h-4 w-4" />
                                                            </MenuButton>
                                                            <Menu placement="bottom-end" size="sm">
                                                                <MenuItem onClick={() => handleUploadAttachmentForSub(exp.id)}>
                                                                    <ListItemDecorator><UploadCloud className="h-4 w-4" /></ListItemDecorator> Datei anfügen {isAboGroup && "(Für diesen Monat)"}
                                                                </MenuItem>
                                                                <MenuItem color="danger" onClick={() => handleDeleteSub(exp.id)}>
                                                                    <ListItemDecorator><Trash2 className="h-4 w-4 text-red-500" /></ListItemDecorator> <span className="text-red-500">{isAboGroup ? "Diesen Monat löschen" : "Ausgabe löschen"}</span>
                                                                </MenuItem>
                                                            </Menu>
                                                        </Dropdown>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>

            {isEditingMaster && masterAboExpense && (
                <AusgabenEditor
                    open={isEditingMaster}
                    onClose={() => setIsEditingMaster(false)}
                    ausgabeToEdit={masterAboExpense}
                    onSave={loadData}
                />
            )}
        </div>
    );
}
