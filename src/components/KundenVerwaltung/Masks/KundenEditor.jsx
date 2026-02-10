import React, { useEffect } from 'react'
import { handleLoadFile, handleSaveFile } from '../../../Scripts/Filehandler';
import { Box, Button, Divider, FormControl, FormLabel, IconButton, Input, Modal, ModalDialog, Switch, Typography, Stack, Grid } from '@mui/joy'
import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useNavigate } from 'react-router-dom';
import '../../../styles/swiss.css';

function KundenEditor({ id, close }) {
    const [formData, setFormData] = React.useState({
        name: "",
        istfirma: false,
        street: "",
        number: "",
        plz: "",
        ort: "",
        landcode: "DE",
        email: "",
        tel: "",
        ansprechpartner: "",
        leitwegid: "",
        bundesland: "",
        umstid: "",
    });

    useEffect(() => {
        const fetch = async () => {
            const stringdata = await handleLoadFile("kunden/" + id + ".person");
            const data = JSON.parse(stringdata);
            if (data.ansprechüartner) {
                data.ansprechpartner = data.ansprechüartner;
                delete data.ansprechüartner;
            }
            setFormData(data);
        };
        fetch();
    }, [id]);

    const save = async () => {
        // Ensure the formData has a valid ID and convert it to a string
        let currentId = String(formData.id || id);
        const updatedData = { ...formData, id: currentId };

        // Save full customer data to file
        await handleSaveFile("kunden/" + currentId + ".person", JSON.stringify(updatedData));

        // Load and update the fast access database
        const string = await handleLoadFile("fast_accsess/kunden.db");
        const json = JSON.parse(string);

        // Remove any old entry with the same ID
        json.list = json.list.filter((i) => i.id !== currentId);

        // Create updated summary item
        const item = {
            name: updatedData.name,
            id: updatedData.id,
            istfirma: updatedData.istfirma,
            email: updatedData.email,
        };

        // Add updated item and save back
        json.list.push(item);

        await handleSaveFile("fast_accsess/kunden.db", JSON.stringify(json));

        close();
    }

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Modal open={true} onClose={close}>
            <ModalDialog
                variant='outlined'
                role="alertdialog"
                sx={{
                    borderRadius: "xl",
                    width: "600px",
                    maxWidth: "95vw",
                    p: 0,
                    overflow: 'hidden',
                    bgcolor: 'white'
                }}>

                {/* Header */}
                <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: 'var(--md-sys-color-surface-container)' }}>
                    <Typography level='h4' fontWeight="lg">
                        Kunden bearbeiten
                    </Typography>
                    <IconButton onClick={close} variant="plain" color="neutral" sx={{ borderRadius: '50%' }}>
                        <CloseOutlinedIcon />
                    </IconButton>
                </Box>
                <Divider />

                {/* Body */}
                <Box sx={{ p: 3, maxHeight: '70vh', overflowY: 'auto' }}>
                    <Stack spacing={3}>

                        {/* Typ Toggle */}
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, p: 1, bgcolor: 'var(--swiss-gray-50)', borderRadius: 'lg' }}>
                            <Typography level="body-sm" sx={{ fontWeight: !formData.istfirma ? 'bold' : 'normal', color: !formData.istfirma ? 'primary.plainColor' : 'neutral.plainColor' }}>
                                Privatperson
                            </Typography>
                            <Switch
                                checked={formData.istfirma}
                                onChange={(e) => handleChange('istfirma', e.target.checked)}
                                color="primary"
                                size="lg"
                            />
                            <Typography level="body-sm" sx={{ fontWeight: formData.istfirma ? 'bold' : 'normal', color: formData.istfirma ? 'primary.plainColor' : 'neutral.plainColor' }}>
                                Unternehmen
                            </Typography>
                        </Box>

                        <FormControl required>
                            <FormLabel>{formData.istfirma ? "Firmenname" : "Vor- und Nachname"}</FormLabel>
                            <Input
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder={formData.istfirma ? "Musterfirma GmbH" : "Max Mustermann"}
                            />
                        </FormControl>

                        <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 2 }}>
                            <FormControl>
                                <FormLabel>Straße</FormLabel>
                                <Input value={formData.street} onChange={(e) => handleChange('street', e.target.value)} placeholder="Hauptstraße" />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Nr.</FormLabel>
                                <Input value={formData.number} onChange={(e) => handleChange('number', e.target.value)} placeholder="1" />
                            </FormControl>
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 2 }}>
                            <FormControl>
                                <FormLabel>PLZ</FormLabel>
                                <Input value={formData.plz} onChange={(e) => handleChange('plz', e.target.value)} placeholder="12345" />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Ort</FormLabel>
                                <Input value={formData.ort} onChange={(e) => handleChange('ort', e.target.value)} placeholder="Musterstadt" />
                            </FormControl>
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            <FormControl>
                                <FormLabel>Land ({formData.landcode || 'ISO'})</FormLabel>
                                <Input value={formData.landcode} onChange={(e) => handleChange('landcode', e.target.value)} placeholder="DE" />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Bundesland</FormLabel>
                                <Input value={formData.bundesland} onChange={(e) => handleChange('bundesland', e.target.value)} placeholder="Bayern" />
                            </FormControl>
                        </Box>

                        <Divider><Typography level="body-xs">Kontakt</Typography></Divider>

                        <FormControl>
                            <FormLabel>Email Adresse</FormLabel>
                            <Input value={formData.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="email@example.com" type="email" />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Telefonnummer</FormLabel>
                            <Input value={formData.tel} onChange={(e) => handleChange('tel', e.target.value)} placeholder="+49 123 456789" />
                        </FormControl>

                        {formData.istfirma && (
                            <>
                                <Divider><Typography level="body-xs">Firmen Details</Typography></Divider>
                                <FormControl>
                                    <FormLabel>Ansprechpartner</FormLabel>
                                    <Input value={formData.ansprechpartner} onChange={(e) => handleChange('ansprechpartner', e.target.value)} placeholder="z.B. Frau Schmidt" />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Umsatzsteuer-ID</FormLabel>
                                    <Input value={formData.umstid} onChange={(e) => handleChange('umstid', e.target.value)} placeholder="DE123456789" />
                                </FormControl>
                            </>
                        )}

                        <FormControl>
                            <FormLabel>Leitweg-ID (X-Rechnung)</FormLabel>
                            <Input value={formData.leitwegid} onChange={(e) => handleChange('leitwegid', e.target.value)} placeholder="0000-0000-00" />
                        </FormControl>

                    </Stack>
                </Box>

                <Divider />

                {/* Footer */}
                <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", gap: 1, bgcolor: 'var(--swiss-gray-50)' }}>
                    <Button variant="plain" color="neutral" onClick={close}>Abbrechen</Button>
                    <Button onClick={save} startDecorator={<AddTaskOutlinedIcon />}>Speichern</Button>
                </Box>

            </ModalDialog>
        </Modal>
    )
}

export default KundenEditor
