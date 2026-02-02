import { Box, Chip, Table, Typography, Sheet, Card, CardContent } from '@mui/joy'
import React, { useState } from 'react'
import MockFrame from './MockFrame';
import Headline from './utils/Headline';
import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined';
import EuroIcon from '@mui/icons-material/Euro';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function DashboardMock() {
    // Static data mocking the useEffect logic
    const [u_rechnungen] = useState({
        list: [
            { rechnung: "R2024-10-09-1", id: "1" },
            { rechnung: "R2024-10-10-2", id: "2" },
            { rechnung: "R2024-10-12-3", id: "3" }
        ]
    });
    const [count] = useState(14);
    const [ges] = useState("4520.50");
    const [monthUmsatz] = useState("1250.00");
    const [yearUmsatz] = useState("34200.00");

    // Copied StatCard from Dashboard.jsx
    const StatCard = ({ title, value, icon, color = 'primary' }) => (
        <Card variant="soft" color={color} sx={{ flexGrow: 1, boxShadow: 'sm' }}>
            <CardContent orientation="horizontal">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        width: '3rem',
                        height: '3rem',
                        bgcolor: 'background.level1',
                        color: `${color}.plainColor`
                    }}>
                        {icon}
                    </Box>
                    <Box>
                        <Typography level="body-sm">{title}</Typography>
                        <Typography level="h3">{value}</Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <MockFrame activePage="Dashboard">
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    p: 0,
                    height: '100%', // Changed from 100vh to 100% for mock
                    overflowY: 'auto'
                }}
            >
                <Headline>Dashboard</Headline>

                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: 2,
                    px: 2
                }}>
                    <StatCard
                        title="Gesamter Umsatz"
                        value={`${ges}€`}
                        icon={<EuroIcon fontSize="large" />}
                        color="success"
                    />
                    <StatCard
                        title="Jahresumsatz"
                        value={`${yearUmsatz}€`}
                        icon={<TrendingUpIcon fontSize="large" />}
                        color="warning"
                    />
                    <StatCard
                        title="Monatlicher Umsatz"
                        value={`${monthUmsatz}€`}
                        icon={<CalendarTodayIcon fontSize="large" />}
                        color="neutral"
                    />
                    <StatCard
                        title="Anzahl Rechnungen"
                        value={count}
                        icon={<ReceiptLongIcon fontSize="large" />}
                        color="primary"
                    />
                </Box>

                <Sheet
                    variant="outlined"
                    sx={{
                        borderRadius: 'md',
                        p: 2,
                        mx: 2,
                        boxShadow: 'sm',
                        bgcolor: 'background.surface',
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <Typography level="h4" mb={2}>Unbezahlte Rechnungen</Typography>
                    <Box sx={{ overflowX: 'auto', flexGrow: 1 }}>
                        <Table stickyHeader hoverRow>
                            <thead>
                                <tr>
                                    <th style={{ width: '70%' }}>R-Nummer</th>
                                    <th style={{ width: '30%' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {u_rechnungen?.list && u_rechnungen.list.length > 0 ? (
                                    u_rechnungen.list.map((item) => (
                                        <tr
                                            key={item.rechnung}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <td>
                                                <Typography level="body-md">{item.rechnung}</Typography>
                                            </td>
                                            <td>
                                                <Chip
                                                    variant="soft"
                                                    color="danger"
                                                    startDecorator={<FiberManualRecordOutlinedIcon />}
                                                    size="sm"
                                                >
                                                    Unbezahlt
                                                </Chip>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={2}>
                                            <Typography level="body-sm" sx={{ textAlign: 'center', py: 2, color: 'text.tertiary' }}>
                                                Keine unbezahlten Rechnungen
                                            </Typography>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Box>
                </Sheet>
            </Box>
        </MockFrame>
    )
}
