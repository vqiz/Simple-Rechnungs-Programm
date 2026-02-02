import { Box, Button, Chip, Input, Table } from '@mui/joy'
import React, { useState } from 'react'
import MockFrame from './MockFrame';
import Headline from './utils/Headline';
import InfoCard from './utils/InfoCard';
import AvatarTabeUtil from './utils/AvatarTabeUtil';
import MaskProvider from './utils/MaskProvider';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import SyncIcon from '@mui/icons-material/Sync';

export default function CustomersMock() {
    const [createkunde, setcreatekunde] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Static Data
    const [data] = useState({
        list: [
            { id: "1001", name: "Max Mustermann", email: "max@example.com", istfirma: false },
            { id: "1002", name: "Beispiel GmbH", email: "info@beispiel.de", istfirma: true },
            { id: "1003", name: "Erika Musterfrau", email: "erika@test.com", istfirma: false }
        ]
    });

    const filteredList = data.list.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <MockFrame activePage="Kunden">
            <Box
                sx={{
                    height: '100%',
                    display: 'block',
                    flexDirection: 'column',
                    gap: 2,
                    p: 0,
                    position: 'relative',
                    overflowY: "auto",
                }}
            >
                <Headline>Kundenverwaltung</Headline>
                <Box sx={{ p: 2 }}>
                    <InfoCard headline={"Information"}>In der Kundenverwaltung können sie nach Kunden suchen um vorgänge nachvollziehen zu können.</InfoCard>
                </Box>

                {
                    createkunde && (
                        <MaskProvider>
                            <Box sx={{ bgcolor: 'background.surface', p: 4, borderRadius: 'md', boxShadow: 'lg' }}>
                                {/* Simplified Mask Content */}
                                <h3>Kunde erstellen (Mock)</h3>
                                <Button onClick={() => setcreatekunde(false)}>Schließen</Button>
                            </Box>
                        </MaskProvider>
                    )
                }

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, width: "50%" }}>
                        <Input
                            placeholder="Kunden suchen..."
                            variant="outlined"
                            sx={{ flexGrow: 1, }}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            startDecorator={<SearchIcon />}
                        />
                    </Box>
                    <Button onClick={() => setcreatekunde(true)} startDecorator={<AddCircleOutlineOutlinedIcon />} sx={{ mt: -1.8 }}>Kunde erstellen</Button>
                    <Button startDecorator={<SyncIcon />} sx={{ mt: -1.8 }} variant="soft">Index Neu laden</Button>
                </Box>
                <Box
                    sx={{
                        px: 2,
                        maxWidth: "100%",
                        mb: 5,
                        mx: "auto",
                        width: "100%",
                    }}
                >
                    <Table sx={{ borderRadius: "15px", maxWidth: "98%" }}>
                        <thead>
                            <tr>
                                <th>Kunden und Rechnungen</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filteredList.map((item) => {
                                    return (
                                        <Box
                                            component="tr"
                                            key={item.id}
                                            sx={{
                                                transition: 'background-color 0.2s',
                                                '&:hover': {
                                                    bgcolor: 'neutral.plainHoverBg',
                                                },
                                                cursor: "pointer"
                                            }}
                                        >
                                            <AvatarTabeUtil email={item.email} name={item.name} istfirma={item.istfirma} />
                                            <Box component="td" sx={{ padding: '12px 16px' }}>
                                                {
                                                    item.istfirma ? (
                                                        <Chip>Unternehmen</Chip>
                                                    ) : (
                                                        <Chip>PrivatKunde</Chip>
                                                    )
                                                }
                                            </Box>
                                        </Box>
                                    );
                                })
                            }
                        </tbody>
                    </Table>
                </Box>
            </Box>
        </MockFrame>
    )
}
