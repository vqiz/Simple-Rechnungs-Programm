import React, { useState } from 'react';
import { Box, Card, CardContent, Option, Select, Typography } from '@mui/joy';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import MockFrame from './MockFrame';
import Headline from './utils/Headline';
import InfoCard from './utils/InfoCard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import EuroIcon from '@mui/icons-material/Euro';

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

                <Box sx={{ px: 2, mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Select value={year} onChange={(e, val) => setYear(val)} sx={{ width: 120 }}>
                        <Option value="2024">2024</Option>
                        <Option value="2023">2023</Option>
                    </Select>
                </Box>

                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: 2,
                    px: 2,
                    mb: 4
                }}>
                    <StatCard
                        title="Gesamteinnahmen"
                        value="78.500€"
                        icon={<TrendingUpIcon fontSize="large" />}
                        color="success"
                    />
                    <StatCard
                        title="Gesamtausgaben"
                        value="44.600€"
                        icon={<TrendingDownIcon fontSize="large" />}
                        color="danger"
                    />
                    <StatCard
                        title="Gewinn (EÜR)"
                        value="33.900€"
                        icon={<EuroIcon fontSize="large" />}
                        color="primary"
                    />
                </Box>

                <Box sx={{ px: 2, height: 400, width: '100%', mb: 4 }}>
                    <Typography level="h4" mb={2}>Einnahmen vs. Ausgaben Verlauf</Typography>
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
                            <Bar dataKey="income" name="Einnahmen" fill="#2e7d32" />
                            <Bar dataKey="expense" name="Ausgaben" fill="#d32f2f" />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </Box>
        </MockFrame>
    );
}
