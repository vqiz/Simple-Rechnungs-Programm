import { Box, Button, Divider, FormControl, FormLabel, IconButton, Input, ModalDialog, Switch, Typography } from '@mui/joy'
import React from 'react'
import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

export default function KundeErstellenMock() {
    const formData = {
        name: "Max Mustermann",
        istfirma: false,
        strasse: "Musterstraße",
        hausnummer: "42",
        plz: "80331",
        stadt: "München",
        laenderCode: "DE",
        email: "max.mustermann@example.com",
        tel: "+49 89 12345678",
        ansprechpartner: "",
        leitwegid: "",
        bundesland: "Bayern",
        umstid: "",
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <ModalDialog
                variant='outlined'
                sx={{
                    borderRadius: "md",
                    width: "55vh",
                    maxWidth: "90vw",
                    position: 'static',
                    transform: 'none',
                }}>
                <form>
                    <Box sx={{ display: "flex", width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
                        <Typography level='h3' mb={1}>
                            Kunde erstellen
                        </Typography>
                        <IconButton sx={{ mt: -1 }}>
                            <CloseOutlinedIcon />
                        </IconButton>
                    </Box>
                    <Divider orientation="horizontal" />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            p: 2,
                            boxShadow: 1,
                            backgroundColor: "background.paper"
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                justifyContent: "center"
                            }}
                        >
                            <Typography variant="body1" color="text.secondary">
                                Privatperson
                            </Typography>
                            <Switch
                                checked={formData.istfirma}
                                color="primary"
                            />
                            <Typography variant="body1" color="text.secondary">
                                Firma
                            </Typography>
                        </Box>
                        <FormControl>
                            <FormLabel sx={{ color: "gray" }}>{formData.istfirma ? "Firmenname" : "Vor und Nachname"}</FormLabel>
                            <Input value={formData.name} placeholder='z.B. Max Mustermann' required />
                        </FormControl>
                        <Box sx={{ display: "flex", flexDirection: "row", gap: 2, width: "100%" }}>
                            <FormControl sx={{ width: "70%" }}>
                                <FormLabel sx={{ color: "gray" }}>Straße</FormLabel>
                                <Input value={formData.strasse} placeholder='z.B. Musterstraße' />
                            </FormControl>
                            <FormControl sx={{ width: "30%" }}>
                                <FormLabel sx={{ color: "gray" }}>Hausnummer</FormLabel>
                                <Input value={formData.hausnummer} placeholder='z.B. 92' />
                            </FormControl>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "row", gap: 2, width: "100%" }}>
                            <FormControl>
                                <FormLabel sx={{ color: "gray" }}>PLZ</FormLabel>
                                <Input value={formData.plz} placeholder='z.B. 94315' type='Number' />
                            </FormControl>
                            <FormControl sx={{ width: "60%" }}>
                                <FormLabel sx={{ color: "gray" }}>Stadt | Ort</FormLabel>
                                <Input value={formData.stadt} placeholder='z.B. Straubing' />
                            </FormControl>
                        </Box>
                        <FormControl>
                            <FormLabel sx={{ color: "gray" }}>Ländercode | ISO-Code</FormLabel>
                            <Input value={formData.laenderCode} placeholder='z.B. DE' />
                        </FormControl>
                        <FormControl>
                            <FormLabel sx={{ color: "gray" }}>Bundesland</FormLabel>
                            <Input value={formData.bundesland} placeholder='z.B. Bayern' />
                        </FormControl>
                        <FormControl>
                            <FormLabel sx={{ color: "gray" }}>{formData.istfirma ? "Email des Unternehmens" : "Email Adresse"}</FormLabel>
                            <Input value={formData.email} placeholder={formData.istfirma ? "z.B. info@testgmbh.de" : "z.B. max.mustermann@gmail.com"} />
                        </FormControl>
                        <FormControl>
                            <FormLabel sx={{ color: "gray" }}>Telefonnummer</FormLabel>
                            <Input value={formData.tel} placeholder='z.B. +4915151136187' />
                        </FormControl>
                        {formData.istfirma && (
                            <>
                                <FormControl>
                                    <FormLabel sx={{ color: "gray" }}>Ansprechpartner | {"(freilassen falls nicht vorhanden)"}</FormLabel>
                                    <Input value={formData.ansprechpartner} placeholder='z.B. Mia Leitner' />
                                </FormControl>
                                <FormControl>
                                    <FormLabel sx={{ color: "gray" }}>Umsatzsteuer-Id | {"(Pflicht für X-Rechnung)"}</FormLabel>
                                    <Input value={formData.umstid} placeholder='z.B. DE123456789' />
                                </FormControl>
                            </>
                        )}
                        <FormControl>
                            <FormLabel sx={{ color: "gray" }}>Leitwegid | {"(für X-Rechnungen)"}</FormLabel>
                            <Input value={formData.leitwegid} />
                        </FormControl>
                        <Button startDecorator={<AddTaskOutlinedIcon />}>Erstellen</Button>
                    </Box>
                </form>
            </ModalDialog>
        </div>
    )
}
