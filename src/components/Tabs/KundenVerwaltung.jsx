import { Avatar, Box, Button, Chip, Input, Table, Typography } from '@mui/joy'
import React, { useEffect, useState } from 'react'
import Headline from '../Headline'
import InfoCard from '../InfoCard'
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import MaskProvider from '../MaskProvider';
import KundeErstellung from '../KundenVerwaltung/Masks/KundeErstellung';
import { handleLoadFile } from '../../Scripts/Filehandler';
import { rebuildKundenDB } from '../../Scripts/KundenDatenBank';
import SyncIcon from '@mui/icons-material/Sync';
import FactoryOutlinedIcon from '@mui/icons-material/FactoryOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import debounce from 'lodash/debounce';
import { useNavigate } from 'react-router-dom';
import AvatarTabeUtil from '../AvatarTabeUtil';
import { kundeErstellen } from '../../Scripts/KundenDatenBank';

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
        <Box
            sx={{
                height: '100vh',
                display: 'block',
                flexDirection: 'column',
                gap: 2,
                p: 0,
                position: 'relative',
                overflowY: "auto",

            }}
        >
            <Headline>Kundenverwaltung</Headline>
            <Box sx={{ p: 2 }}>
                <InfoCard headline={"Information"}>In der Kundenverwaltung können sie nach Kunden suchen um vorgänge nachvollziehen zu können.</InfoCard>
            </Box>

            {
                createkunde && (
                    <MaskProvider>
                        <KundeErstellung submit={close} />
                    </MaskProvider>
                )
            }




            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, width: "50%" }}>
                    <Input
                        placeholder="Kunden suchen..."
                        variant="outlined"
                        sx={{ flexGrow: 1, }}
                        onChange={(e) => setSearchTerm(e.target.value)}

                        startDecorator={<SearchIcon />}
                    />
                </Box>
                <Button onClick={() => setcreatekunde(true)} startDecorator={<AddCircleOutlineOutlinedIcon />} sx={{ mt: -1.8 }}>Kunde erstellen</Button>
                <Button component="label" startDecorator={<UploadFileOutlinedIcon />} sx={{ mt: -1.8 }} variant="outlined">
                    CSV Import
                    <input type="file" hidden accept=".csv" onChange={handleCSVImport} />
                </Button>
                <Button onClick={handleCSVExport} startDecorator={<DownloadOutlinedIcon />} sx={{ mt: -1.8 }} variant="outlined">
                    CSV Export
                </Button>
                <Button onClick={async () => {
                    const list = await rebuildKundenDB();
                    setdata({ list });
                }} startDecorator={<SyncIcon />} sx={{ mt: -1.8 }} variant="soft">Index Neu laden</Button>
            </Box>
            <Box
                sx={{
                    px: 2,
                    maxWidth: "100%",
                    mb: 5,
                    mx: "auto",
                    width: "100%",

                }}
            >
                <Table sx={{ borderRadius: "15px", maxWidth: "98%" }}>
                    <thead>
                        <tr>
                            <th>Kunden und Rechnungen</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredList.map((item) => {
                                const name = item.name;
                                const id = item.id;
                                const istfirma = item.istfirma;
                                const email = item.email;

                                return (
                                    <Box
                                        component="tr"
                                        key={id}
                                        sx={{
                                            transition: 'background-color 0.2s',
                                            '&:hover': {
                                                bgcolor: 'neutral.plainHoverBg',
                                            },
                                            cursor: "pointer"
                                        }}
                                        onClick={() => navigate("/kunden-viewer/" + id)}
                                    >
                                        <AvatarTabeUtil email={email} name={name} istfirma={istfirma} />
                                        <Box component="td" sx={{ padding: '12px 16px' }}>
                                            {
                                                istfirma ? (
                                                    <Chip>Unternehmen</Chip>
                                                ) : (
                                                    <Chip>PrivatKunde</Chip>
                                                )
                                            }
                                        </Box>
                                    </Box>


                                );

                            })
                        }
                    </tbody>
                </Table>
            </Box>
        </Box>
    )
}

export default KundenVerwaltung
