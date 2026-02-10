import React, { useState, useEffect } from 'react';
import { Modal, ModalDialog, Typography, Box, Input, Button, FormControl, FormLabel, Select, Option, Switch, IconButton, Divider, Stack } from '@mui/joy';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { saveAusgabe, saveRecurringRule } from '../../Scripts/AusgabenHandler';
import { parseERechnung } from '../../Scripts/ERechnungInterpretter';
import { handleLoadFile } from '../../Scripts/Filehandler';

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
        file: null,
        attachmentPath: null
    });
    const [pendingAttachment, setPendingAttachment] = useState(null); // { name, data, type }
    const [attachmentPreview, setAttachmentPreview] = useState(null);

    useEffect(() => {
        if (ausgabeToEdit) {
            setFormData({
                ...ausgabeToEdit,
                date: ausgabeToEdit.date ? new Date(ausgabeToEdit.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
            });
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
                file: null,
                attachmentPath: null
            });
            setPendingAttachment(null);
            setAttachmentPreview(null);
        }
    }, [ausgabeToEdit, open]);

    // Load preview if existing attachment
    useEffect(() => {
        const loadPreview = async () => {
            if (formData.attachmentPath && !pendingAttachment) {
                try {
                    const data = await window.api.readAttachment(formData.attachmentPath);
                    setAttachmentPreview(data);
                } catch (e) {
                    console.error("Failed to load attachment preview", e);
                }
            }
        };
        if (open) loadPreview();
    }, [formData.attachmentPath, open, pendingAttachment]);

    const handleChange = async (field, value, fileObj = null) => {
        // If uploading a file
        if (field === 'file' && fileObj) {

            // 1. Read file as DataURL for storage/preview
            const reader = new FileReader();
            reader.onload = async (e) => {
                const dataUrl = e.target.result;
                setPendingAttachment({
                    name: fileObj.name,
                    data: dataUrl,
                    type: fileObj.type
                });
                setAttachmentPreview(dataUrl);

                // 2. If E-Rechnung (XML), try to parse
                if (fileObj.name.toLowerCase().endsWith('.xml')) {
                    try {
                        // XML is text, read as text for parsing logic
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
                                    category: parsedData.category || 'Eingekaufte Leistungen',
                                    file: fileObj.name
                                }));
                            }
                        };
                        textReader.readAsText(fileObj);
                    } catch (err) {
                        console.error("XML Parse Error", err);
                    }
                } else {
                    setFormData(prev => ({ ...prev, file: fileObj.name }));
                }
            };
            reader.readAsDataURL(fileObj);
            return;
        }

        // Normal field update
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleRemoveAttachment = () => {
        setPendingAttachment(null);
        setAttachmentPreview(null);
        setFormData(prev => ({
            ...prev,
            file: null,
            attachmentPath: null
        }));
    };

    const handleSave = async () => {
        if (!formData.title || !formData.amount) return;

        let finalAttachmentPath = formData.attachmentPath;

        // Upload attachment if pending
        if (pendingAttachment) {
            const result = await window.api.saveAttachment(pendingAttachment);
            if (result.success) {
                finalAttachmentPath = result.path;
            } else {
                alert("Fehler beim Speichern des Anhangs: " + result.error);
                return;
            }
        }

        const expenseData = {
            ...formData,
            amount: parseFloat(formData.amount),
            date: new Date(formData.date).getTime(),
            attachmentPath: finalAttachmentPath
        };

        if (formData.isRecurring) {
            // Calculate next due date to avoid duplicate creation by checkRecurringExpenses
            // because we are saving the first one manually below.
            let nextDue = new Date(formData.date);
            if (formData.interval === "monthly") {
                nextDue.setMonth(nextDue.getMonth() + 1);
            } else if (formData.interval === "yearly") {
                nextDue.setFullYear(nextDue.getFullYear() + 1);
            } else if (formData.interval === "weekly") {
                nextDue.setDate(nextDue.getDate() + 7);
            } else if (formData.interval === "quarterly") {
                nextDue.setMonth(nextDue.getMonth() + 3);
            }

            // Save as a recurring rule
            const rule = {
                title: formData.title,
                amount: parseFloat(formData.amount),
                category: formData.category,
                provider: formData.provider,
                interval: formData.interval,
                file: formData.file,
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
        <Modal open={open} onClose={onClose}>
            <ModalDialog
                variant="outlined"
                role="alertdialog"
                sx={{
                    borderRadius: "xl",
                    width: "600px",
                    maxWidth: "95vw",
                    p: 0,
                    overflow: 'hidden',
                    bgcolor: 'var(--md-sys-color-surface)'
                }}
            >
                {/* Header */}
                <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: 'var(--md-sys-color-surface-container)' }}>
                    <Typography level='h4' fontWeight="lg">
                        {ausgabeToEdit ? 'Ausgabe bearbeiten' : 'Neue Ausgabe'}
                    </Typography>
                    <IconButton onClick={onClose} variant="plain" color="neutral" sx={{ borderRadius: '50%' }}>
                        <CloseOutlinedIcon />
                    </IconButton>
                </Box>
                <Divider />

                {/* Body */}
                <Box sx={{ p: 3, maxHeight: '70vh', overflowY: 'auto' }}>
                    <Stack spacing={2}>
                        <FormControl required>
                            <FormLabel>Titel</FormLabel>
                            <Input
                                placeholder="z.B. Server Miete"
                                value={formData.title}
                                onChange={e => handleChange('title', e.target.value)}
                            />
                        </FormControl>

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            <FormControl required>
                                <FormLabel>Betrag (€)</FormLabel>
                                <Input
                                    startDecorator="€"
                                    type="number"
                                    placeholder="0.00"
                                    value={formData.amount}
                                    onChange={e => handleChange('amount', e.target.value)}
                                    slotProps={{ input: { step: "0.01" } }}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Datum</FormLabel>
                                <Input
                                    type="date"
                                    value={formData.date}
                                    onChange={e => handleChange('date', e.target.value)}
                                />
                            </FormControl>
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            <FormControl>
                                <FormLabel>Kategorie</FormLabel>
                                <Input
                                    placeholder="Büro, Software..."
                                    value={formData.category}
                                    onChange={e => handleChange('category', e.target.value)}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Empfänger / Anbieter</FormLabel>
                                <Input
                                    placeholder="Amazon, Adobe..."
                                    value={formData.provider}
                                    onChange={e => handleChange('provider', e.target.value)}
                                />
                            </FormControl>
                        </Box>

                        <Divider />

                        <FormControl>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between", mb: 1 }}>
                                <Typography fontWeight="md">Wiederkehrende Ausgabe (Abo)</Typography>
                                <Switch checked={formData.isRecurring} onChange={e => handleChange('isRecurring', e.target.checked)} />
                            </Box>
                            {formData.isRecurring && (
                                <Select value={formData.interval} onChange={(e, val) => handleChange('interval', val)} sx={{ mt: 1 }}>
                                    <Option value="monthly">Monatlich</Option>
                                    <Option value="quarterly">Vierteljährlich</Option>
                                    <Option value="yearly">Jährlich</Option>
                                    <Option value="weekly">Wöchentlich</Option>
                                </Select>
                            )}
                        </FormControl>

                        <Divider />

                        <FormControl>
                            <FormLabel>Anhang (E-Rechnung / Beleg)</FormLabel>
                            <Button
                                variant="outlined"
                                color="neutral"
                                component="label"
                                startDecorator={<AttachFileOutlinedIcon />}
                                sx={{ width: '100%', justifyContent: 'flex-start' }}
                            >
                                Datei auswählen...
                                <input
                                    type="file"
                                    hidden
                                    accept=".xml,.pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => handleChange('file', null, e.target.files[0])}
                                />
                            </Button>
                            {/* Attachment Preview / Info */}
                            {(attachmentPreview || formData.attachmentPath) && (
                                <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 'md', position: 'relative', bgcolor: 'background.level1' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography level="body-sm" fontWeight="bold" noWrap sx={{ maxWidth: '80%' }}>
                                            {formData.file || "Unbekannte Datei"}
                                        </Typography>
                                        <IconButton size="sm" color="danger" variant="plain" onClick={handleRemoveAttachment}>
                                            <DeleteOutlineOutlinedIcon />
                                        </IconButton>
                                    </Box>

                                    {attachmentPreview && formData.file && (formData.file.toLowerCase().endsWith('.jpg') || formData.file.toLowerCase().endsWith('.png')) ? (
                                        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', bgcolor: 'white', borderRadius: 'sm', overflow: 'hidden' }}>
                                            <img src={attachmentPreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain' }} />
                                        </Box>
                                    ) : (
                                        <Typography level="body-xs" sx={{ mt: 1, color: 'text.secondary' }}>
                                            {formData.file ? (formData.file.toLowerCase().endsWith('.xml') ? "E-Rechnung (XML-Format)" : "Dokument (PDF/Andere)") : "Gespeicherter Anhang"}
                                        </Typography>
                                    )}
                                </Box>
                            )}
                        </FormControl>
                    </Stack>
                </Box>
                <Divider />

                {/* Footer */}
                <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", gap: 1, bgcolor: 'var(--swiss-gray-50)' }}>
                    <Button variant="plain" color="neutral" onClick={onClose}>Abbrechen</Button>
                    <Button onClick={handleSave} startDecorator={<SaveOutlinedIcon />}>Speichern</Button>
                </Box>
            </ModalDialog>
        </Modal>
    );
}
