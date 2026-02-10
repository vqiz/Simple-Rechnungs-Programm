import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Input, Table, IconButton, Chip, Dropdown, Menu, MenuButton, MenuItem, ListItemDecorator, Tooltip, Stack } from '@mui/joy';
import Headline from '../Headline';
import InfoCard from '../InfoCard';
import { handleLoadFile, handleSaveFile } from '../../Scripts/Filehandler';
import MaskProvider from '../MaskProvider';
import CreateProdukt from '../Produktedit/Masks/CreateProdukt';
import CreateProduktKathegorie from '../Produktedit/Masks/CreateProduktKathegorie';
import DeleteConfirmation from '../Produktedit/Masks/DeleteConfirmation';
import SingleLineinput from '../Produktedit/Masks/SingleLineinput';
import SyncIcon from '@mui/icons-material/Sync';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EuroSymbolOutlinedIcon from '@mui/icons-material/EuroSymbolOutlined';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import '../../styles/swiss.css';

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
        <Box sx={{ p: 4, height: '100%', overflowY: 'auto' }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Typography level="h2" sx={{ fontSize: '24px', fontWeight: 600 }}>Produkte</Typography>
                    <Typography level="body-sm">Verwalten Sie Ihr Inventar und Dienstleistungen.</Typography>
                </div>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        color="neutral"
                        startDecorator={<CategoryOutlinedIcon />}
                        onClick={() => setIsCreateCategoryStart(true)}
                        sx={{ borderRadius: '20px' }}
                    >
                        Kategorie erstellen
                    </Button>
                    <button
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        onClick={() => setIsCreateProductStart(true)}
                    >
                        <AddCircleOutlineOutlinedIcon sx={{ fontSize: '20px' }} />
                        Neues Produkt
                    </button>
                </Box>
            </Box>

            <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                <Input
                    placeholder="Produkt suchen..."
                    startDecorator={<SearchIcon />}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    sx={{
                        flexGrow: 1,
                        maxWidth: '400px',
                        borderRadius: '24px',
                        '--Input-focusedHighlight': 'var(--md-sys-color-primary)'
                    }}
                />
                <Tooltip title="Neu laden">
                    <IconButton variant="plain" color="neutral" onClick={fetchData} sx={{ borderRadius: '12px' }}>
                        <SyncIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            <Box className="swiss-card" sx={{ p: 0, overflow: 'hidden' }}>
                <Table hoverRow sx={{ '--TableCell-headBackground': 'var(--swiss-gray-50)' }}>
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
                                <td><Typography fontWeight="md">{p.name}</Typography></td>
                                <td><Chip size="sm" variant="soft" color="neutral">{p.categoryName}</Chip></td>
                                <td style={{ textAlign: 'right' }}><Typography fontFamily="monospace">{parseFloat(p.price).toFixed(2)} €</Typography></td>
                                <td style={{ textAlign: 'right' }}>{p.steuer} %</td>
                                <td style={{ textAlign: 'right' }}>
                                    <Dropdown>
                                        <MenuButton slots={{ root: IconButton }} slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}>
                                            <MoreVertIcon />
                                        </MenuButton>
                                        <Menu placement="bottom-end" size="sm">
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
                        {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--swiss-gray-500)' }}>
                                    Keine Produkte gefunden
                                </td>
                            </tr>
                        )}
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