import { Box, Button, Input, Table, Typography, IconButton, Tooltip, Chip } from '@mui/joy'
import React, { useEffect, useState } from 'react'
import Headline from '../Headline'
import InfoCard from '../InfoCard' // Keep if useful, or replace with simple text
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import LieferantenCreator from '../LieferantenVerwaltung/LieferantenCreator';
import MaskProvider from '../MaskProvider';
import { useNavigate } from 'react-router-dom';
import AvatarTabeUtil from '../AvatarTabeUtil';
import { handleLoadFile } from '../../Scripts/Filehandler';
import { debounce } from 'lodash';
import SyncIcon from '@mui/icons-material/Sync';
import '../../styles/swiss.css';

function LieferantenVerwaltung() {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [createLieferant, setCreateLieferant] = useState(false);
    const navigate = useNavigate();
    const [items, setItems] = useState();
    const [emails, setEmails] = useState({});
    const [filteredList, setFilteredList] = useState([]);

    const fetchItems = async () => {
        const list = await window.api.listfiles("lieferanten/");
        const listWithoutTest = list.filter((i) => i.name !== "test.data");
        setItems(listWithoutTest);
        const emailMap = {};
        for (const i of listWithoutTest) {
            try {
                const json = await handleLoadFile("lieferanten/" + i.name);
                const obj = JSON.parse(json);
                emailMap[i.name] = obj.email === "" ? obj.tel : obj.email;
            } catch (e) {
                console.error("Error loading supplier", i.name, e);
            }
        }
        setEmails(emailMap);
    }

    useEffect(() => {
        fetchItems();
    }, []);

    const close = (n) => {
        setCreateLieferant(false);
        if (n) {
            navigate("/lieferanten-viewer/" + n);
        }
    }

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
            if (!items) {
                setFilteredList([]);
                return;
            }
            const term = debouncedSearchTerm.toLowerCase();
            const filtered = items.filter((i) => {
                const nameLower = i.name.toLowerCase();
                return (
                    nameLower.includes(term)
                );
            });
            setFilteredList(filtered);
        };
        filterData();
    }, [items, debouncedSearchTerm]);

    return (
        <Box sx={{ p: 4, height: '100%', overflowY: 'auto' }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Typography level="h2" sx={{ fontSize: '24px', fontWeight: 600 }}>Lieferanten</Typography>
                    <Typography level="body-sm">Verwalten Sie Ihre Lieferanten und eingehende Rechnungen.</Typography>
                </div>
                <Button
                    startDecorator={<AddCircleOutlineOutlinedIcon />}
                    onClick={() => setCreateLieferant(true)}
                    sx={{ borderRadius: '20px', bgcolor: 'var(--md-sys-color-primary)' }}
                >
                    Neuer Lieferant
                </Button>
            </Box>

            <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                <Input
                    placeholder="Lieferant suchen..."
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
                <Tooltip title="Liste neu laden">
                    <IconButton variant="plain" color="neutral" onClick={fetchItems} sx={{ borderRadius: '12px' }}>
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
                            <th>Kontakt (Email/Tel)</th>
                            <th>Typ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredList.map((item) => (
                            <tr
                                key={item.name}
                                onClick={() => navigate("/lieferanten-viewer/" + item.name)}
                                style={{ cursor: 'pointer' }}
                            >
                                <td style={{ textAlign: 'center' }}>
                                    <AvatarTabeUtil email={emails[item.name]} name={item.name} istfirma={true} />
                                </td>
                                <td>
                                    <Typography fontWeight="md">{item.name}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-sm">{emails[item.name] || "-"}</Typography>
                                </td>
                                <td>
                                    <Chip size="sm" variant="soft" color="primary">Lieferant</Chip>
                                </td>
                            </tr>
                        ))}
                        {filteredList.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: 'var(--swiss-gray-500)' }}>
                                    Keine Lieferanten gefunden
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Box>

            {createLieferant && (
                <MaskProvider>
                    <LieferantenCreator close={close} />
                </MaskProvider>
            )}
        </Box>
    )
}

export default LieferantenVerwaltung
