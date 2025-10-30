import { Box, Button, Divider, FormControl, FormLabel, IconButton, Input, Modal, ModalDialog, Switch, Typography } from '@mui/joy'
import React, { useState } from 'react'
import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined';
import { kundeErstellen } from '../../../Scripts/KundenDatenBank';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useNavigate } from 'react-router-dom';
function KundeErstellung({ submit }) {
    const [formData, setFormData] = React.useState({
        name: "",
        istfirma: false,
        strasse: "",
        hausnummer: "",
        plz: "",
        stadt: "",
        laenderCode: "",
        email: "",
        tel: "",
        ansprechüartner: "",
        leitwegid: "",
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
            formData.ansprechüartner,
            formData.leitwegid,
        );
        navigate("/kunden-viewer/" + id);
        submit();

    }

    return (
        <Modal open={true}>
            <ModalDialog
                variant='outlined'
                sx={{
                    borderRadius: "md",
                    width: "55vh",
                    maxWidth: "90vw",
                }}>
                <form>
                    <Box sx={{ display: "flex", width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
                        <Typography level='h3' mb={1}>
                            Kunde erstellen
                        </Typography>
                        <IconButton onClick={() => {submit();}} sx={{mt: -1}}>
                            <CloseOutlinedIcon/>
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
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        istfirma: e.target.checked,
                                    });
                                }}
                                color="primary"
                            />
                            <Typography variant="body1" color="text.secondary">
                                Firma
                            </Typography>
                        </Box>
                        <FormControl>
                            <FormLabel sx={{ color: "gray" }}>{formData.istfirma ? "Firmenname" : "Vor und Nachname"}</FormLabel>
                            <Input value={formData.name} onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                });
                            }} placeholder='z.B. Max Mustermann' required />
                        </FormControl>
                        <Box sx={{ display: "flex", flexDirection: "row", gap: 2, width: "100%" }}>
                            <FormControl sx={{ width: "70%" }}>
                                <FormLabel sx={{ color: "gray" }}>Straße</FormLabel>
                                <Input value={formData.strasse} onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        strasse: e.target.value,
                                    });
                                }} placeholder='z.B. Musterstraße' />
                            </FormControl>
                            <FormControl sx={{ width: "30%" }}>
                                <FormLabel sx={{ color: "gray" }}>Hausnummer</FormLabel>
                                <Input value={formData.hausnummer} onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        hausnummer: e.target.value,
                                    });
                                }} placeholder='z.B. 92' />
                            </FormControl>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "row", gap: 2, width: "100%" }}>
                            <FormControl>
                                <FormLabel sx={{ color: "gray" }}>PLZ</FormLabel>
                                <Input value={formData.plz} onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        plz: e.target.value,
                                    });
                                }} placeholder='z.B. 94315' type='Number' />
                            </FormControl>
                            <FormControl sx={{ width: "60%" }}>
                                <FormLabel sx={{ color: "gray" }}>Stadt | Ort</FormLabel>
                                <Input value={formData.stadt} onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        stadt: e.target.value,
                                    });
                                }} placeholder='z.B. Straubing' />
                            </FormControl>
                        </Box>
                        <FormControl>
                            <FormLabel sx={{ color: "gray" }}>Ländercode | ISO-Code</FormLabel>
                            <Input value={formData.laenderCode} onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    laenderCode: e.target.value,
                                });
                            }} placeholder='z.B. DE' />
                        </FormControl>
                        <FormControl>
                            <FormLabel sx={{ color: "gray" }}>{formData.istfirma ? "Email des Unternehmens" : "Email Adresse"}</FormLabel>
                            <Input value={formData.email} onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                });
                            }} placeholder={formData.istfirma ? "z.B. info@testgmbh.de" : "z.B. max.mustermann@gmail.com"} />
                        </FormControl>
                        <FormControl>
                            <FormLabel sx={{ color: "gray" }}>Telefonnummer</FormLabel>
                            <Input value={formData.tel} onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    tel: e.target.value,
                                });
                            }} placeholder='z.B. +4915151136187' />
                        </FormControl>
                        {formData.istfirma && (
                            <FormControl>
                                <FormLabel sx={{ color: "gray" }}>Ansprechpartner | {"(freilassen falls nicht vorhanden)"}</FormLabel>
                                <Input value={formData.ansprechüartner} onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        ansprechüartner: e.target.value,
                                    });
                                }} placeholder='z.B. Mia Leitner' />
                            </FormControl>
                        )}
                        <FormControl>
                            <FormLabel sx={{ color: "gray" }}>Leitwegid | {"(für X-Rechnungen)"}</FormLabel>
                            <Input value={formData.leitwegid} onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    leitwegid: e.target.value,
                                });
                            }} />
                        </FormControl>
                        <Button onClick={() => create()} startDecorator={<AddTaskOutlinedIcon />}>Erstellen</Button>
                    </Box>
                </form>
            </ModalDialog>
        </Modal>
    )
}

export default KundeErstellung
