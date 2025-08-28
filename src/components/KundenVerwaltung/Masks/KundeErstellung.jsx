import { Box, Divider, FormControl, FormLabel, Input, Modal, ModalDialog, Switch, Typography } from '@mui/joy'
import React, { useState } from 'react'

function KundeErstellung() {
    function create() {

    }
    const [istfirma, setistfirma] = useState(false);
    return (
        <Modal open={true}>
            <ModalDialog
                variant='outlined'
                sx={{
                    borderRadius: "md",
                    width: "55vh",
                    maxWidth: "90vw",
                }}>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    create();
                }}>
                    <Typography level='h3' mb={1}>
                        Kunde erstellen
                    </Typography>
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
                            <Switch checked={istfirma} onChange={(e) => setistfirma(e.target.checked)} color="primary" />
                            <Typography variant="body1" color="text.secondary">
                                Firma
                            </Typography>
                        </Box>
                        <FormControl>
                            <FormLabel sx={{ color: "gray" }}>{istfirma ? "Firmenname" : "Vor und Nachname"}</FormLabel>
                            <Input placeholder='z.B. Max Mustermann' />
                        </FormControl>
                        <Box sx={{ display: "flex", flexDirection: "row", gap: 2, width: "100%" }}>
                            <FormControl sx={{ width: "70%" }}>
                                <FormLabel sx={{ color: "gray" }}>Straße</FormLabel>
                                <Input placeholder='z.B. Musterstraße' />
                            </FormControl>
                            <FormControl sx={{ width: "30%" }}>
                                <FormLabel sx={{ color: "gray" }}>Hausnummer</FormLabel>
                                <Input placeholder='z.B. 92' />
                            </FormControl>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "row", gap: 2, width: "100%" }}>
                            <FormControl>
                                <FormLabel sx={{ color: "gray" }}>PLZ</FormLabel>
                                <Input placeholder='z.B. 94315' type='Number'/>
                            </FormControl>
                            <FormControl sx={{width: "60%"}}>
                                <FormLabel sx={{ color: "gray" }}>Stadt | Ort</FormLabel>
                                <Input placeholder='z.B. Straubing' />
                            </FormControl>
                        </Box>
                        <FormControl>
                            <FormLabel sx={{color: "gray"}}>Ländercode | ISO-Code</FormLabel>
                            <Input placeholder='z.B. DE' />
                        </FormControl>
                        <FormControl>
                            <FormLabel sx={{color: "gray"}}>{istfirma ? "Email des Unternehmens" : "Email Adresse"}</FormLabel>
                            <Input placeholder={istfirma ? "z.B. info@testgmbh.de": "z.B. max.mustermann@gmail.com"}/>
                        </FormControl>
                        <FormControl>
                            <FormLabel sx={{color: "gray"}}>Telefonnummer</FormLabel>
                            <Input placeholder='z.B. +4915151136187'/>
                        </FormControl>
                    </Box>
                </form>
            </ModalDialog>
        </Modal>
    )
}

export default KundeErstellung
