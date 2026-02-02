import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Input, Table, IconButton, Chip, Dropdown, Menu, MenuButton, MenuItem, ListItemDecorator } from '@mui/joy';
import Headline from '../Headline';
import InfoCard from '../InfoCard';
import { handleLoadFile, handleSaveFile } from '../../Scripts/Filehandler';
import MaskProvider from '../MaskProvider';
import CreateProdukt from '../Produktedit/Masks/CreateProdukt';
import CreateProduktKathegorie from '../Produktedit/Masks/CreateProduktKathegorie';
import DeleteConfirmation from '../Produktedit/Masks/DeleteConfirmation';
import SingleLineinput from '../Produktedit/Masks/SingleLineinput';

import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EuroSymbolOutlinedIcon from '@mui/icons-material/EuroSymbolOutlined';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const KATH_PATH = 'kathegories/kathegories.rechnix';

export default function ProdukteVerwalten() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Modals
    const [isCreateProductStart, setIsCreateProductStart] = useState(false);
    const [isCreateCategoryStart, setIsCreateCategoryStart] = useState(false);

    // Edit / Delete States
    const [deleteProductConfirm, setDeleteProductConfirm] = useState(null); // { product, categoryName }
    const [editField, setEditField] = useState(null); // { product, categoryName, field: 'name'|'price'|'steuer', value }

    const fetchData = async () => {
        try {
            const jsonString = await handleLoadFile(KATH_PATH);
            const json = JSON.parse(jsonString);
            const list = json.list || [];

            setCategories(list);

            // Flatten products
            const allProducts = [];
            list.forEach(cat => {
                if (cat.content) {
                    cat.content.forEach(prod => {
                        allProducts.push({
                            ...prod,
                            categoryName: cat.name
                        });
                    });
                }
            });
            setProducts(allProducts);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteProduct = async () => {
        if (!deleteProductConfirm) return;
        const { product, categoryName } = deleteProductConfirm;

        const jsonString = await handleLoadFile(KATH_PATH);
        const json = JSON.parse(jsonString);

        const cat = json.list.find(c => c.name === categoryName);
        if (cat) {
            cat.content = cat.content.filter(p => p.name !== product.name);
            await handleSaveFile(KATH_PATH, JSON.stringify(json));
            setDeleteProductConfirm(null);
            fetchData();
        }
    };

    const handleEditProduct = async (val) => {
        if (!editField) return;
        const { product, categoryName, field } = editField;

        const jsonString = await handleLoadFile(KATH_PATH);
        const json = JSON.parse(jsonString);

        const cat = json.list.find(c => c.name === categoryName);
        if (cat) {
            const prod = cat.content.find(p => p.name === product.name);
            if (prod) {
                prod[field] = val; // value comes from SingleLineinput
                await handleSaveFile(KATH_PATH, JSON.stringify(json));
                setEditField(null);
                fetchData();
            }
        }
    };

    const filteredProducts = products.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ height: '100vh', overflowY: "auto", display: 'flex', flexDirection: 'column', pb: 5 }}>
            <Headline>Produkte Verwalten</Headline>
            <Box sx={{ p: 2 }}>
                <InfoCard headline="Inventar">Konfigurieren Sie hier Ihre Produkte und Dienstleistungen für die Rechnungserstellung.</InfoCard>
            </Box>

            <Box sx={{ px: 2, pb: 2, display: 'flex', gap: 2, justifyContent: 'space-between', alignItems: 'center' }}>
                <Input
                    startDecorator={<SearchIcon />}
                    placeholder="Suchen..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    sx={{ width: '300px' }}
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="outlined" onClick={() => setIsCreateCategoryStart(true)}>Kategorie erstellen</Button>
                    <Button startDecorator={<AddCircleOutlineOutlinedIcon />} onClick={() => setIsCreateProductStart(true)}>Produkt erstellen</Button>
                </Box>
            </Box>

            <Box sx={{ px: 2 }}>
                <Table hoverRow sx={{ borderRadius: "15px", bgcolor: 'background.surface' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '30%' }}>Produktname</th>
                            <th style={{ width: '20%' }}>Kategorie</th>
                            <th style={{ width: '15%', textAlign: 'right' }}>Netto (€)</th>
                            <th style={{ width: '15%', textAlign: 'right' }}>Steuer (%)</th>
                            <th style={{ width: '10%', textAlign: 'right' }}>Aktionen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((p, idx) => (
                            <tr key={`${p.categoryName}-${p.name}-${idx}`}>
                                <td><Typography fontWeight="bold">{p.name}</Typography></td>
                                <td><Chip size="sm" variant="soft">{p.categoryName}</Chip></td>
                                <td style={{ textAlign: 'right' }}>{parseFloat(p.price).toFixed(2)} €</td>
                                <td style={{ textAlign: 'right' }}>{p.steuer} %</td>
                                <td style={{ textAlign: 'right' }}>
                                    <Dropdown>
                                        <MenuButton slots={{ root: IconButton }} slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}>
                                            <MoreVertIcon />
                                        </MenuButton>
                                        <Menu placement="bottom-end">
                                            <MenuItem onClick={() => setEditField({ product: p, categoryName: p.categoryName, field: 'name', value: p.name })}>
                                                <ListItemDecorator><EditOutlinedIcon /></ListItemDecorator> Titel bearbeiten
                                            </MenuItem>
                                            <MenuItem onClick={() => setEditField({ product: p, categoryName: p.categoryName, field: 'price', value: p.price })}>
                                                <ListItemDecorator><EuroSymbolOutlinedIcon /></ListItemDecorator> Preis bearbeiten
                                            </MenuItem>
                                            <MenuItem onClick={() => setEditField({ product: p, categoryName: p.categoryName, field: 'steuer', value: p.steuer })}>
                                                <ListItemDecorator><AccountBalanceIcon /></ListItemDecorator> Steuer bearbeiten
                                            </MenuItem>
                                            <MenuItem color="danger" onClick={() => setDeleteProductConfirm({ product: p, categoryName: p.categoryName })}>
                                                <ListItemDecorator><DeleteOutlineOutlinedIcon /></ListItemDecorator> Löschen
                                            </MenuItem>
                                        </Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Box>

            {/* Create Product Modal */}
            {isCreateProductStart && (
                <MaskProvider>
                    <CreateProdukt
                        kathpath={KATH_PATH}
                        disable={setIsCreateProductStart}
                        update={fetchData}
                    />
                </MaskProvider>
            )}

            {/* Create Category Modal */}
            {isCreateCategoryStart && (
                <MaskProvider>
                    <CreateProduktKathegorie
                        path={KATH_PATH}
                        setcreate={setIsCreateCategoryStart}
                        update={fetchData}
                    />
                </MaskProvider>
            )}

            {/* Edit Field Modal */}
            {editField && (
                <MaskProvider>
                    <SingleLineinput
                        title={editField.field === 'name' ? "Titel bearbeiten" : editField.field === 'price' ? "Preis bearbeiten" : "Steuer bearbeiten"}
                        val={editField.value}
                        inputtype={editField.field === 'name' ? "text" : "number"}
                        onClose={() => setEditField(null)}
                        onSave={handleEditProduct}
                    />
                </MaskProvider>
            )}

            {/* Delete Confirmation */}
            {deleteProductConfirm && (
                <MaskProvider>
                    <DeleteConfirmation
                        title="Produkt löschen"
                        description={`Möchten Sie das Produkt "${deleteProductConfirm.product.name}" wirklich löschen?`}
                        buttontitle="Löschen"
                        confirmfunction={handleDeleteProduct}
                        disable={setDeleteProductConfirm}
                    />
                </MaskProvider>
            )}

        </Box>
    );
}