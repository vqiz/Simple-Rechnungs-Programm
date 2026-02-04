import React, { useState, useEffect } from 'react';
import { Modal, ModalDialog, Typography, Box, Input, Button, FormControl, FormLabel, Select, Option, Switch, IconButton, Divider } from '@mui/joy';
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
                title: "",
                amount: "",
                date: new Date().toISOString().split('T')[0],
                category: "",
                provider: "",
                description: "",
                isRecurring: false,
                interval: "monthly",
                file: null
            });
        }
    }, [ausgabeToEdit, open]);

    // Load preview if existing attachment
    useEffect(() => {
        const loadPreview = async () => {
            if (formData.attachmentPath && !pendingAttachment) {
                const data = await window.api.readAttachment(formData.attachmentPath);
                setAttachmentPreview(data);
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

        // Save as a one-time expense as well (if it's the first occurrence) or just normal save
        // If editing existing, just update. 
        // If new and recurring, maybe we assume the first one is created by the recurring logic? 
        // Or we create the first one now? Let's create the first one now to be safe and immediate.

        await saveAusgabe(expenseData);
        if (onSave) onSave();
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog sx={{ width: '500px', maxWidth: '90vw' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography level="h4">{ausgabeToEdit ? 'Ausgabe bearbeiten' : 'Neue Ausgabe'}</Typography>
                    <IconButton onClick={onClose}><CloseOutlinedIcon /></IconButton>
                </Box>
                <Divider />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <FormControl>
                        <FormLabel>Titel</FormLabel>
                        <Input placeholder="z.B. Server Miete" value={formData.title} onChange={e => handleChange('title', e.target.value)} required />
                    </FormControl>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl sx={{ flex: 1 }}>
                            <FormLabel>Betrag (€)</FormLabel>
                            <Input prefix="€" type="number" placeholder="0.00" value={formData.amount} onChange={e => handleChange('amount', e.target.value)} required />
                        </FormControl>
                        <FormControl sx={{ flex: 1 }}>
                            <FormLabel>Datum</FormLabel>
                            <Input type="date" value={formData.date} onChange={e => handleChange('date', e.target.value)} />
                        </FormControl>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl sx={{ flex: 1 }}>
                            <FormLabel>Kategorie</FormLabel>
                            <Input placeholder="Büro, Software..." value={formData.category} onChange={e => handleChange('category', e.target.value)} />
                        </FormControl>
                        <FormControl sx={{ flex: 1 }}>
                            <FormLabel>Empfänger / Anbieter</FormLabel>
                            <Input placeholder="Amazon, Adobe..." value={formData.provider} onChange={e => handleChange('provider', e.target.value)} />
                        </FormControl>
                    </Box>

                    <FormControl>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Switch checked={formData.isRecurring} onChange={e => handleChange('isRecurring', e.target.checked)} />
                            <Typography>Wiederkehrende Ausgabe (Abo)</Typography>
                        </Box>
                        {formData.isRecurring && (
                            <Select value={formData.interval} onChange={(e, val) => handleChange('interval', val)}>
                                <Option value="monthly">Monatlich</Option>
                                <Option value="quarterly">Vierteljährlich</Option>
                                <Option value="yearly">Jährlich</Option>
                                <Option value="weekly">Wöchentlich</Option>
                            </Select>
                        )}
                    </FormControl>

                    <Button startDecorator={<AttachFileOutlinedIcon />} variant="outlined" component="label">
                        E-Rechnung / Beleg anhängen (XML/PDF/Bild)
                        <input
                            type="file"
                            hidden
                            accept=".xml,.pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleChange('file', null, e.target.files[0])}
                        />
                    </Button>

                    {/* Attachment Preview / Info */}
                    {(attachmentPreview || formData.attachmentPath) && (
                        <Box sx={{ p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 'sm', position: 'relative' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography level="body-sm" fontWeight="bold">Anhang: {formData.file || "Datei"}</Typography>
                                <IconButton size="sm" color="danger" variant="plain" onClick={handleRemoveAttachment}>
                                    <DeleteOutlineOutlinedIcon />
                                </IconButton>
                            </Box>

                            {attachmentPreview && formData.file && (formData.file.toLowerCase().endsWith('.jpg') || formData.file.toLowerCase().endsWith('.png')) ? (
                                <img src={attachmentPreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }} />
                            ) : (
                                <Typography level="body-xs" sx={{ mt: 1 }}>{formData.file ? (formData.file.toLowerCase().endsWith('.xml') ? "E-Rechnung (XML)" : "Dokument (PDF/Andere)") : "Gespeicherter Anhang"}</Typography>
                            )}
                        </Box>
                    )}

                    <Button startDecorator={<SaveOutlinedIcon />} onClick={handleSave} color="primary">Speichern</Button>
                </Box>
            </ModalDialog>
        </Modal>
    );
}
