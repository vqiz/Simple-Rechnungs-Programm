import { Avatar, Box, Button, Chip, Dropdown, Input, ListItem, Menu, MenuButton, MenuItem, Table, Typography, Divider, IconButton, Tooltip, Stack } from '@mui/joy'
import React, { useEffect, useState } from 'react'
import Headline from '../components/Headline' // Deprecated/BackNav
import { useNavigate, useParams } from 'react-router-dom'
import { handleLoadFile, handleSaveFile } from '../Scripts/Filehandler';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import FactoryOutlinedIcon from '@mui/icons-material/FactoryOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ListPart from '../components/ListPart';
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import PersonPinCircleOutlinedIcon from '@mui/icons-material/PersonPinCircleOutlined';
import SearchIcon from '@mui/icons-material/Search';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import MaskProvider from '../components/MaskProvider';
import { generateCode } from '../Scripts/KundenDatenBank';
import LieferantenEditor from '../components/LieferantenVerwaltung/LieferantenEditor';
import debouce from 'lodash/debounce';
import '../styles/swiss.css';

function LieferantenViewer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState();
    const [edit, setEdit] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

    const fetchSupplier = async () => {
        try {
            const string = await handleLoadFile("lieferanten/" + id);
            const json = JSON.parse(string);
            // Ensure rechnungen is an array
            if (!json.rechnungen) json.rechnungen = [];
            setData(json);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        fetchSupplier();
    }, [id]);

    const addNewFile = async () => {
        await handleLoadFile("lieferantenrechnungen/dump.rechnix"); // Ensure dir exists
        let code = generateCode();
        const folderdata = await window.api.listfiles("lieferantenrechnungen/")
        while (folderdata.includes(code + "")) {
            code = generateCode();
        }

        const result = await window.api.copyFile("lieferantenrechnungen/" + code);
        if (result.success) {
            let type = "PDF";
            const content = await handleLoadFile(result.destination);
            if (content.includes("</Invoice>")) {
                type = "X-Rechnung";
            }
            const item = {
                name: result.name,
                id: code,
                "type": type,
            }
            const newData = { ...data };
            newData.rechnungen.push(item);
            setData(newData);
            await handleSaveFile("lieferanten/" + id, JSON.stringify(newData));
        }
    }

    useEffect(() => {
        const handler = debouce(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        handler();
        return () => {
            handler.cancel();
        };
    }, [searchTerm]);

    const openFile = (item) => {
        sessionStorage.setItem(item.id, JSON.stringify(item));
        navigate("/view-file/" + item.id + "/" + id);
    }

    const closeEditor = () => {
        setEdit(false);
        fetchSupplier();
    }

    if (!data) return <Box sx={{ p: 4 }}>Laden...</Box>;

    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'var(--md-sys-color-surface)' }}>

            {/* Sidebar */}
            <Box sx={{
                width: '320px',
                borderRight: '1px solid var(--swiss-gray-200)',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'var(--md-sys-color-surface-container-low)',
                flexShrink: 0
            }}>
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton onClick={() => navigate("/suppliers")} variant="plain">
                        <ArrowCircleLeftOutlinedIcon />
                    </IconButton>
                    <Typography level="title-md">Lieferanten</Typography>
                </Box>

                <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <Avatar size="lg" sx={{ width: 80, height: 80, mb: 2, fontSize: '32px' }}>
                        {data.name?.[0]?.toUpperCase()}
                    </Avatar>
                    <Typography level="h3" sx={{ mb: 1 }}>{data.name}</Typography>
                    <Chip size="sm" variant="soft" color="primary">Lieferant</Chip>
                </Box>

                <Divider sx={{ mx: 2 }} />

                <Box sx={{ p: 2, overflowY: 'auto', flex: 1 }}>
                    <ListPart title="Details">
                        <ListItem sx={{ px: 0 }}>
                            <ListItem>
                                <FactoryOutlinedIcon sx={{ mr: 2, color: 'var(--swiss-gray-500)' }} />
                                <Box>
                                    <Typography level="body-xs" fontWeight="bold">Adresse</Typography>
                                    <Typography level="body-sm">{data.straße} {data.hausnummer}</Typography>
                                    <Typography level="body-sm">{data.plz} {data.city}</Typography>
                                </Box>
                            </ListItem>
                        </ListItem>
                        <ListItem sx={{ px: 0 }}>
                            <ListItem>
                                <LocalPhoneOutlinedIcon sx={{ mr: 2, color: 'var(--swiss-gray-500)' }} />
                                <Box>
                                    <Typography level="body-xs" fontWeight="bold">Telefon</Typography>
                                    <Typography level="body-sm">{data.tel || "-"}</Typography>
                                </Box>
                            </ListItem>
                        </ListItem>
                        <ListItem sx={{ px: 0 }}>
                            <ListItem>
                                <AlternateEmailOutlinedIcon sx={{ mr: 2, color: 'var(--swiss-gray-500)' }} />
                                <Box>
                                    <Typography level="body-xs" fontWeight="bold">Email</Typography>
                                    <Typography level="body-sm" sx={{ wordBreak: 'break-all' }}>{data.email || "-"}</Typography>
                                </Box>
                            </ListItem>
                        </ListItem>
                        {data.ansprechpartner && (
                            <ListItem sx={{ px: 0 }}>
                                <ListItem>
                                    <PersonPinCircleOutlinedIcon sx={{ mr: 2, color: 'var(--swiss-gray-500)' }} />
                                    <Box>
                                        <Typography level="body-xs" fontWeight="bold">Ansprechpartner</Typography>
                                        <Typography level="body-sm">{data.ansprechpartner}</Typography>
                                    </Box>
                                </ListItem>
                            </ListItem>
                        )}
                    </ListPart>
                </Box>

                <Box sx={{ p: 2, borderTop: '1px solid var(--swiss-gray-200)' }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="neutral"
                        startDecorator={<EditOutlinedIcon />}
                        onClick={() => setEdit(true)}
                    >
                        Bearbeiten
                    </Button>
                </Box>
            </Box>

            {/* Main Content */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                <Box sx={{ p: 3, borderBottom: '1px solid var(--swiss-gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography level="h4">Rechnungen & Dokumente</Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Input
                            startDecorator={<SearchIcon />}
                            placeholder="Rechnung suchen..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{ width: '300px', borderRadius: '20px' }}
                        />
                        <Button
                            startDecorator={<AddCircleOutlineOutlinedIcon />}
                            onClick={addNewFile}
                        >
                            Datei hinzufügen
                        </Button>
                    </Box>
                </Box>

                <Box sx={{ p: 0, overflowY: 'auto', flex: 1 }}>
                    <Table hoverRow stickyHeader sx={{ '--TableCell-headBackground': 'var(--swiss-gray-50)' }}>
                        <thead>
                            <tr>
                                <th style={{ width: '60px' }}></th>
                                <th>Dateiname</th>
                                <th>Typ</th>
                                <th>Aktionen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.rechnungen?.slice().reverse()
                                .filter((item) => item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
                                .map((item) => (
                                    <tr key={item.id} onClick={() => openFile(item)} style={{ cursor: 'pointer' }}>
                                        <td style={{ textAlign: 'center' }}>
                                            <ReceiptLongOutlinedIcon sx={{ color: 'var(--swiss-gray-500)' }} />
                                        </td>
                                        <td>
                                            <Typography fontWeight="md">{item.name}</Typography>
                                        </td>
                                        <td>
                                            <Chip size="sm" variant="outlined">{item.type || "PDF"}</Chip>
                                        </td>
                                        <td>
                                            <IconButton size="sm" variant="plain" color="neutral" onClick={(e) => { e.stopPropagation(); /* Add menu here if needed */ }}>
                                                <MoreVertOutlinedIcon />
                                            </IconButton>
                                        </td>
                                    </tr>
                                ))}
                            {(!data.rechnungen || data.rechnungen.length === 0) && (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: 'var(--swiss-gray-500)' }}>
                                        Keine Dokumente vorhanden
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Box>
            </Box>

            {edit && (
                <MaskProvider>
                    <LieferantenEditor close={closeEditor} id={id} />
                </MaskProvider>
            )}

        </Box>
    )
}

export default LieferantenViewer
