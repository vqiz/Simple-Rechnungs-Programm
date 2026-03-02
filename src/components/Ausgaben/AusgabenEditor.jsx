import React, { useState, useEffect } from 'react';
import { Modal, ModalDialog } from '@mui/joy';
import { saveAusgabe, saveRecurringRule } from '../../Scripts/AusgabenHandler';
import { parseERechnung } from '../../Scripts/ERechnungInterpretter';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { UploadCloud, CheckCircle2, Wallet, Calendar, AlertCircle, Trash2 } from "lucide-react";

export default function AusgabenEditor({ open, onClose, ausgabeToEdit = null, onSave }) {
    const [formData, setFormData] = useState({
        id: Date.now(),
        title: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        provider: '',
        description: '',
        isRecurring: false,
        interval: 'monthly',
        attachments: []
    });
    const [pendingAttachments, setPendingAttachments] = useState([]); // [{ name, data, type, fileObj }]

    useEffect(() => {
        if (ausgabeToEdit) {
            // Upgrade legacy single attachments to array
            let upgradedAttachments = ausgabeToEdit.attachments || [];
            if (!ausgabeToEdit.attachments && ausgabeToEdit.attachmentPath) {
                upgradedAttachments = [{ path: ausgabeToEdit.attachmentPath, name: ausgabeToEdit.file || "Anhang" }];
            }

            setFormData({
                ...ausgabeToEdit,
                attachments: upgradedAttachments,
                date: ausgabeToEdit.date ? new Date(ausgabeToEdit.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
            });
            setPendingAttachments([]);
        } else {
            setFormData({
                id: Date.now(),
                title: "",
                amount: "",
                date: new Date().toISOString().split('T')[0],
                category: "",
                provider: "",
                description: "",
                isRecurring: false,
                interval: "monthly",
                attachments: []
            });
            setPendingAttachments([]);
        }
    }, [ausgabeToEdit, open]);

    const handleChange = async (field, value, fileObj = null) => {
        // If uploading a file
        if (field === 'file' && fileObj) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const dataUrl = e.target.result;
                const newPending = {
                    name: fileObj.name,
                    data: dataUrl,
                    type: fileObj.type,
                    fileObj: fileObj
                };

                setPendingAttachments(prev => [...prev, newPending]);

                // If E-Rechnung (XML), try to parse (only for the first one or if empty)
                if (fileObj.name.toLowerCase().endsWith('.xml') && !formData.title) {
                    try {
                        const textReader = new FileReader();
                        textReader.onload = (txtEvent) => {
                            const xmlContent = txtEvent.target.result;
                            const parsedData = parseERechnung(xmlContent);
                            if (parsedData) {
                                setFormData(prev => ({
                                    ...prev,
                                    title: parsedData.title || prev.title,
                                    amount: parsedData.totalGross || prev.amount,
                                    provider: parsedData.supplier || prev.provider,
                                    date: parsedData.issueDate ? new Date(parsedData.issueDate).toISOString().split('T')[0] : prev.date,
                                    category: parsedData.category || 'Eingekaufte Leistungen'
                                }));
                            }
                        };
                        textReader.readAsText(fileObj);
                    } catch (err) {
                        console.error("XML Parse Error", err);
                    }
                }
            };
            reader.readAsDataURL(fileObj);
            return;
        }

        // Normal field update
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleRemovePending = (index) => {
        setPendingAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemoveSaved = (index) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }));
    };

    const handleSave = async () => {
        if (!formData.title || !formData.amount) return;

        let finalAttachments = [...(formData.attachments || [])];

        // Upload all pending attachments
        for (const pending of pendingAttachments) {
            const result = await window.api.saveAttachment(pending);
            if (result.success) {
                finalAttachments.push({ path: result.path, name: pending.name });
            } else {
                alert("Fehler beim Speichern des Anhangs: " + result.error);
                return;
            }
        }

        const expenseData = {
            ...formData,
            amount: parseFloat(formData.amount.toString().replace(',', '.')),
            date: new Date(formData.date).getTime(),
            attachments: finalAttachments,
            // Clean up legacy
            file: undefined,
            attachmentPath: undefined
        };

        if (formData.isRecurring) {
            let nextDue = new Date(formData.date);
            if (formData.interval === "monthly") nextDue.setMonth(nextDue.getMonth() + 1);
            else if (formData.interval === "yearly") nextDue.setFullYear(nextDue.getFullYear() + 1);
            else if (formData.interval === "weekly") nextDue.setDate(nextDue.getDate() + 7);
            else if (formData.interval === "quarterly") nextDue.setMonth(nextDue.getMonth() + 3);

            const rule = {
                title: formData.title,
                amount: parseFloat(formData.amount.toString().replace(',', '.')),
                category: formData.category,
                provider: formData.provider,
                interval: formData.interval,
                attachments: finalAttachments,
                active: true,
                nextDueDate: nextDue.getTime()
            };
            await saveRecurringRule(rule);
        }

        await saveAusgabe(expenseData);
        if (onSave) onSave();
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose} sx={{ backdropFilter: 'blur(2px)' }}>
            <ModalDialog
                variant="plain"
                sx={{
                    p: 0,
                    border: 'none',
                    bgcolor: 'transparent',
                    boxShadow: 'none',
                    maxWidth: '95vw',
                }}
            >
                <div className="w-[700px] max-w-full">
                    <Card className="shadow-2xl border-muted bg-white overflow-hidden">
                        <CardHeader className="bg-muted/30 border-b border-muted">
                            <CardTitle className="flex items-center gap-2">
                                <Wallet className="h-5 w-5 text-primary" />
                                {ausgabeToEdit ? 'Ausgabe bearbeiten' : 'Neue Betriebsausgabe'}
                            </CardTitle>
                            <CardDescription>Tragen Sie die Details der Rechnung oder Quittung ein.</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Titel/Beschreibung <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="title"
                                        placeholder="z.B. Büromaterial Staples"
                                        value={formData.title}
                                        onChange={e => handleChange('title', e.target.value)}
                                        className={!formData.title ? "border-red-300" : ""}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="provider">Anbieter/Lieferant</Label>
                                    <Input
                                        id="provider"
                                        placeholder="z.B. Staples GmbH"
                                        value={formData.provider}
                                        onChange={e => handleChange('provider', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Kategorie</Label>
                                    <Input
                                        id="category"
                                        placeholder="Büro, Software..."
                                        value={formData.category}
                                        onChange={e => handleChange('category', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date" className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        Belegdatum <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        className="w-full"
                                        value={formData.date}
                                        onChange={e => handleChange('date', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="amount">Bruttobetrag (€) <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-muted-foreground">€</span>
                                    <Input
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        className={"pl-8 text-lg font-medium " + (!formData.amount ? "border-red-300" : "")}
                                        value={formData.amount}
                                        onChange={e => handleChange('amount', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base font-semibold text-primary">Abonnement / Wiederkehrend</Label>
                                        <p className="text-sm text-muted-foreground">Wird dieser Betrag regelmäßig abgebucht?</p>
                                    </div>
                                    <Switch checked={formData.isRecurring} onCheckedChange={val => handleChange('isRecurring', val)} />
                                </div>

                                {formData.isRecurring && (
                                    <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                        <div className="space-y-2">
                                            <Label>Intervall</Label>
                                            <Select value={formData.interval} onValueChange={val => handleChange('interval', val)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Intervall wählen" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="weekly">Wöchentlich</SelectItem>
                                                    <SelectItem value="monthly">Monatlich</SelectItem>
                                                    <SelectItem value="quarterly">Quartalsweise</SelectItem>
                                                    <SelectItem value="yearly">Jährlich</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2 flex items-center pt-6 text-sm text-amber-600 font-medium">
                                            <AlertCircle className="h-4 w-4 mr-2" />
                                            Wird in den Statistiken fortlaufend berechnet.
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Beleg anhängen (PDF, JPG, PNG)</Label>

                                <div className="space-y-3">
                                    <div className="relative border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => document.getElementById('file-upload').click()}>
                                        <input
                                            id="file-upload"
                                            type="file"
                                            multiple
                                            hidden
                                            accept=".xml,.pdf,.jpg,.jpeg,.png"
                                            onChange={(e) => Array.from(e.target.files).forEach(f => handleChange('file', null, f))}
                                        />
                                        <UploadCloud className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                        <div className="text-sm font-medium">Dateien hinzufügen (PDF, JPG, PNG, XML)</div>
                                    </div>

                                    {/* List Saved Attachments */}
                                    {formData.attachments && formData.attachments.map((att, idx) => (
                                        <div key={`saved-${idx}`} className="p-3 border rounded-md bg-muted/10 relative flex items-center justify-between">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="h-10 w-10 flex items-center justify-center bg-background rounded border text-muted-foreground">
                                                    📄
                                                </div>
                                                <div className="flex flex-col truncate">
                                                    <span className="text-sm font-medium truncate">{att.name || "Gespeicherter Anhang"}</span>
                                                    <span className="text-xs text-muted-foreground">Historischer Anhang</span>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleRemoveSaved(idx)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}

                                    {/* List Pending Attachments */}
                                    {pendingAttachments.map((pending, idx) => (
                                        <div key={`pending-${idx}`} className="p-3 border rounded-md bg-muted/30 relative flex items-center justify-between">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                {pending.name.toLowerCase().endsWith('.jpg') || pending.name.toLowerCase().endsWith('.png') ? (
                                                    <img src={pending.data} alt="Preview" className="h-10 w-10 object-cover rounded border" />
                                                ) : (
                                                    <div className="h-10 w-10 flex items-center justify-center bg-background rounded border text-muted-foreground">
                                                        📄
                                                    </div>
                                                )}
                                                <div className="flex flex-col truncate">
                                                    <span className="text-sm font-medium truncate">{pending.name}</span>
                                                    <span className="text-xs text-muted-foreground">Neue Datei</span>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleRemovePending(idx)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="bg-muted/30 border-t border-muted px-6 py-4 flex justify-between items-center">
                            <Button variant="ghost" onClick={onClose}>Abbrechen</Button>
                            <Button className="gap-2 bg-primary hover:bg-primary/90" onClick={handleSave}>
                                <CheckCircle2 className="h-4 w-4" />
                                Ausgabe speichern
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </ModalDialog>
        </Modal>
    );
}
