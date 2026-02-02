import React, { useEffect } from 'react'
import { handleLoadFile, handleSaveFile } from '../../../Scripts/Filehandler';
import { Box, Button, Divider, FormControl, FormLabel, IconButton, Input, Modal, ModalDialog, Switch, Typography } from '@mui/joy'
import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined';
import { kundeErstellen } from '../../../Scripts/KundenDatenBank';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useNavigate } from 'react-router-dom';
function KundenEditor({ id, close }) {
    const [formData, setFormData] = React.useState({
        name: "",
        istfirma: false,
        street: "",
        number: "",
        plz: "",
        ort: "",
        landcode: "",
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
    }, []);
    const save = async () => {
        // Ensure the formData has a valid ID and convert it to a string
        let currentId = String(formData.id || id);
        const updatedData = { ...formData, id: currentId };

        // Save full customer data to file
        await handleSaveFile("kunden/" + currentId + ".person", JSON.stringify(updatedData));

        // Load and update the fast access database
        const string = await handleLoadFile("fast_accsess/kunden.db");
        const json = JSON.parse(string);
        console.log("ID!", currentId);
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
        console.log(JSON.stringify(json));
        json.list.push(item);

        await handleSaveFile("fast_accsess/kunden.db", JSON.stringify(json));

        close();
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
                            Kunde bearbeiten
                        </Typography>
                        <IconButton onClick={() => { close(); }} sx={{ mt: -1 }}>
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
                                <Input value={formData.street} onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        street: e.target.value,
                                    });
                                }} placeholder='z.B. Musterstraße' />
                            </FormControl>
                            <FormControl sx={{ width: "30%" }}>
                                <FormLabel sx={{ color: "gray" }}>Hausnummer</FormLabel>
                                <Input value={formData.number} onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        number: e.target.value,
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
                                <Input value={formData.ort} onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        ort: e.target.value,
                                    });
                                }} placeholder='z.B. Straubing' />
                            </FormControl>
                        </Box>
                        <FormControl>
                            <FormLabel sx={{ color: "gray" }}>Ländercode | ISO-Code</FormLabel>
                            <Input value={formData.landcode} onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    landcode: e.target.value,
                                });
                            }} placeholder='z.B. DE' />
                        </FormControl>
                        <FormControl>
                            <FormLabel sx={{ color: "gray" }}>Bundesland</FormLabel>
                            <Input value={formData.bundesland} onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    bundesland: e.target.value,
                                });
                            }} placeholder='z.B. Bayern' />
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
                            <>
                                <FormControl>
                                    <FormLabel sx={{ color: "gray" }}>Ansprechpartner | {"(freilassen falls nicht vorhanden)"}</FormLabel>
                                    <Input value={formData.ansprechpartner} onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            ansprechpartner: e.target.value,
                                        });
                                    }} placeholder='z.B. Mia Leitner' />
                                </FormControl>
                                <FormControl>
                                    <FormLabel sx={{ color: "gray" }}>Umsatzsteuer-Id | {"(Pflicht für X-Rechnung)"}</FormLabel>
                                    <Input value={formData.umstid} onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            umstid: e.target.value,
                                        });
                                    }} placeholder='z.B. Mia Leitner' />
                                </FormControl>
                            </>
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
                        <Button onClick={() => save()} startDecorator={<AddTaskOutlinedIcon />}>Speichern</Button>
                    </Box>
                </form>
            </ModalDialog>
        </Modal>
    )
}

export default KundenEditor
