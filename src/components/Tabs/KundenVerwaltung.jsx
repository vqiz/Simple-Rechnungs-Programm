import { Box, Button, Input, Table } from '@mui/joy'
import React, { useState } from 'react'
import Headline from '../Headline'
import InfoCard from '../InfoCard'
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import MaskProvider from '../MaskProvider';
import KundeErstellung from '../KundenVerwaltung/Masks/KundeErstellung';
function KundenVerwaltung() {
    const [createkunde,setcreatekunde] = useState(false);
    function close() {
        setcreatekunde(false);
    }
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                p: 0,
                position: 'relative'
            }}
        >
            <Headline>Kundenverwaltung</Headline>
            <Box sx={{ p: 2 }}>
                <InfoCard headline={"Information"}>In der Kundenverwaltung können sie nach Kunden und Rechnungsnummern suchen um vorgänge nachvollziehen zu können und alte rechnungen wieder zu finden.</InfoCard>
            </Box>

            {
                createkunde && (
                    <MaskProvider>
                        <KundeErstellung submit={close}/>
                    </MaskProvider>
                )
            }




            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, width: "50%" }}>
                    <Input
                        placeholder="Kunden oder Rechnungsnummer suchen..."
                        variant="outlined"
                        sx={{ flexGrow: 1, }}
                        startDecorator={<SearchIcon />}
                    />
                </Box>
                <Button onClick={() => setcreatekunde(true)} startDecorator={<AddCircleOutlineOutlinedIcon/>} sx={{mt: -1.8}}>Kunde erstellen</Button>
            </Box>
            <Box sx={{ px: 2, maxWidth: "126vh" }}>
                <Table sx={{borderRadius: "15px"}}>
                    <thead>
                        <tr>
                            <th>Kunden und Rechnungen</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Max Mustermann</td>
                            <td>INV-001</td>
                            <td>14.08.2025</td>
                        </tr>
                        <tr>
                            <td>Erika Musterfrau</td>
                            <td>INV-002</td>
                            <td>15.08.2025</td>
                        </tr>
                    </tbody>
                </Table>
            </Box>
        </Box>
    )
}

export default KundenVerwaltung
