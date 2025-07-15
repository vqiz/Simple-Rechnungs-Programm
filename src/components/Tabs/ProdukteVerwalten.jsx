import { Box, Card, Typography } from '@mui/joy'
import React from 'react'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';


const ProdukteVerwalten = () => {
    return (
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
            <Card variant='soft' sx={{ display: "flex", flexDirection: "row", alignItems: "center", padding: 2 }}>
                <Box sx={{height: "100%", fontSize: "1.5rem", display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <InfoOutlinedIcon />
                </Box>
                <Box sx={{display: "flex", flexDirection: "column", marginLeft: 2}}>
                    <Typography level="title-md">Information</Typography>
                    <Typography>Hier werden Produkte und Kategorien für die Schnellauswahl beim Erstellen der Rechnung konfiguriert</Typography>
                </Box>
            </Card>



        </Box>
    )
}

export default ProdukteVerwalten
