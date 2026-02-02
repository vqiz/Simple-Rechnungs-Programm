import React from 'react';
import MockFrame from './MockFrame';
import { Box, Typography, Button, Table, Chip } from '@mui/joy';
import AddIcon from '@mui/icons-material/Add';

const expenses = [
    { title: 'Adobe Creative Cloud', category: 'Software', date: '01.03.2024', amount: 65, cycle: 'Monatlich' },
    { title: 'Büromiete', category: 'Miete', date: '01.03.2024', amount: 850, cycle: 'Monatlich' },
    { title: 'Server Hosting', category: 'Infrastruktur', date: '15.03.2024', amount: 120, cycle: '-' },
];

export default function ExpensesMock() {
    return (
        <MockFrame activePage="Ausgaben">
            <Box sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography level="h2">Ausgaben</Typography>
                    <Button startDecorator={<AddIcon />}>Ausgabe hinzufügen</Button>
                </Box>

                <Table hoverRow>
                    <thead>
                        <tr>
                            <th>Titel</th>
                            <th>Kategorie</th>
                            <th>Datum</th>
                            <th>Intervall</th>
                            <th style={{ textAlign: 'right' }}>Betrag</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map((ex, i) => (
                            <tr key={i}>
                                <td><Typography fontWeight="lg">{ex.title}</Typography></td>
                                <td><Chip size="sm" variant="soft">{ex.category}</Chip></td>
                                <td>{ex.date}</td>
                                <td>{ex.cycle}</td>
                                <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{ex.amount.toFixed(2)} €</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Box>
        </MockFrame>
    );
}
