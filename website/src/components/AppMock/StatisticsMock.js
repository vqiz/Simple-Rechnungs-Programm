import React, { useState } from 'react';
import { Box, Card, CardContent, Option, Select, Typography, Button } from '@mui/joy';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import MockFrame from './MockFrame';
import Headline from './utils/Headline';
import InfoCard from './utils/InfoCard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import EuroIcon from '@mui/icons-material/Euro';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';

export default function StatisticsMock() {
    const [dataset] = useState([
        { label: 'Jan', income: 5000, expense: 3200 },
        { label: 'Feb', income: 4500, expense: 2800 },
        { label: 'Mär', income: 6000, expense: 4100 },
        { label: 'Apr', income: 7200, expense: 3500 },
        { label: 'Mai', income: 5800, expense: 2900 },
        { label: 'Jun', income: 6500, expense: 3800 },
        { label: 'Jul', income: 7000, expense: 4200 },
        { label: 'Aug', income: 5200, expense: 3000 },
        { label: 'Sep', income: 6800, expense: 3600 },
        { label: 'Okt', income: 7500, expense: 4000 },
        { label: 'Nov', income: 8000, expense: 4500 },
        { label: 'Dez', income: 9000, expense: 5000 },
    ]);
    const [year, setYear] = useState('2024');

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
        <MockFrame activePage="Statistiken">
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                <Headline>Statistiken & Auswertungen</Headline>

                <Box sx={{ p: 2 }}>
                    <InfoCard headline="Finanzüberblick">
                        Hier sehen Sie eine detaillierte Auswertung Ihrer Einnahmen und Ausgaben.
                    </InfoCard>
                </Box>

                <Box sx={{ px: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Select value={year} onChange={(e, val) => setYear(val)} sx={{ width: 120 }}>
                        <Option value="2024">2024</Option>
                        <Option value="2023">2023</Option>
                    </Select>
                    <Button startDecorator={<PictureAsPdfOutlinedIcon />} variant="solid" color="primary">
                        EÜR {year} Exportieren
                    </Button>
                </Box>

                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 2,
                    px: 2,
                    mb: 4
                }}>
                    <StatCard
                        title="Einnahmen (Gesamt)"
                        value="78.500,00 €"
                        icon={<TrendingUpIcon fontSize="large" />}
                        color="success"
                    />
                    <StatCard
                        title="Ausgaben"
                        value="44.600,00 €"
                        icon={<TrendingDownIcon fontSize="large" />}
                        color="danger"
                    />
                    <StatCard
                        title="Gewinn / Verlust"
                        value="33.900,00 €"
                        icon={<EuroIcon fontSize="large" />}
                        color="primary"
                    />
                    <StatCard
                        title="USt. Eingenommen"
                        value="14.915,00 €"
                        icon={<EuroIcon fontSize="large" />}
                        color="neutral"
                    />
                </Box>

                <Box sx={{ px: 2, mb: 4 }}>
                    <Typography level="h4" mb={2} pl={2}>Zahlungsstatus</Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', px: 2 }}>
                        <Card sx={{ flex: 1, minWidth: 200 }}>
                            <Typography level="title-md">Bezahlt</Typography>
                            <Typography level="h3" color="success">65.000,00 €</Typography>
                        </Card>
                        <Card sx={{ flex: 1, minWidth: 200 }}>
                            <Typography level="title-md">Ausstehend</Typography>
                            <Typography level="h3" color="neutral">8.500,00 €</Typography>
                        </Card>
                        <Card sx={{ flex: 1, minWidth: 200 }}>
                            <Typography level="title-md">Überfällig</Typography>
                            <Typography level="h3" color="danger">5.000,00 €</Typography>
                        </Card>
                    </Box>
                </Box>

                <Box sx={{ px: 2, mb: 4 }}>
                    <Typography level="h4" mb={2} pl={2}>Aktueller Monat (November)</Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', px: 2 }}>
                        <Card sx={{ flex: 1, minWidth: 200, bgcolor: 'success.50' }}>
                            <Typography level="title-md">Einnahmen</Typography>
                            <Typography level="h3" color="success">8.000,00 €</Typography>
                        </Card>
                        <Card sx={{ flex: 1, minWidth: 200, bgcolor: 'danger.50' }}>
                            <Typography level="title-md">Ausgaben</Typography>
                            <Typography level="h3" color="danger">4.500,00 €</Typography>
                        </Card>
                    </Box>
                </Box>

                <Box sx={{ px: 2, height: 400, width: '100%', mb: 4 }}>
                    <Typography level="h4" mb={2}>Jahresverlauf</Typography>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={dataset}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="label" />
                            <YAxis />
                            <RechartsTooltip formatter={(value) => `${value}€`} />
                            <Legend />
                            <Bar dataKey="income" name="Einnahmen" fill="#10b981" />
                            <Bar dataKey="expense" name="Ausgaben" fill="#ef4444" />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>

                <Box sx={{ px: 2, height: 350, width: '100%', mb: 4 }}>
                    <Typography level="h4" mb={2}>Ausgaben nach Kategorie</Typography>
                    {/* Placeholder for PieChart or actual PieChart if imports allow, keeping it simple as Mock typically just needs to LOOK like it. 
                         But user asked for 'example verlauf', likely meant the charts. Adding PieChart mock. */}
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={[
                                    { name: 'Büro', value: 400 },
                                    { name: 'Software', value: 300 },
                                    { name: 'Hardware', value: 300 },
                                    { name: 'Reise', value: 200 }
                                ]}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label
                            >
                                <Cell fill="#0088FE" />
                                <Cell fill="#00C49F" />
                                <Cell fill="#FFBB28" />
                                <Cell fill="#FF8042" />
                            </Pie>
                            <Legend />
                            <RechartsTooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Box>
            </Box>
        </MockFrame>
    );
}
