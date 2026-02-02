import React from 'react';
import MockFrame from './MockFrame';
import { Box, Typography, Button, Table, Chip, IconButton } from '@mui/joy';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

const products = [
    { name: 'Webdesign Basic', category: 'Dienstleistung', price: 1500, tax: 19 },
    { name: 'Hosting Paket S', category: 'Server', price: 9.99, tax: 19 },
    { name: 'Wartungsvertrag', category: 'Service', price: 50, tax: 19 },
    { name: 'Logo Design', category: 'Design', price: 450, tax: 19 },
];

export default function ProductsMock() {
    return (
        <MockFrame activePage="Produkte">
            <Box sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography level="h2">Produkte verwalten</Typography>
                    <Button startDecorator={<AddCircleOutlineOutlinedIcon />}>Produkt erstellen</Button>
                </Box>

                <Table hoverRow>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Kategorie</th>
                            <th>Preis (Netto)</th>
                            <th>Steuer</th>
                            <th style={{ width: 100 }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.name}>
                                <td><Typography fontWeight="lg">{p.name}</Typography></td>
                                <td><Chip size="sm" variant="soft">{p.category}</Chip></td>
                                <td>{p.price.toFixed(2)} €</td>
                                <td>{p.tax}%</td>
                                <td>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <IconButton size="sm" variant="plain"><EditOutlinedIcon /></IconButton>
                                        <IconButton size="sm" variant="plain" color="danger"><DeleteOutlineOutlinedIcon /></IconButton>
                                    </Box>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Box>
        </MockFrame>
    );
}
