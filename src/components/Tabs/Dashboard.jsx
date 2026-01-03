import { Box, Chip, Table, Typography, Sheet, Card, CardContent } from '@mui/joy'
import React, { useEffect, useState } from 'react'
import Headline from '../Headline'
import { get_uRechnungen, handleLoadFile } from '../../Scripts/Filehandler';
import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined';
import { useNavigate } from 'react-router-dom';
import { getNetto } from '../../Scripts/ERechnungInterpretter';
import EuroIcon from '@mui/icons-material/Euro';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

function Dashboard() {
    const [u_rechnungen, setURechnung] = useState();
    const [count, setCount] = useState(0);
    const [ges, setGes] = useState(0);
    const [monthUmsatz, setMonthUmsatz] = useState(0);
    const [yearUmsatz, setYearUmsatz] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        // Load invoices
        const fetchur = async () => {
            try {
                const data = await get_uRechnungen();
                setURechnung(data);
            } catch (e) { console.error(e); }
        };
        fetchur();

        // Load invoice count
        const fetchcount = async () => {
            try {
                const jsonstring = await handleLoadFile("fast_accsess/config.rechnix");
                const json = JSON.parse(jsonstring);
                setCount(json.count || 0);
            } catch (e) {
                console.error("Error loading config", e);
            }
        };
        fetchcount();

        // Helper to calculate Umsatz per invoice
        const get_Umsatz = async (item) => {
            try {
                const string = await handleLoadFile("rechnungen/" + item.name);
                const json = JSON.parse(string);
                return Number(getNetto(json)) || 0;
            } catch (e) {
                console.error("Error reading invoice file", item.name, e);
                return 0;
            }
        }

        // Calculate total, yearly, and monthly Umsatz
        const fetchGesammtUmsatz = async () => {
            try {
                const filedata = await window.api.listfiles("rechnungen/");
                if (!filedata) return;

                // Filter ensuring we only take actual invoices starting with "R"
                // Filename format: R2024-10-09-1 (Year-Month-Day-ID)
                const uniqueFiles = [...new Set(filedata)].filter(f => f.name && f.name.startsWith("R"));

                const currentYear = new Date().getFullYear();
                const currentMonth = new Date().getMonth() + 1; // 1-12

                let total = 0;
                let year = 0;
                let month = 0;

                // Process files in parallel
                /* 
                   We could optimize by only reading files matching the date in filename, 
                   but for Total we need all. 
                   We read all and sort results.
                */
                const updates = await Promise.all(uniqueFiles.map(async (file) => {
                    const amount = await get_Umsatz(file);

                    // Parse date from filename
                    // name: R2024-5-21-12
                    const parts = file.name.split("-");
                    if (parts.length >= 2) {
                        const fileYear = parseInt(parts[0].replace("R", ""));
                        const fileMonth = parseInt(parts[1]);

                        return { amount, fileYear, fileMonth };
                    }
                    return { amount, fileYear: 0, fileMonth: 0 };
                }));

                for (let u of updates) {
                    total += u.amount;
                    if (u.fileYear === currentYear) {
                        year += u.amount;
                        if (u.fileMonth === currentMonth) {
                            month += u.amount;
                        }
                    }
                }

                setGes(total.toFixed(2));
                setYearUmsatz(year.toFixed(2));
                setMonthUmsatz(month.toFixed(2));

            } catch (e) {
                console.error("Error calculating turnover", e);
            }
        }
        fetchGesammtUmsatz();

    }, []);

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
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                p: 0, // Request: "padding must be null"
                height: '100vh',
                overflowY: 'auto'
            }}
        >
            <Headline>Dashboard</Headline>

            <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 2,
                px: 2 // Keep some internal padding so cards don't touch edge of container/headline
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
                    mx: 2, // Add margin horizontal to avoid sticking to edges
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
                                        onClick={() => navigate("/kunden-viewer/" + item.id)}
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
    )
}

export default Dashboard;