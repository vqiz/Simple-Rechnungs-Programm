import { Accordion, AccordionDetails, accordionDetailsClasses, AccordionGroup, AccordionSummary, accordionSummaryClasses, Box, Button, Card, Table, Typography } from '@mui/joy'
import React, { useEffect, useState } from 'react'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CreateProduktKathegorie from '../Masks/CreateProduktKathegorie';
import { handleLoadFile, handleSaveFile } from '../../Scripts/Filehandler';
import KathAccordationDetail from '../Produktedit/KathAccordationDetail';
import DeleteConfirmation from '../Masks/DeleteConfirmation';
import CreateProdukt from '../Masks/CreateProdukt';


const ProdukteVerwalten = () => {


    const [kathpath, setkathpath] = useState("kathegories/kathegories.rechnix");
    const [create, setcreate] = useState(false);
    const [data, setdata] = useState();
    const [deleteconfirmation, setdeleteconfirmation] = useState(null);
    const [createProdukt, setcreateprodukt] = useState(null);
    async function readdata() {
        const jsonString = await handleLoadFile(kathpath);
        const json = JSON.parse(jsonString);
        setdata(json);
    }
    async function deleteKathegorie(name) {
        const jsonString = await handleLoadFile(kathpath);
        const json = JSON.parse(jsonString);
        json.list = json.list.filter((i) => i.name != name);
        await handleSaveFile(kathpath, JSON.stringify(json));
        setdeleteconfirmation(null);
        readdata();
    }

    useEffect(() => {
        readdata();
    }, []);

    return (
        <Box sx={{ height: "100vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: 2, p: 0, position: "relative" }}>
            {
                createProdukt != null && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "rgba(0, 0, 0, 0.5)",
                            zIndex: 10,
                        }}
                    >
                        <Box
                            sx={{
                                boxShadow: 3,
                                zIndex: 11,
                            }}
                        >
                            <CreateProdukt kathpath={kathpath} update={readdata} kathname={createProdukt.name} disable={setcreateprodukt} />
                        </Box>
                    </Box>
                )
            }
            {
                create && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "rgba(0, 0, 0, 0.5)",
                            zIndex: 10,
                        }}
                    >
                        <Box
                            sx={{
                                boxShadow: 3,
                                zIndex: 11,
                            }}
                        >
                            <CreateProduktKathegorie setcreate={setcreate} path={kathpath} update={readdata} />
                        </Box>
                    </Box>
                )
            }
            {
                deleteconfirmation != null && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "rgba(0, 0, 0, 0.5)",
                            zIndex: 10,
                        }}
                    >
                        <Box
                            sx={{
                                boxShadow: 3,
                                zIndex: 11,
                            }}
                        >
                            <DeleteConfirmation
                                title={"Kathegorie Löschen"}
                                confirmfunction={deleteKathegorie}
                                disable={setdeleteconfirmation}
                                buttontitle={"Löschen"}
                                description={"Sind sie sicher das die die Kathegorie " + deleteconfirmation.name + " mit allen Produkten löschen wollen ?"}
                                parameter={deleteconfirmation.name}
                            />
                        </Box>
                    </Box>
                )
            }
            <Box sx={{ width: "100%", height: "55px", bgcolor: "#ffffff", display: "flex", alignItems: "center", borderBottom: "1px solid #ddd" }}>
                <Typography sx={{ ml: "15px", fontSize: "1.25rem", fontWeight: 600, color: "#333" }}>
                    Produkte Verwalten
                </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", p: 2 }}>
                <Card variant='outlined' sx={{ display: "flex", flexDirection: "row", alignItems: "center", padding: 2, bgcolor: "#f9f9f9" }}>
                    <Box sx={{ height: "100%", fontSize: "1.5rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <InfoOutlinedIcon />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", marginLeft: 2 }}>
                        <Typography level="title-md" sx={{ fontWeight: 500, color: "#333" }}>Information</Typography>
                        <Typography sx={{ color: "#555", fontSize: "0.95rem" }}>
                            Hier werden Produkte und Kategorien für die Schnellauswahl beim Erstellen der Rechnung konfiguriert
                        </Typography>
                    </Box>
                </Card>
                <Box sx={{ justifyContent: "space-between", display: "flex", mt: 2 }}>
                    <Typography>Kathegorien</Typography>
                    <Button onClick={() => setcreate(true)}>
                        Kathegorie Erstellen
                    </Button>
                </Box>
                <AccordionGroup
                    variant="outlined"
                    size='lg'
                    transition="0.2s"
                    sx={(theme) => ({
                        mt: 2,

                        borderRadius: 'lg',
                        [`& .${accordionSummaryClasses.button}:hover`]: {
                            bgcolor: 'transparent',
                        },
                        [`& .${accordionDetailsClasses.content}`]: {
                            boxShadow: `inset 0 1px ${theme.vars.palette.divider}`,
                            [`&.${accordionDetailsClasses.expanded}`]: {
                                paddingBlock: '0.75rem',
                            },
                        },
                    })}>
                    {
                        data && data.list && data.list.map(item => {
                            return (
                                <Accordion>
                                    <AccordionSummary>{item.name}</AccordionSummary>
                                    <AccordionDetails>
                                        <KathAccordationDetail setcreatep={setcreateprodukt} item={item} path={kathpath} setconfirmation={setdeleteconfirmation} />
                                    </AccordionDetails>
                                </Accordion>
                            )

                        })
                    }
                </AccordionGroup>


            </Box>




        </Box>
    )
}

export default ProdukteVerwalten
