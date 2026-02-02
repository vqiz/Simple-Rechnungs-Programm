import {
    Box,
    Button,
    Divider,
    FormControl,
    FormLabel,
    Input,
    Typography,
    ModalDialog,
    Select,
    Option
} from '@mui/joy';
import React from 'react';

export default function CreateProduktMock() {
    const price = "99.99";
    const produktname = "Beratungsstunde";
    const mehrWertSteuer = 19;
    const selectedCategory = "Dienstleistungen";

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <ModalDialog
                variant="outlined"
                sx={{
                    borderRadius: "md",
                    width: "63vh",
                    maxWidth: "90vw",
                    position: 'static',
                    transform: 'none',
                }}
            >
                <form style={{ width: "100%" }}>
                    <Typography level='h3' mb={1}>
                        Produkt hinzufügen
                    </Typography>
                    <Divider />

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                        <FormControl>
                            <FormLabel>Kategorie</FormLabel>
                            <Select value={selectedCategory}>
                                <Option value="Dienstleistungen">Dienstleistungen</Option>
                                <Option value="Produkte">Produkte</Option>
                                <Option value="Software">Software</Option>
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Produktname {'(Zeitbasierte Produkte müssen "stunde" enthalten)'}</FormLabel>
                            <Input
                                placeholder="Bezeichnung..."
                                value={produktname}
                            />
                        </FormControl>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <FormControl sx={{ flex: 1 }}>
                                <FormLabel>Netto Betrag (€)</FormLabel>
                                <Input
                                    type='number'
                                    value={price}
                                    placeholder="0.00"
                                    slotProps={{ input: { step: "0.01" } }}
                                />
                            </FormControl>
                            <FormControl sx={{ flex: 1 }}>
                                <FormLabel>MwSt (%)</FormLabel>
                                <Select value={mehrWertSteuer}>
                                    <Option value={19}>19% (Standard)</Option>
                                    <Option value={7}>7% (Ermäßigt)</Option>
                                    <Option value={0}>0% (Steuerfrei)</Option>
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            width: "100%",
                            mt: 3,
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Button
                            variant='outlined'
                            color="neutral"
                        >
                            Abbrechen
                        </Button>

                        <Button
                            color="success"
                            variant='solid'
                        >
                            Hinzufügen
                        </Button>
                    </Box>
                </form>
            </ModalDialog>
        </div>
    );
}
