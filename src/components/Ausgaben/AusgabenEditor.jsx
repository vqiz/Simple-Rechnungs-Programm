import React, { useState, useEffect } from 'react';
import { Modal, ModalDialog, Typography, Box, Input, Button, FormControl, FormLabel, Select, Option, Switch, IconButton, Divider } from '@mui/joy';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import { saveAusgabe, saveRecurringRule } from '../../Scripts/AusgabenHandler';

export default function AusgabenEditor({ open, onClose, ausgabeToEdit = null, onSave }) {
    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        date: new Date().toISOString().split('T')[0],
        category: "",
        provider: "",
        description: "",
        isRecurring: false,
        interval: "monthly", // monthly, yearly, weekly
        file: null
    });

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

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        if (!formData.title || !formData.amount) return;

        const expenseData = {
            ...formData,
            amount: parseFloat(formData.amount),
            date: new Date(formData.date).getTime(),
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
                        Beleg anhängen (PDF/Bild)
                        <input type="file" hidden onChange={(e) => handleChange('file', e.target.files[0]?.path || null)} />
                    </Button>
                    {formData.file && <Typography level="body-sm">Datei: {formData.file}</Typography>}

                    <Button startDecorator={<SaveOutlinedIcon />} onClick={handleSave} color="primary">Speichern</Button>
                </Box>
            </ModalDialog>
        </Modal>
    );
}
