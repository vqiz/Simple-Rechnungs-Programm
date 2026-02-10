import { Avatar, Box, Button, Chip, Input, Table, Typography, IconButton, Tooltip } from '@mui/joy'
import React, { useEffect, useState } from 'react'
import Headline from '../Headline' // Might be deprecated/refactored, but used for backnav if needed.
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import MaskProvider from '../MaskProvider';
import KundeErstellung from '../KundenVerwaltung/Masks/KundeErstellung';
import { handleLoadFile } from '../../Scripts/Filehandler';
import { rebuildKundenDB } from '../../Scripts/KundenDatenBank';
import SyncIcon from '@mui/icons-material/Sync';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import debounce from 'lodash/debounce';
import { useNavigate } from 'react-router-dom';
import AvatarTabeUtil from '../AvatarTabeUtil';
import { kundeErstellen } from '../../Scripts/KundenDatenBank';
import '../../styles/swiss.css';

function KundenVerwaltung() {
    const [createkunde, setcreatekunde] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const navigate = useNavigate();
    function close() {
        setcreatekunde(false);
    }
    const [data, setdata] = useState(null);
    const [filteredList, setFilteredList] = useState([]);

    useEffect(() => {
        const readdata = async () => {
            const readjson = await handleLoadFile("fast_accsess/kunden.db");
            if (readjson === "{}") {
                setdata(JSON.parse('{"list": []}'));
                return;
            }
            setdata(JSON.parse(readjson));
        }
        readdata();
    }, []);

    useEffect(() => {
        const handler = debounce(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        handler();
        return () => {
            handler.cancel();
        };
    }, [searchTerm]);

    useEffect(() => {
        const filterData = async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
            if (!data || !data.list) {
                setFilteredList([]);
                return;
            }
            const term = debouncedSearchTerm.toLowerCase();
            const filtered = data.list.filter((i) => {
                const nameLower = i.name.toLowerCase();
                const emailLower = i.email.toLowerCase();
                return (
                    nameLower.includes(term) ||
                    emailLower.includes(term) ||
                    i.id.includes(term)
                );
            });
            setFilteredList(filtered);
        };
        filterData();
    }, [data, debouncedSearchTerm]);

    const handleCSVExport = () => {
        if (!data || !data.list || data.list.length === 0) {
            alert("Keine Kunden zum Exportieren vorhanden.");
            return;
        }

        // Define Headers
        const headers = ["ID", "Name", "IstFirma", "Email", "Telefon", "Strasse", "Nummer", "PLZ", "Ort", "Land"];

        // Map Data
        const csvRows = [headers.join(";")];
        data.list.forEach(k => {
            const row = [
                k.id,
                k.name,
                k.istfirma ? "1" : "0",
                k.email || "",
                k.tel || "",
                k.street || "",
                k.number || "",
                k.plz || "",
                k.ort || "",
                k.landcode || "DE"
            ].map(val => `"${String(val).replace(/"/g, '""')}"`); // Escape quotes
            csvRows.push(row.join(";"));
        });

        const csvString = csvRows.join("\n");
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "kunden_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCSVImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const lines = text.split(/\r?\n/).filter(l => l.trim() !== "");
            if (lines.length < 2) return;

            const separator = lines[0].includes(';') ? ';' : ',';
            const headers = lines[0].split(separator).map(h => h.trim().toLowerCase());

            const findIdx = (keys) => headers.findIndex(h => keys.some(k => h === k || h.includes(k)));

            const idxName = findIdx(['name', 'firma', 'kundenname', 'customer']);
            const idxStreet = findIdx(['straße', 'street', 'adresse']);
            const idxNumber = findIdx(['hausnummer', 'nr', 'number']);
            const idxPLZ = findIdx(['plz', 'zip', 'postleitzahl']);
            const idxOrt = findIdx(['ort', 'city', 'stadt']);
            const idxEmail = findIdx(['email', 'mail']);
            const idxTel = findIdx(['telefon', 'phone', 'mobil']);
            const idxContact = findIdx(['ansprechpartner', 'contact']);

            if (idxName === -1) {
                alert("CSV Fehler: Spalte 'Name' nicht gefunden.");
                return;
            }

            let count = 0;
            for (let i = 1; i < lines.length; i++) {
                const row = lines[i].split(separator).map(c => c.trim().replace(/^"|"$/g, ''));
                if (row.length < headers.length * 0.5) continue; // Skip empty/broken rows

                const name = row[idxName] || "";
                if (!name) continue;

                // Smart guess for "istFirma": if no specific flag, assume true if name contains GmbH, UG, AG, etc.
                const istfirma = name.match(/(GmbH|UG|AG|Kg|Limited|Inc)/i) ? true : false;

                await kundeErstellen(
                    name,
                    istfirma,
                    idxStreet > -1 ? row[idxStreet] : "",
                    idxNumber > -1 ? row[idxNumber] : "",
                    idxPLZ > -1 ? row[idxPLZ] : "",
                    idxOrt > -1 ? row[idxOrt] : "",
                    "DE", // Default Land
                    idxEmail > -1 ? row[idxEmail] : "",
                    idxTel > -1 ? row[idxTel] : "",
                    idxContact > -1 ? row[idxContact] : "",
                    "" // LeitwegID
                );
                count++;
            }

            alert(`${count} Kunden erfolgreich importiert.`);
            const list = await rebuildKundenDB();
            setdata({ list });

        } catch (err) {
            console.error(err);
            alert("Fehler beim Import: " + err.message);
        }
        e.target.value = null; // Reset input
    };

    return (
        <Box sx={{ p: 4, height: '100%', overflowY: 'auto' }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Typography level="h2" sx={{ fontSize: '24px', fontWeight: 600 }}>Kunden</Typography>
                    <Typography level="body-sm">Verwalten Sie Ihre Kundenkontakte und Firmen.</Typography>
                </div>
                <button
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => setcreatekunde(true)}
                >
                    <AddCircleOutlineOutlinedIcon sx={{ fontSize: '20px' }} />
                    Neuer Kunde
                </button>
            </Box>

            <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                <Input
                    placeholder="Suchen..."
                    startDecorator={<SearchIcon />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                        flexGrow: 1,
                        maxWidth: '400px',
                        borderRadius: '24px',
                        '--Input-focusedHighlight': 'var(--md-sys-color-primary)'
                    }}
                />

                <Tooltip title="CSV Import">
                    <Button component="label" variant="outlined" color="neutral" sx={{ borderRadius: '12px' }}>
                        <UploadFileOutlinedIcon />
                        <input type="file" hidden accept=".csv" onChange={handleCSVImport} />
                    </Button>
                </Tooltip>

                <Tooltip title="CSV Export">
                    <IconButton variant="outlined" color="neutral" onClick={handleCSVExport} sx={{ borderRadius: '12px' }}>
                        <DownloadOutlinedIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Liste neu laden">
                    <IconButton variant="plain" color="neutral" onClick={async () => {
                        const list = await rebuildKundenDB();
                        setdata({ list });
                    }} sx={{ borderRadius: '12px' }}>
                        <SyncIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            <Box className="swiss-card" sx={{ p: 0, overflow: 'hidden' }}>
                <Table hoverRow sx={{ '--TableCell-headBackground': 'var(--swiss-gray-50)' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '60px' }}></th>
                            <th>Name</th>
                            <th>Typ</th>
                            <th>Email</th>
                            <th>Ort</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredList.map((item) => (
                            <tr
                                key={item.id}
                                onClick={() => navigate("/kunden-viewer/" + item.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <td style={{ textAlign: 'center' }}>
                                    <AvatarTabeUtil istfirma={item.istfirma} />
                                </td>
                                <td>
                                    <Typography fontWeight="md">{item.name}</Typography>
                                    <Typography level="body-xs" sx={{ color: 'var(--swiss-gray-500)' }}>{item.id}</Typography>
                                </td>
                                <td>
                                    {item.istfirma ?
                                        <Chip size="sm" variant="soft" color="primary">Firma</Chip> :
                                        <Chip size="sm" variant="soft" color="neutral">Privat</Chip>
                                    }
                                </td>
                                <td>
                                    <Typography level="body-sm">{item.email || "-"}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-sm">{item.plz} {item.ort}</Typography>
                                </td>
                            </tr>
                        ))}
                        {filteredList.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--swiss-gray-500)' }}>
                                    Keine Kunden gefunden
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Box>

            {createkunde && (
                <MaskProvider>
                    <KundeErstellung submit={close} />
                </MaskProvider>
            )}
        </Box>
    )
}

export default KundenVerwaltung
