import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Dropdown, Menu, MenuButton, MenuItem, ListItemDecorator } from '@mui/joy';
import { getAusgaben, deleteAusgabe, importFromERechnung } from '../../Scripts/AusgabenHandler';
import { exportToCSV } from '../../Scripts/ExportHandler';
import AusgabenEditor from '../Ausgaben/AusgabenEditor';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Modal, ModalDialog } from '@mui/joy';


import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { FileDown, UploadCloud, PlusCircle, Search, RefreshCw, MoreVertical, Edit2, Trash2, Paperclip, Eye } from "lucide-react";

export default function AusgabenVerwaltung() {
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);


    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerContent, setViewerContent] = useState(null);
    const [viewerType, setViewerType] = useState('image');
    const [viewerTitle, setViewerTitle] = useState('');

    const fetchData = async () => {
        const data = await getAusgaben();

        const sorted = (data.list || []).sort((a, b) => b.date - a.date);
        setExpenses(sorted);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Möchten Sie diese Ausgabe wirklich löschen?")) {
            await deleteAusgabe(id);
            fetchData();
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsEditorOpen(true);
    };

    const handleCreate = () => {
        setEditingItem(null);
        setIsEditorOpen(true);
    };

    const handleExport = () => {

        const exportData = expenses.map(e => ({
            Titel: e.title,
            Betrag: e.amount,
            Datum: new Date(e.date).toLocaleDateString("de-DE"),
            Kategorie: e.category,
            Anbieter: e.provider,
            Beschreibung: e.description,
            Wiederkehrend: e.isRecurring ? "Ja" : "Nein"
        }));
        exportToCSV(exportData, "Ausgaben_Export.csv");
    };

    const handleImportERechnung = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xml';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                const text = await file.text();
                const result = await importFromERechnung(text);

                if (result.success) {
                    alert(`E - Rechnung erfolgreich importiert: \n${result.expense.title} \nBetrag: ${result.expense.amount} €`);
                    fetchData();
                } else {
                    alert(`Fehler beim Import: ${result.error} `);
                }
            } catch (error) {
                alert(`Fehler beim Lesen der Datei: ${error.message} `);
            }
        };
        input.click();
    };

    const handleViewAttachment = async (path, title) => {
        if (!path) return;


        if (path.toLowerCase().endsWith('.xml')) {
            try {
                const content = await window.api.readAttachment(path);
                if (!content) {
                    alert("Fehler beim Laden der E-Rechnung.");
                    return;
                }
                setViewerTitle(title);

                setViewerContent(atob(content.split(',')[1]));
                setViewerType('xml');
                setViewerOpen(true);
            } catch (e) {
                console.error(e);
                alert("Konnte E-Rechnung nicht öffnen.");
            }
        } else {

            try {
                const result = await window.api.openExternal(path);
                if (!result.success) {
                    alert("Fehler beim Öffnen der Datei: " + (result.error || "Unbekannter Fehler"));
                }
            } catch (e) {
                console.error(e);
                alert("Konnte Datei nicht extern öffnen.");
            }
        }
    };

    const filteredExpenses = expenses.filter(e =>
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.provider?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const groupedExpenses = React.useMemo(() => {
        const groups = {};
        const standalone = [];

        filteredExpenses.forEach(expense => {
            if (expense.isRecurring) {

                const key = expense.masterId || expense.recurringId || `legacy_${expense.title}`;

                if (!groups[key]) {
                    groups[key] = {
                        isGrouped: true,
                        id: key,
                        title: expense.title,
                        category: expense.category,
                        provider: expense.provider,
                        isRecurring: true,

                        totalAmount: 0,
                        count: 0,
                        dates: [],
                        allAttachments: [],
                        originalExpenses: []
                    };
                }

                const g = groups[key];
                g.totalAmount += parseFloat(expense.amount || 0);
                g.count += 1;
                g.dates.push(expense.date);
                g.originalExpenses.push(expense);


                if (expense.attachments && expense.attachments.length > 0) {
                    expense.attachments.forEach(att => g.allAttachments.push({ ...att, expenseDate: expense.date }));
                } else if (expense.attachmentPath) {
                    g.allAttachments.push({ path: expense.attachmentPath, name: expense.title, expenseDate: expense.date });
                }
            } else {
                standalone.push(expense);
            }
        });


        const groupedArray = Object.values(groups).map(g => {
            g.dates.sort((a, b) => a - b);
            const oldestDate = new Date(g.dates[0]).toLocaleDateString("de-DE", { month: '2-digit', year: 'numeric' });
            const newestDate = new Date(g.dates[g.dates.length - 1]).toLocaleDateString("de-DE", { month: '2-digit', year: 'numeric' });


            g.displayDate = g.dates.length > 1 ? `${oldestDate} - ${newestDate}` : `Seit ${oldestDate}`;


            g.allAttachments.sort((a, b) => (b.expenseDate || 0) - (a.expenseDate || 0));


            g.sortDate = g.dates[g.dates.length - 1];
            return g;
        });


        standalone.forEach(s => {
            s.sortDate = s.date;
            s.displayDate = new Date(s.date).toLocaleDateString("de-DE");
        });


        return [...groupedArray, ...standalone].sort((a, b) => b.sortDate - a.sortDate);
    }, [filteredExpenses]);

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 h-full overflow-y-auto w-full bg-background">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Ausgaben</h2>
                    <p className="text-muted-foreground mt-1">Verwalten Sie Ihre geschäftlichen Ausgaben und wiederkehrenden Kosten.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="outline" className="gap-2 rounded-full" onClick={handleExport}>
                        <FileDown className="h-4 w-4" />
                        Exportieren
                    </Button>
                    <Button variant="outline" className="gap-2 rounded-full" onClick={handleImportERechnung}>
                        <UploadCloud className="h-4 w-4" />
                        Importieren
                    </Button>
                    <Button className="gap-2 bg-primary hover:bg-primary/90 rounded-md" onClick={handleCreate}>
                        <PlusCircle className="h-4 w-4" />
                        Ausgabe erfassen
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Ausgaben suchen..."
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
                            <TableHead className="w-[120px] font-semibold">Datum</TableHead>
                            <TableHead className="font-semibold">Titel</TableHead>
                            <TableHead className="font-semibold">Kategorie</TableHead>
                            <TableHead className="font-semibold">Anbieter</TableHead>
                            <TableHead className="text-right font-semibold">Betrag</TableHead>
                            <TableHead className="w-[100px] font-semibold text-center">Abo</TableHead>
                            <TableHead className="w-[80px] text-right font-semibold">Aktionen</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {groupedExpenses.map((expense) => (
                            <TableRow key={expense.id} className="hover:bg-muted/50 transition-colors cursor-default">
                                <TableCell className="text-muted-foreground whitespace-nowrap">{expense.displayDate}</TableCell>
                                <TableCell className="font-medium">
                                    {expense.title}
                                    {expense.isGrouped && expense.count > 1 && (
                                        <span className="ml-2 text-xs font-normal text-muted-foreground">({expense.count} Raten)</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-muted/20">
                                        {expense.category || "Keine Kategorie"}
                                    </span>
                                </TableCell>
                                <TableCell>{expense.provider}</TableCell>
                                <TableCell className="text-right font-mono text-red-500 font-medium">
                                    -{expense.isGrouped ? expense.totalAmount.toFixed(2) : parseFloat(expense.amount).toFixed(2)} €
                                </TableCell>
                                <TableCell className="text-center">
                                    {expense.isRecurring && (
                                        <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                                            Abo
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Dropdown>
                                            <MenuButton slots={{ root: 'button' }} slotProps={{ root: { className: 'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 text-muted-foreground' } }}>
                                                <MoreVertical className="h-4 w-4" />
                                            </MenuButton>
                                            <Menu placement="bottom-end" size="sm" sx={{ maxHeight: 300, overflowY: 'auto' }}>

                                                {/* Standalone attachments only (not grouped abos — those are in the detail viewer) */}
                                                {!expense.isGrouped && (
                                                    <>
                                                        {/* Standalone Legacy Attachment */}
                                                        {expense.attachmentPath && !expense.attachments && (
                                                            <MenuItem onClick={() => handleViewAttachment(expense.attachmentPath, expense.title)}>
                                                                <ListItemDecorator><Paperclip className="h-4 w-4" /></ListItemDecorator> Anhang anzeigen
                                                            </MenuItem>
                                                        )}
                                                        {/* Standalone Array Format */}
                                                        {expense.attachments && expense.attachments.map((att, index) => (
                                                            <MenuItem key={index} onClick={() => handleViewAttachment(att.path, att.name || expense.title)}>
                                                                <ListItemDecorator><Paperclip className="h-4 w-4" /></ListItemDecorator> {att.name || "Anhang"}
                                                            </MenuItem>
                                                        ))}
                                                    </>
                                                )}

                                                {/* Details Viewer Button */}
                                                <MenuItem onClick={() => navigate(expense.isGrouped || expense.isVirtual ? `/ausgaben-viewer/${expense.id}` : `/ausgaben-viewer/${expense.id}`)}>
                                                    <ListItemDecorator><Eye className="h-4 w-4 text-primary" /></ListItemDecorator>
                                                    <span className="text-primary font-medium">Details öffnen</span>
                                                </MenuItem>

                                                {/* Actions */}
                                                {!expense.isGrouped && (
                                                    <MenuItem onClick={() => handleEdit(expense)}>
                                                        <ListItemDecorator><Edit2 className="h-4 w-4" /></ListItemDecorator> Bearbeiten
                                                    </MenuItem>
                                                )}

                                                <MenuItem color="danger" onClick={() => {
                                                    if (expense.isGrouped) {
                                                        if (window.confirm(`Möchten Sie dieses Abo und alle zugehörigen ${expense.count} Buchungen wirklich komplett löschen?`)) {
                                                            deleteAusgabe(expense.id).then(() => fetchData());
                                                        }
                                                    } else {
                                                        handleDelete(expense.id);
                                                    }
                                                }}>
                                                    <ListItemDecorator><Trash2 className="h-4 w-4 text-red-500" /></ListItemDecorator>
                                                    <span className="text-red-500">{expense.isGrouped ? 'Komplettes Abo löschen' : 'Löschen'}</span>
                                                </MenuItem>
                                            </Menu>
                                        </Dropdown>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredExpenses.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    Keine Ausgaben gefunden.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {isEditorOpen && (
                <AusgabenEditor
                    open={isEditorOpen}
                    onClose={() => setIsEditorOpen(false)}
                    ausgabeToEdit={editingItem}
                    onSave={() => {
                        setIsEditorOpen(false);
                        fetchData();
                    }}
                />
            )}

            {/* XML Viewer Modal (Simple Fallback) */}
            <Modal open={viewerOpen} onClose={() => setViewerOpen(false)}>
                <ModalDialog sx={{ width: '80vw', height: '80vh', overflow: 'hidden', p: 0, bgcolor: '#ffffff', borderRadius: '12px' }}>
                    <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ fontWeight: 'bold' }}>{viewerTitle}</Box>
                        <Button variant="ghost" size="sm" onClick={() => setViewerOpen(false)}>Schließen</Button>
                    </Box>
                    <Box sx={{ p: 2, overflow: 'auto', height: '100%', bgcolor: 'var(--swiss-gray-50)' }}>
                        {/* viewerContent is already decoded string for XML */}
                        {viewerType === 'xml' && viewerContent && (
                            <pre style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>{viewerContent}</pre>
                        )}
                        {viewerType !== 'xml' && <p className="text-muted-foreground">Vorschau nur extern verfügbar.</p>}
                    </Box>
                </ModalDialog>
            </Modal>
        </div>
    );
}
