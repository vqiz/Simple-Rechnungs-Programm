
import React, { useState } from 'react';
import { Box, Typography, Table, Sheet, Chip, Button, Card } from '@mui/joy';
import MockFrame from './MockFrame';
import Headline from './utils/Headline';
import InfoCard from './utils/InfoCard';
import SyncIcon from '@mui/icons-material/Sync';
import NotificationImportantOutlinedIcon from '@mui/icons-material/NotificationImportantOutlined';

export default function MahnungenMock() {
    const mockMahnungen = [
        { date: Date.now() - 86400000 * 2, rechnungId: "R2024-10-15-2", kundenName: "Beispiel GmbH", level: 2, amount: 255.50 },
        { date: Date.now() - 86400000 * 5, rechnungId: "R2024-10-12-1", kundenName: "Max Mustermann", level: 1, amount: 120.00 },
        { date: Date.now() - 86400000 * 10, rechnungId: "R2024-09-28-5", kundenName: "Kunde XY", level: 3, amount: 850.00 }
    ];

    const stats = {
        count: mockMahnungen.length,
        total: mockMahnungen.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)
    };

    return (
        <MockFrame activePage="Mahnwesen">
            <Box sx={{ p: 0, height: '100%', overflowY: 'auto' }}>
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
                    <Button startDecorator={<SyncIcon />} variant="soft">Aktualisieren</Button>
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
                                {mockMahnungen.map((m, i) => (
                                    <tr key={i}>
                                        <td>{new Date(m.date).toLocaleDateString()}</td>
                                        <td>{m.rechnungId}</td>
                                        <td>{m.kundenName}</td>
                                        <td>
                                            <Chip color={m.level === 1 ? 'warning' : 'danger'} variant="soft">
                                                {m.level === 1 ? 'Erinnerung' : m.level + '. Mahnung'}
                                            </Chip>
                                        </td>
                                        <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{m.amount.toFixed(2)}€</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Sheet>
                </Box>
            </Box>
        </MockFrame>
    );
}
