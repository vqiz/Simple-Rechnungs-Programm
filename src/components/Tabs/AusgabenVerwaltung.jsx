import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Input, Table, Chip, IconButton, Tooltip, Stack, Dropdown, Menu, MenuButton, MenuItem, ListItemDecorator } from '@mui/joy';
import { getAusgaben, deleteAusgabe, importFromERechnung } from '../../Scripts/AusgabenHandler';
import { exportToCSV } from '../../Scripts/ExportHandler';
import AusgabenEditor from '../Ausgaben/AusgabenEditor';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SyncIcon from '@mui/icons-material/Sync';
import { Modal, ModalDialog } from '@mui/joy';

export default function AusgabenVerwaltung() {
    const [expenses, setExpenses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Attachment Viewer State
    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerContent, setViewerContent] = useState(null);
    const [viewerType, setViewerType] = useState('image'); // image, pdf, xml
    const [viewerTitle, setViewerTitle] = useState('');

    const fetchData = async () => {
        const data = await getAusgaben();
        // Sort by date descending
        const sorted = (data.list || []).sort((a, b) => b.date - a.date);
        setExpenses(sorted);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        // Confirmation is now handled slightly differently or we can keep window.confirm for now
        //Ideally we use a custom modal, but for speed window.confirm is fine if not requested otherwise.
        // Let's stick to consistent UI if possible, but I don't have a generic confirm modal ready here comfortably without context.
        // I will use window.confirm for now as per original code, but wrapped in a better UX if possible later.
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
        // Prepare data for export (flatten/format dates)
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
                    alert(`E-Rechnung erfolgreich importiert:\n${result.expense.title}\nBetrag: ${result.expense.amount} €`);
                    fetchData();
                } else {
                    alert(`Fehler beim Import: ${result.error}`);
                }
            } catch (error) {
                alert(`Fehler beim Lesen der Datei: ${error.message}`);
            }
        };
        input.click();
    };

    const handleViewAttachment = async (item) => {
        if (!item.attachmentPath) return;

        // If XML (E-Rechnung), show in internal viewer
        if (item.attachmentPath.toLowerCase().endsWith('.xml')) {
            try {
                const content = await window.api.readAttachment(item.attachmentPath);
                if (!content) {
                    alert("Fehler beim Laden der E-Rechnung.");
                    return;
                }
                setViewerTitle(item.title);
                setViewerContent(content);
                setViewerType('xml');
                setViewerOpen(true);
            } catch (e) {
                console.error(e);
                alert("Konnte E-Rechnung nicht öffnen.");
            }
        } else {
            // Otherwise open in system default app
            try {
                const result = await window.api.openExternal(item.attachmentPath);
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

    return (
        <Box sx={{ p: 4, height: '100%', overflowY: 'auto' }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Typography level="h2" sx={{ fontSize: '24px', fontWeight: 600 }}>Ausgaben</Typography>
                    <Typography level="body-sm">Verwalten Sie Ihre geschäftlichen Ausgaben und wiederkehrenden Kosten.</Typography>
                </div>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        color="neutral"
                        startDecorator={<FileDownloadOutlinedIcon />}
                        onClick={handleExport}
                        sx={{ borderRadius: '20px' }}
                    >
                        Exportieren
                    </Button>
                    <Button
                        variant="outlined"
                        color="neutral"
                        startDecorator={<UploadFileOutlinedIcon />}
                        onClick={handleImportERechnung}
                        sx={{ borderRadius: '20px' }}
                    >
                        Importieren
                    </Button>
                    <button
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        onClick={handleCreate}
                    >
                        <AddCircleOutlineOutlinedIcon sx={{ fontSize: '20px' }} />
                        Ausgabe erfassen
                    </button>
                </Box>
            </Box>

            <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                <Input
                    placeholder="Ausgaben suchen..."
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
                            <th style={{ width: '15%' }}>Datum</th>
                            <th style={{ width: '25%' }}>Titel</th>
                            <th style={{ width: '15%' }}>Kategorie</th>
                            <th style={{ width: '15%' }}>Anbieter</th>
                            <th style={{ width: '10%', textAlign: 'right' }}>Betrag</th>
                            <th style={{ width: '10%' }}>Typ</th>
                            <th style={{ width: '10%', textAlign: 'right' }}>Aktionen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExpenses.map(item => (
                            <tr key={item.id}>
                                <td>{new Date(item.date).toLocaleDateString("de-DE")}</td>
                                <td><Typography fontWeight="md">{item.title}</Typography></td>
                                <td>{item.category && <Chip size="sm" variant="soft" color="neutral">{item.category}</Chip>}</td>
                                <td>{item.provider}</td>
                                <td style={{ textAlign: 'right' }}><Typography color="danger" fontFamily="monospace">-{parseFloat(item.amount).toFixed(2)} €</Typography></td>
                                <td>{item.isRecurring && <Chip size="sm" color="primary" variant="outlined">Abo</Chip>}</td>
                                <td style={{ textAlign: 'right' }}>
                                    <Dropdown>
                                        <MenuButton slots={{ root: IconButton }} slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}>
                                            <MoreVertIcon />
                                        </MenuButton>
                                        <Menu placement="bottom-end" size="sm">
                                            {item.attachmentPath && (
                                                <MenuItem onClick={() => handleViewAttachment(item)}>
                                                    <ListItemDecorator><AttachFileIcon /></ListItemDecorator> Anhang anzeigen
                                                </MenuItem>
                                            )}
                                            <MenuItem onClick={() => handleEdit(item)}>
                                                <ListItemDecorator><EditOutlinedIcon /></ListItemDecorator> Bearbeiten
                                            </MenuItem>
                                            <MenuItem color="danger" onClick={() => handleDelete(item.id)}>
                                                <ListItemDecorator><DeleteOutlineOutlinedIcon /></ListItemDecorator> Löschen
                                            </MenuItem>
                                        </Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                        ))}
                        {filteredExpenses.length === 0 && (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--swiss-gray-500)' }}>
                                    Keine Ausgaben gefunden.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Box>

            <AusgabenEditor
                open={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                ausgabeToEdit={editingItem}
                onSave={fetchData}
            />

            {/* Attachment Viewer Modal */}
            <Modal open={viewerOpen} onClose={() => setViewerOpen(false)}>
                <ModalDialog sx={{ maxWidth: '90vw', maxHeight: '90vh', overflow: 'auto', p: 0 }}>
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'var(--swiss-gray-50)' }}>
                        <Typography level="h4">{viewerTitle} - Anhang</Typography>
                        <Button variant="plain" color="neutral" onClick={() => setViewerOpen(false)}>Schließen</Button>
                    </Box>
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                        {/* Only XML viewer remains here */}
                        {viewerType === 'xml' && viewerContent && (
                            <pre style={{ overflow: 'auto', maxHeight: '500px', width: '100%', whiteSpace: 'pre-wrap', fontSize: '12px' }}>
                                {atob(viewerContent.split(',')[1])}
                            </pre>
                        )}
                        {viewerType !== 'xml' && <Typography>Vorschau nur extern verfügbar.</Typography>}
                    </Box>
                </ModalDialog>
            </Modal>
        </Box>
    );
}
