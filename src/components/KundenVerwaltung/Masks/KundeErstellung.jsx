import { Box, Button, Divider, FormControl, FormLabel, IconButton, Input, Modal, ModalDialog, Switch, Typography, Stack, Grid } from '@mui/joy'
import React, { useState } from 'react'
import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined';
import { kundeErstellen } from '../../../Scripts/KundenDatenBank';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useNavigate } from 'react-router-dom';
import '../../../styles/swiss.css';

function KundeErstellung({ submit }) {
    const [formData, setFormData] = React.useState({
        name: "",
        istfirma: false,
        strasse: "",
        hausnummer: "",
        plz: "",
        stadt: "",
        laenderCode: "DE", // Default
        email: "",
        tel: "",
        ansprechpartner: "",
        leitwegid: "",
        bundesland: "",
        umstid: "",
    });
    const navigate = useNavigate();

    async function create() {
        if (formData.name === "") {
            return;
        }
        const id = await kundeErstellen(
            formData.name,
            formData.istfirma,
            formData.strasse,
            formData.hausnummer,
            formData.plz,
            formData.stadt,
            formData.laenderCode,
            formData.email,
            formData.tel,
            formData.ansprechpartner,
            formData.leitwegid,
        );
        navigate("/kunden-viewer/" + id);
        submit();
    }

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Modal open={true} onClose={submit}>
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
                        Neuen Kunden anlegen
                    </Typography>
                    <IconButton onClick={submit} variant="plain" color="neutral" sx={{ borderRadius: '50%' }}>
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
                                <Input value={formData.strasse} onChange={(e) => handleChange('strasse', e.target.value)} placeholder="Hauptstraße" />
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
                                <Input value={formData.stadt} onChange={(e) => handleChange('stadt', e.target.value)} placeholder="Musterstadt" />
                            </FormControl>
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            <FormControl>
                                <FormLabel>Land (ISO)</FormLabel>
                                <Input value={formData.laenderCode} onChange={(e) => handleChange('laenderCode', e.target.value)} placeholder="DE" />
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
                    <Button variant="plain" color="neutral" onClick={submit}>Abbrechen</Button>
                    <Button onClick={create} startDecorator={<AddTaskOutlinedIcon />}>Kunden erstellen</Button>
                </Box>

            </ModalDialog>
        </Modal>
    )
}

export default KundeErstellung
