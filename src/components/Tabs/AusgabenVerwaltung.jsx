import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Input, Table, Chip, IconButton } from '@mui/joy';
import Headline from '../Headline';
import InfoCard from '../InfoCard';
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
        <Box sx={{ height: '100vh', overflowY: "auto", display: 'flex', flexDirection: 'column' }}>
            <Headline>Ausgabenverwaltung</Headline>
            <Box sx={{ p: 2 }}>
                <InfoCard headline="Übersicht">Verwalten Sie hier Ihre geschäftlichen Ausgaben und wiederkehrenden Kosten.</InfoCard>
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
                    <Button variant="outlined" startDecorator={<UploadFileOutlinedIcon />} onClick={handleImportERechnung}>E-Rechnung importieren</Button>
                    <Button variant="outlined" startDecorator={<FileDownloadOutlinedIcon />} onClick={handleExport}>CSV Export</Button>
                    <Button startDecorator={<AddCircleOutlineOutlinedIcon />} onClick={handleCreate}>Ausgabe erfassen</Button>
                </Box>
            </Box>

            <Box sx={{ px: 2, pb: 5 }}>
                <Table hoverRow sx={{ borderRadius: "15px", bgcolor: 'background.surface' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '15%' }}>Datum</th>
                            <th style={{ width: '25%' }}>Titel</th>
                            <th style={{ width: '15%' }}>Kategorie</th>
                            <th style={{ width: '15%' }}>Anbieter</th>
                            <th style={{ width: '10%' }}>Betrag</th>
                            <th style={{ width: '10%' }}>Typ</th>
                            <th style={{ width: '10%' }}>Aktionen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExpenses.map(item => (
                            <tr key={item.id}>
                                <td>{new Date(item.date).toLocaleDateString("de-DE")}</td>
                                <td><Typography fontWeight="bold">{item.title}</Typography></td>
                                <td>{item.category && <Chip size="sm" variant="soft">{item.category}</Chip>}</td>
                                <td>{item.provider}</td>
                                <td><Typography color="danger">-{parseFloat(item.amount).toFixed(2)} €</Typography></td>
                                <td>{item.isRecurring && <Chip size="sm" color="primary">Abo</Chip>}</td>
                                <td>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        {item.attachmentPath && (
                                            <IconButton size="sm" variant="soft" color="primary" onClick={() => handleViewAttachment(item)}>
                                                <AttachFileIcon />
                                            </IconButton>
                                        )}
                                        <IconButton size="sm" variant="plain" onClick={() => handleEdit(item)}><EditOutlinedIcon /></IconButton>
                                        <IconButton size="sm" variant="plain" color="danger" onClick={() => handleDelete(item.id)}><DeleteOutlineOutlinedIcon /></IconButton>
                                    </Box>
                                </td>
                            </tr>
                        ))}
                        {filteredExpenses.length === 0 && (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>Keine Ausgaben gefunden.</td>
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
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.level1' }}>
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
