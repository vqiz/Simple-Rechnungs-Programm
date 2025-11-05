import { Box, Button, Input, Table } from '@mui/joy'
import React, { useState } from 'react'
import Headline from '../Headline'
import InfoCard from '../InfoCard'
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import LieferantenCreator from '../LieferantenVerwaltung/LieferantenCreator';
import MaskProvider from '../MaskProvider';
function LieferantenVerwaltung() {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [createLieferant, setCreateLieferant] = useState(false);
    return (
        <Box
            sx={{
                height: '100vh',
                maxHeight: "100vh",
                overflowY: 'auto',
                display: 'block',
                flexDirection: 'column',
                gap: 2,
                p: 0,
                position: 'relative',

            }}
        >
            {
                createLieferant && (
                    <MaskProvider>
                        <LieferantenCreator />
                    </MaskProvider>

                )
            }
            <Headline>Lieferanten Verwaltung</Headline>
            <Box sx={{ p: 2 }}>
                <InfoCard headline={"Information"}>Hier können Sie Ausgaben in Form von E-Rechnungen oder PDF-Dokumenten hinterlegen.</InfoCard>
            </Box>



            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, width: "50%" }}>
                    <Input
                        placeholder="Lieferant suchen..."
                        variant="outlined"
                        sx={{ flexGrow: 1, }}
                        onChange={(e) => setSearchTerm(e.target.value)}

                        startDecorator={<SearchIcon />}
                    />
                </Box>
                <Button onClick={() => setCreateLieferant(true)} startDecorator={<AddCircleOutlineOutlinedIcon />} sx={{ mt: -1.8 }}>Lieferant erstellen</Button>
            </Box>
            <Box
                sx={{
                    px: 2,
                    maxWidth: "100%",
                    mb: 5,
                    mx: "auto",
                    width: "100%"
                }}
            >
                <Table sx={{ borderRadius: "15px" }}>
                    <thead>
                        <tr>
                            <th>Lieferanten und Rechnungen</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </Table>
            </Box>
        </Box>
    )
}

export default LieferantenVerwaltung
