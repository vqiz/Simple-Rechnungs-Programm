import { Box, Button, Divider, FormControl, FormLabel, IconButton, Input, Modal, ModalDialog, Typography, Stack } from '@mui/joy'
import React from 'react'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { handleLoadFile, handleSaveFile } from '../../Scripts/Filehandler';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import '../../styles/swiss.css';

function LieferantenCreator({ close }) {
    const [formData, setFormData] = React.useState({
        name: "",
        straße: "",
        hausnummer: "",
        city: "",
        plz: "",
        ansprechpartner: "",
        email: "",
        tel: "",
        dateien: [],
    });

    const submit = async () => {
        if (!formData.name) return; // Basic validation
        await handleLoadFile("lieferanten/test.data"); // Ensure dir exists (legacy check?)
        await handleSaveFile("lieferanten/" + formData.name, JSON.stringify(formData));
        close(formData.name);
    }

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Modal open={true} onClose={() => close()}>
            <ModalDialog
                variant='outlined'
                role="alertdialog"
                sx={{
                    borderRadius: "xl",
                    width: "600px",
                    maxWidth: "95vw",
                    p: 0,
                    overflow: 'hidden',
                    bgcolor: 'var(--md-sys-color-surface)'
                }}>

                {/* Header */}
                <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: 'var(--md-sys-color-surface-container)' }}>
                    <Typography level='h4' fontWeight="lg">
                        Neuen Lieferanten anlegen
                    </Typography>
                    <IconButton onClick={() => close()} variant="plain" color="neutral" sx={{ borderRadius: '50%' }}>
                        <CloseOutlinedIcon />
                    </IconButton>
                </Box>
                <Divider />

                {/* Body */}
                <Box sx={{ p: 3, maxHeight: '70vh', overflowY: 'auto' }}>
                    <Stack spacing={2}>
                        <FormControl required>
                            <FormLabel>Firmenname / Name</FormLabel>
                            <Input
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="z.B. Mustermann GmbH"
                            />
                        </FormControl>

                        <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 2 }}>
                            <FormControl>
                                <FormLabel>Straße</FormLabel>
                                <Input value={formData.straße} onChange={(e) => handleChange('straße', e.target.value)} placeholder="Hauptstraße" />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Nr.</FormLabel>
                                <Input value={formData.hausnummer} onChange={(e) => handleChange('hausnummer', e.target.value)} placeholder="1" />
                            </FormControl>
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 2 }}>
                            <FormControl>
                                <FormLabel>PLZ</FormLabel>
                                <Input value={formData.plz} onChange={(e) => handleChange('plz', e.target.value)} placeholder="12345" />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Ort</FormLabel>
                                <Input value={formData.city} onChange={(e) => handleChange('city', e.target.value)} placeholder="Musterstadt" />
                            </FormControl>
                        </Box>

                        <Divider><Typography level="body-xs">Kontakt</Typography></Divider>

                        <FormControl>
                            <FormLabel>Ansprechpartner</FormLabel>
                            <Input value={formData.ansprechpartner} onChange={(e) => handleChange('ansprechpartner', e.target.value)} placeholder="z.B. Max Mustermann" />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Email</FormLabel>
                            <Input value={formData.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="email@example.com" type="email" />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Telefon</FormLabel>
                            <Input value={formData.tel} onChange={(e) => handleChange('tel', e.target.value)} placeholder="+49 123 456789" />
                        </FormControl>
                    </Stack>
                </Box>

                <Divider />

                {/* Footer */}
                <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", gap: 1, bgcolor: 'var(--swiss-gray-50)' }}>
                    <Button variant="plain" color="neutral" onClick={() => close()}>Abbrechen</Button>
                    <Button onClick={submit} startDecorator={<AddCircleOutlineOutlinedIcon />}>Erstellen</Button>
                </Box>

            </ModalDialog>
        </Modal>
    )
}

export default LieferantenCreator
