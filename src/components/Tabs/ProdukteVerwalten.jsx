import { Box, Card, Typography } from '@mui/joy'
import React from 'react'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';


const ProdukteVerwalten = () => {
    return (
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2, p: 0 }}>
            <Box sx={{ width: "100%", height: "55px", bgcolor: "#ffffff", display: "flex", alignItems: "center", borderBottom: "1px solid #ddd" }}>
                <Typography sx={{ ml: "15px", fontSize: "1.25rem", fontWeight: 600, color: "#333" }}>
                    Produkte Verwalten
                </Typography>
            </Box>
            <Box sx={{  display: "flex", flexDirection: "column" , justifyContent: "center", p: 2}}>
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

            </Box>




        </Box>
    )
}

export default ProdukteVerwalten
