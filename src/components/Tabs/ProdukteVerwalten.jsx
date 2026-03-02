import React, { useEffect, useState } from 'react';
import { Box, Dropdown, Menu, MenuButton, MenuItem, ListItemDecorator } from '@mui/joy';
import { handleLoadFile, handleSaveFile } from '../../Scripts/Filehandler';
import MaskProvider from '../MaskProvider';
import CreateProdukt from '../Produktedit/Masks/CreateProdukt';
import CreateProduktKathegorie from '../Produktedit/Masks/CreateProduktKathegorie';
import DeleteConfirmation from '../Produktedit/Masks/DeleteConfirmation';
import SingleLineinput from '../Produktedit/Masks/SingleLineinput';
import '../../styles/swiss.css';

// Shadcn UI & Icons
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { PlusCircle, Search, RefreshCw, MoreVertical, Layers, Edit2, Wallet, Trash2 } from "lucide-react";

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
        <div className="flex-1 space-y-6 p-8 pt-6 h-full overflow-y-auto w-full bg-background">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Produkte</h2>
                    <p className="text-muted-foreground mt-1">Verwalten Sie Ihr Inventar und Dienstleistungen.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="outline" className="gap-2 rounded-full" onClick={() => setIsCreateCategoryStart(true)}>
                        <Layers className="h-4 w-4" />
                        Kategorie erstellen
                    </Button>
                    <Button className="gap-2 bg-primary hover:bg-primary/90 rounded-md" onClick={() => setIsCreateProductStart(true)}>
                        <PlusCircle className="h-4 w-4" />
                        Neues Produkt
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Produkt suchen..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-8 rounded-full focus-visible:ring-primary"
                    />
                </div>
                <Button variant="ghost" size="icon" className="rounded-xl" onClick={fetchData} title="Neu laden">
                    <RefreshCw className="h-4 w-4 text-muted-foreground" />
                </Button>
            </div>

            <div className="rounded-md border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="font-semibold w-[30%]">Produktname</TableHead>
                            <TableHead className="font-semibold w-[20%]">Kategorie</TableHead>
                            <TableHead className="text-right font-semibold w-[15%]">Netto (€)</TableHead>
                            <TableHead className="text-right font-semibold w-[15%]">Steuer (%)</TableHead>
                            <TableHead className="text-right font-semibold w-[10%]">Aktionen</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.map((p, idx) => (
                            <TableRow key={`${p.categoryName}-${p.name}-${idx}`} className="hover:bg-muted/50 transition-colors cursor-default">
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        {p.name}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-muted/20">
                                        {p.categoryName}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right font-mono font-medium">{parseFloat(p.price).toFixed(2)} €</TableCell>
                                <TableCell className="text-right">{p.steuer} %</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Dropdown>
                                            <MenuButton slots={{ root: 'button' }} slotProps={{ root: { className: 'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 text-muted-foreground' } }}>
                                                <MoreVertical className="h-4 w-4" />
                                            </MenuButton>
                                            <Menu placement="bottom-end" size="sm">
                                                <MenuItem onClick={() => setEditField({ product: p, categoryName: p.categoryName, field: 'name', value: p.name })}>
                                                    <ListItemDecorator><Edit2 className="h-4 w-4" /></ListItemDecorator> Titel bearbeiten
                                                </MenuItem>
                                                <MenuItem onClick={() => setEditField({ product: p, categoryName: p.categoryName, field: 'price', value: p.price })}>
                                                    <ListItemDecorator><Wallet className="h-4 w-4" /></ListItemDecorator> Preis bearbeiten
                                                </MenuItem>
                                                <MenuItem onClick={() => setEditField({ product: p, categoryName: p.categoryName, field: 'steuer', value: p.steuer })}>
                                                    <ListItemDecorator><Wallet className="h-4 w-4" /></ListItemDecorator> Steuer bearbeiten
                                                </MenuItem>
                                                <MenuItem color="danger" onClick={() => setDeleteProductConfirm({ product: p, categoryName: p.categoryName })}>
                                                    <ListItemDecorator><Trash2 className="h-4 w-4 text-red-500" /></ListItemDecorator> <span className="text-red-500">Löschen</span>
                                                </MenuItem>
                                            </Menu>
                                        </Dropdown>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredProducts.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    Keine Produkte gefunden
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

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
                        startvalue={editField.value}
                        title={editField.field === 'name' ? "Titel bearbeiten" : editField.field === 'price' ? "Preis bearbeiten" : "Steuer bearbeiten"}
                        inputtype={editField.field === 'name' ? "text" : "number"}
                        save={handleEditProduct}
                        cancel={() => setEditField(null)}
                    />
                </MaskProvider>
            )}

            {/* Delete Confirmation Modal */}
            {deleteProductConfirm && (
                <MaskProvider>
                    <DeleteConfirmation
                        title={`"${deleteProductConfirm.product.name}" unwiderruflich löschen?`}
                        description={`Möchten Sie das Produkt "${deleteProductConfirm.product.name}" wirklich löschen?`}
                        buttontitle="Löschen"
                        confirmfunction={handleDeleteProduct}
                        cancel={() => setDeleteProductConfirm(null)}
                    />
                </MaskProvider>
            )}
        </div>
    );
}