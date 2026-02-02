import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Select, Option, Button, Card, CardContent, Divider, Grid, Table, Modal, ModalDialog, ModalClose, Sheet } from '@mui/joy';
import Headline from '../Headline';
import InfoCard from '../InfoCard';
import { getFinancialData } from '../../Scripts/StatsHandler';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import html2pdf from 'html2pdf.js';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function Statistiken() {
    const [year, setYear] = useState(new Date().getFullYear());
    const [stats, setStats] = useState(null);
    const [selectedMonthDetails, setSelectedMonthDetails] = useState(null);
    const pdfRef = useRef();

    useEffect(() => {
        const fetch = async () => {
            const data = await getFinancialData(year);
            setStats(data);
        };
        fetch();
    }, [year]);

    const handleExportEUR = () => {
        if (!pdfRef.current) return;
        const element = pdfRef.current;
        const opt = {
            margin: 0,
            filename: `EÜR_${year}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };

    if (!stats) return <Box sx={{ p: 4 }}>Lade Statistiken...</Box>;

    const { chartData, summary, expensesList } = stats;

    // Prepare Pie Chart Data (Expenses by Category)
    const categoryData = {};
    expensesList.forEach(e => {
        const cat = e.category || "Sonstiges";
        categoryData[cat] = (categoryData[cat] || 0) + e.amount;
    });
    const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

    // Current Month Calculation
    const currentMonthIndex = new Date().getMonth();
    const isCurrentYear = year === new Date().getFullYear();
    const currentMonthStats = (isCurrentYear && chartData && chartData[currentMonthIndex]) ? chartData[currentMonthIndex] : null;
    const currentMonthName = new Date().toLocaleString('de-DE', { month: 'long' });

    return (
        <Box sx={{ height: '100vh', overflowY: "auto", pb: 10 }}>
            <Headline>Statistiken & Berichte</Headline>
            <Box sx={{ p: 2 }}>
                <InfoCard headline="Finanzübersicht">Analysieren Sie hier Ihre Einnahmen und Ausgaben und erstellen Sie Ihre EÜR.</InfoCard>
            </Box>

            <Box sx={{ px: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Select value={year} onChange={(e, val) => setYear(val)} sx={{ width: 150 }}>
                    <Option value={2024}>2024</Option>
                    <Option value={2025}>2025</Option>
                    <Option value={2026}>2026</Option>
                </Select>

                <Button startDecorator={<PictureAsPdfOutlinedIcon />} onClick={handleExportEUR}>
                    EÜR {year} Exportieren
                </Button>
            </Box>

            {/* Summary Cards */}
            <Box sx={{ display: 'flex', gap: 2, px: 2, mt: 3, flexWrap: 'wrap' }}>
                <Card sx={{ flex: 1, minWidth: 200, bgcolor: 'success.50' }}>
                    <Typography level="title-md">Einnahmen (Netto)</Typography>
                    <Typography level="h3" color="success">{summary.totalIncome?.toFixed(2)} €</Typography>
                </Card>
                <Card sx={{ flex: 1, minWidth: 200, bgcolor: 'danger.50' }}>
                    <Typography level="title-md">Ausgaben</Typography>
                    <Typography level="h3" color="danger">{summary.totalExpenses?.toFixed(2)} €</Typography>
                </Card>
                <Card sx={{ flex: 1, minWidth: 200, bgcolor: summary.profit >= 0 ? 'primary.50' : 'warning.50' }}>
                    <Typography level="title-md">Gewinn / Verlust</Typography>
                    <Typography level="h3" color={summary.profit >= 0 ? "primary" : "warning"}>{summary.profit?.toFixed(2)} €</Typography>
                </Card>
                <Card sx={{ flex: 1, minWidth: 200, bgcolor: 'neutral.50' }}>
                    <Typography level="title-md">USt. Eingenommen</Typography>
                    <Typography level="h3">{summary.totalTaxCollected?.toFixed(2)} €</Typography>
                </Card>
            </Box>

            {currentMonthStats && (
                <Box sx={{ mt: 4, px: 2 }}>
                    <Typography level="h4" mb={2}>Aktueller Monat ({currentMonthName})</Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Card sx={{ flex: 1, minWidth: 200, bgcolor: 'success.50' }}>
                            <Typography level="title-md">Einnahmen</Typography>
                            <Typography level="h3" color="success">{currentMonthStats.income?.toFixed(2)} €</Typography>
                        </Card>
                        <Card sx={{ flex: 1, minWidth: 200, bgcolor: 'danger.50' }}>
                            <Typography level="title-md">Ausgaben</Typography>
                            <Typography level="h3" color="danger">{currentMonthStats.expenses?.toFixed(2)} €</Typography>
                        </Card>
                        <Card sx={{ flex: 1, minWidth: 200, bgcolor: currentMonthStats.profit >= 0 ? 'primary.50' : 'warning.50' }}>
                            <Typography level="title-md">Gewinn / Verlust</Typography>
                            <Typography level="h3" color={currentMonthStats.profit >= 0 ? "primary" : "warning"}>{currentMonthStats.profit?.toFixed(2)} €</Typography>
                        </Card>
                    </Box>
                </Box>
            )}

            {/* Main Chart */}
            <Box sx={{ px: 2, mt: 4, height: 400 }}>
                <Typography level="h4" mb={2}>Jahresverlauf</Typography>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <RechartsTooltip />
                        <Legend />
                        <Bar
                            dataKey="income"
                            name="Einnahmen"
                            fill="#10b981"
                            onClick={(data) => {
                                setSelectedMonthDetails(data);
                            }}
                            style={{ cursor: 'pointer' }}
                        />
                        <Bar
                            dataKey="expenses"
                            name="Ausgaben"
                            fill="#ef4444"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </Box>

            {/* Detailed Month View Modal */}
            <Modal
                open={!!selectedMonthDetails}
                onClose={() => setSelectedMonthDetails(null)}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <ModalDialog sx={{ width: '600px', maxWidth: '90vw', maxHeight: '80vh', overflow: 'auto' }}>
                    <ModalClose />
                    <Typography level="h4" mb={2}>Details für {selectedMonthDetails?.name}</Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Typography level="title-md" mb={1}>Einnahmen ({selectedMonthDetails?.income?.toFixed(2)} €)</Typography>
                    {selectedMonthDetails?.invoices && selectedMonthDetails.invoices.length > 0 ? (
                        <Table hoverRow sx={{ '& thead th:nth-of-type(1)': { width: '40%' } }}>
                            <thead>
                                <tr>
                                    <th>Kunde</th>
                                    <th>Datum</th>
                                    <th style={{ textAlign: 'right' }}>Betrag (Netto)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedMonthDetails.invoices.map((inv) => (
                                    <tr key={inv.id}>
                                        <td>{inv.customerName}</td>
                                        <td>{new Date(inv.date).toLocaleDateString()}</td>
                                        <td style={{ textAlign: 'right' }}>{inv.netto?.toFixed(2)} €</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <Typography level="body-sm" color="neutral">Keine Einnahmen in diesem Monat.</Typography>
                    )}
                </ModalDialog>
            </Modal>

            {/* Category Chart */}
            <Box sx={{ px: 2, mt: 5, mb: 5, height: 350 }}>
                <Typography level="h4" mb={2}>Ausgaben nach Kategorie</Typography>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <RechartsTooltip />
                    </PieChart>
                </ResponsiveContainer>
            </Box>

            {/* Hidden PDF Container */}
            <Box sx={{ position: 'absolute', top: -10000, left: -10000 }}>
                <Box ref={pdfRef} sx={{ p: '20mm', width: '210mm', minHeight: '297mm', bgcolor: 'white', boxSizing: 'border-box' }}>
                    <Typography level="h2" mb={2}>Einnahmenüberschussrechnung {year}</Typography>
                    <Divider sx={{ mb: 4 }} />

                    <Typography level="h4" mb={2}>Zusammenfassung</Typography>
                    <Table sx={{ mb: 4 }}>
                        <tbody>
                            <tr>
                                <td><Typography fontWeight="bold">Gesamteinnahmen (Netto)</Typography></td>
                                <td style={{ textAlign: 'right' }}>{summary.totalIncome?.toFixed(2)} €</td>
                            </tr>
                            <tr>
                                <td><Typography fontWeight="bold">Gesamtausgaben</Typography></td>
                                <td style={{ textAlign: 'right' }}>{summary.totalExpenses?.toFixed(2)} €</td>
                            </tr>
                            <tr style={{ borderTop: '2px solid black' }}>
                                <td><Typography level="h4">Gewinn / Verlust</Typography></td>
                                <td style={{ textAlign: 'right' }}><Typography level="h4">{summary.profit?.toFixed(2)} €</Typography></td>
                            </tr>
                        </tbody>
                    </Table>

                    <Typography level="h4" mb={2} mt={4}>Monatliche Aufschlüsselung</Typography>
                    <Table>
                        <thead>
                            <tr>
                                <th>Monat</th>
                                <th style={{ textAlign: 'right' }}>Einnahmen</th>
                                <th style={{ textAlign: 'right' }}>Ausgaben</th>
                                <th style={{ textAlign: 'right' }}>Gewinn</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chartData && chartData.map((m, i) => (
                                <tr key={i}>
                                    <td>{m.name}</td>
                                    <td style={{ textAlign: 'right' }}>{m.income?.toFixed(2)} €</td>
                                    <td style={{ textAlign: 'right' }}>{m.expenses?.toFixed(2)} €</td>
                                    <td style={{ textAlign: 'right', color: m.profit >= 0 ? 'black' : 'red' }}>{m.profit?.toFixed(2)} €</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Box>
            </Box>
        </Box>
    );
}
