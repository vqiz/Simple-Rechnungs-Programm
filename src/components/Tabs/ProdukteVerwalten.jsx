import { Accordion, AccordionDetails, accordionDetailsClasses, AccordionGroup, AccordionSummary, accordionSummaryClasses, Box, Button, Card, Typography } from '@mui/joy'
import React, { useState } from 'react'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CreateProduktKathegorie from '../Masks/CreateProduktKathegorie';


const ProdukteVerwalten = () => {



    const [create, setcreate] = useState(false);
    return (
        <Box sx={{ height: "100vh", overflowY: "auto",width: "100%", display: "flex", flexDirection: "column", gap: 2, p: 0, position: "relative" }}>
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
                      <CreateProduktKathegorie setcreate={setcreate} />
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
                    <Accordion>
                        <AccordionSummary>Test</AccordionSummary>
                        <AccordionDetails>Test</AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary>Test</AccordionSummary>
                        <AccordionDetails>Test</AccordionDetails>
                    </Accordion>
                </AccordionGroup>


            </Box>




        </Box>
    )
}

export default ProdukteVerwalten
