import React from 'react';
import { ModalDialog, Typography, Box, Input, Button, FormControl, FormLabel, Select, Option, Switch, IconButton, Divider } from '@mui/joy';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

export default function AusgabenEditorMock() {
    const formData = {
        title: "Office 365 Lizenz",
        amount: "12.99",
        date: "2024-02-01",
        category: "Software",
        provider: "Microsoft",
        description: "",
        isRecurring: true,
        interval: "monthly",
        file: null
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <ModalDialog sx={{
                width: '500px',
                maxWidth: '90vw',
                position: 'static',
                transform: 'none',
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography level="h4">Neue Ausgabe</Typography>
                    <IconButton><CloseOutlinedIcon /></IconButton>
                </Box>
                <Divider />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <FormControl>
                        <FormLabel>Titel</FormLabel>
                        <Input placeholder="z.B. Server Miete" value={formData.title} required />
                    </FormControl>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl sx={{ flex: 1 }}>
                            <FormLabel>Betrag (€)</FormLabel>
                            <Input prefix="€" type="number" placeholder="0.00" value={formData.amount} required />
                        </FormControl>
                        <FormControl sx={{ flex: 1 }}>
                            <FormLabel>Datum</FormLabel>
                            <Input type="date" value={formData.date} />
                        </FormControl>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl sx={{ flex: 1 }}>
                            <FormLabel>Kategorie</FormLabel>
                            <Input placeholder="Büro, Software..." value={formData.category} />
                        </FormControl>
                        <FormControl sx={{ flex: 1 }}>
                            <FormLabel>Empfänger / Anbieter</FormLabel>
                            <Input placeholder="Amazon, Adobe..." value={formData.provider} />
                        </FormControl>
                    </Box>

                    <FormControl>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Switch checked={formData.isRecurring} />
                            <Typography>Wiederkehrende Ausgabe (Abo)</Typography>
                        </Box>
                        {formData.isRecurring && (
                            <Select value={formData.interval}>
                                <Option value="monthly">Monatlich</Option>
                                <Option value="quarterly">Vierteljährlich</Option>
                                <Option value="yearly">Jährlich</Option>
                                <Option value="weekly">Wöchentlich</Option>
                            </Select>
                        )}
                    </FormControl>

                    <Button startDecorator={<AttachFileOutlinedIcon />} variant="outlined" component="label">
                        E-Rechnung / Beleg anhängen (XML/PDF/Bild)
                        <input type="file" hidden accept=".xml,.pdf,.jpg,.jpeg,.png" />
                    </Button>

                    <Box sx={{ p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 'sm', position: 'relative' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography level="body-sm" fontWeight="bold">Anhang: rechnung.pdf</Typography>
                            <IconButton size="sm" color="danger" variant="plain">
                                <DeleteOutlineOutlinedIcon />
                            </IconButton>
                        </Box>
                        <Typography level="body-xs" sx={{ mt: 1 }}>Dokument (PDF/Andere)</Typography>
                    </Box>

                    <Button startDecorator={<SaveOutlinedIcon />} color="primary">Speichern</Button>
                </Box>
            </ModalDialog>
        </div>
    );
}
