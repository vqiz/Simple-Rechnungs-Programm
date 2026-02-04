
import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, Sheet, Chip, Button, Card } from '@mui/joy';
import Headline from '../Headline';
import InfoCard from '../InfoCard';
import { handleLoadFile } from '../../Scripts/Filehandler';
import NotificationImportantOutlinedIcon from '@mui/icons-material/NotificationImportantOutlined';
import SyncIcon from '@mui/icons-material/Sync';

function Mahnungen() {
    const [mahnungen, setMahnungen] = useState([]);
    const [stats, setStats] = useState({ count: 0, total: 0 });

    const loadMahnungen = async () => {
        try {
            const dbStr = await handleLoadFile("fast_accsess/mahnungen.db");
            if (!dbStr || dbStr === "{}") {
                setMahnungen([]);
                setStats({ count: 0, total: 0 });
                return;
            }
            const db = JSON.parse(dbStr);
            const list = db.list || [];

            // Sort by date desc
            list.sort((a, b) => b.date - a.date);
            setMahnungen(list);

            // Calculate Stats
            const total = list.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
            setStats({ count: list.length, total: total.toFixed(2) });

        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        loadMahnungen();
    }, []);

    return (
        <Box sx={{ p: 0, height: '100vh', overflowY: 'auto' }}>
            <Headline>Mahnungswesen</Headline>

            <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
                <Card sx={{ flex: 1, minWidth: 200, bgcolor: 'warning.50' }}>
                    <Typography level="title-md">Offene Mahnungen</Typography>
                    <Typography level="h2" color="warning">{stats.count}</Typography>
                    <Typography level="body-sm">Gesendete Mahnverfahren</Typography>
                </Card>
                <Card sx={{ flex: 1, minWidth: 200, bgcolor: 'danger.50' }}>
                    <Typography level="title-md">Forderungssumme</Typography>
                    <Typography level="h2" color="danger">{stats.total}€</Typography>
                    <Typography level="body-sm">Inklusive Mahngebühren</Typography>
                </Card>
            </Box>

            <Box sx={{ px: 2, pb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button startDecorator={<SyncIcon />} onClick={loadMahnungen} variant="soft">Aktualisieren</Button>
            </Box>

            <Box sx={{ px: 2, mb: 5 }}>
                <Sheet sx={{ borderRadius: 'sm', overflow: 'auto' }}>
                    <Table stickyHeader hoverRow>
                        <thead>
                            <tr>
                                <th>Datum</th>
                                <th>Rechnung</th>
                                <th>Kunde</th>
                                <th>Mahnstufe</th>
                                <th>Betrag</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mahnungen.map((m, i) => (
                                <tr key={i}>
                                    <td>{new Date(m.date).toLocaleDateString()}</td>
                                    <td>{m.rechnungId}</td>
                                    <td>{m.kundenName}</td>
                                    <td>
                                        <Chip color={m.level === 1 ? 'warning' : 'danger'} variant="soft">
                                            {m.level === 1 ? 'Erinnerung' : m.level + '. Mahnung'}
                                        </Chip>
                                    </td>
                                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{Number(m.amount).toFixed(2)}€</td>
                                </tr>
                            ))}
                            {mahnungen.length === 0 && (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>Keine Mahnungen gefunden</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Sheet>
            </Box>
        </Box>
    );
}

export default Mahnungen;
