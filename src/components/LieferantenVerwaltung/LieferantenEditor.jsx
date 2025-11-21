import { Box, Button, Divider, FormControl, FormLabel, IconButton, Input, Modal, ModalDialog, Typography } from '@mui/joy'
import React, { useEffect } from 'react'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { handleLoadFile, handleSaveFile } from '../../Scripts/Filehandler';

function LieferantenEditor({ close, id }) {
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
    useEffect(() => {
        const fetch = async () => {
            const phrased = await handleLoadFile("lieferanten/" + id);
            const json = JSON.parse(phrased);
            setFormData(json);
        }
        fetch();
    }, []);
    const submit = async () => {
        await handleSaveFile("lieferanten/" + id, JSON.stringify(formData));
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
                            Lieferant bearbeiten
                        </Typography>
                        <IconButton onClick={() => { close(); }} sx={{ mt: -1 }}>
                            <CloseOutlinedIcon />
                        </IconButton>
                    </Box>
                    <Divider />

                    <FormControl sx={{ mt: 2 }}>
                        <FormLabel sx={{ color: "gray" }}>{"Vor und Nachname"}</FormLabel>
                        <Input value={formData.name} onChange={(e) => {
                            setFormData({
                                ...formData,
                                name: e.target.value,
                            });
                        }} placeholder='z.B. Mustermann GMBH' required />
                    </FormControl>
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 2, width: "100%", mt: 1 }}>
                        <FormControl sx={{ width: "70%" }}>
                            <FormLabel sx={{ color: "gray" }}>Straße</FormLabel>
                            <Input value={formData.straße} onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    straße: e.target.value,
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

                    <Box sx={{ display: "flex", flexDirection: "row", gap: 2, width: "100%", mt: 1 }}>
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
                            <Input value={formData.city} onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    city: e.target.value,
                                });
                            }} placeholder='z.B. Straubing' />
                        </FormControl>
                    </Box>
                    <FormControl sx={{ mt: 1 }}>
                        <FormLabel sx={{ color: "gray" }}>{"Ansprechpartner"}</FormLabel>
                        <Input value={formData.ansprechpartner} onChange={(e) => {
                            setFormData({
                                ...formData,
                                ansprechpartner: e.target.value,
                            });
                        }} placeholder='z.B. Max Mustermann' required />
                    </FormControl>
                    <FormControl sx={{ mt: 1 }}>
                        <FormLabel sx={{ color: "gray" }}>{"Email"}</FormLabel>
                        <Input value={formData.email} onChange={(e) => {
                            setFormData({
                                ...formData,
                                email: e.target.value,
                            });
                        }} placeholder='z.B. test@test.gmbh.com' required />
                    </FormControl>
                    <FormControl sx={{ mt: 1 }}>
                        <FormLabel sx={{ color: "gray" }}>{"Telefon"}</FormLabel>
                        <Input value={formData.tel} onChange={(e) => {
                            setFormData({
                                ...formData,
                                tel: e.target.value,
                            });
                        }} placeholder='z.B. +4915151136187' required />
                    </FormControl>
                    <Button onClick={() => submit()} sx={{ mt: 2, width: "100%" }}>Speichern</Button>
                </form>
            </ModalDialog>
        </Modal>
    )
}

export default LieferantenEditor
