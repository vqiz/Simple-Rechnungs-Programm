import { Box, Chip, Table, Typography } from '@mui/joy'
import React, { useEffect, useState } from 'react'
import Headline from '../Headline'
import { get_uRechnungen, handleLoadFile } from '../../Scripts/Filehandler';
import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined';
import { useNavigate } from 'react-router-dom';
import { getbrutto, getNetto } from '../../Scripts/ERechnungInterpretter';

function Dashboard() {
    const [u_rechnungen, setURechnung] = useState();
    const [count, setCount] = useState();
    const [ges, setGes] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        // Load invoices
        const fetchur = async () => {
            const data = await get_uRechnungen();
            setURechnung(data);
        };
        fetchur();

        // Load invoice count
        const fetchcount = async () => {
            const jsonstring = await handleLoadFile("fast_accsess/config.rechnix");
            const json = JSON.parse(jsonstring);
            setCount(json.count);
        };
        fetchcount();

        // Helper to calculate Umsatz per invoice
        const get_Umsatz = async (item) => {
        
            const string = await handleLoadFile("rechnungen/" + item.name);

            const json = JSON.parse(string);
               
            // Use either getBrutto or getNetto depending on your invoices
            return  getNetto(json);
            // return await getNetto(json); // Uncomment if your invoices don't include tax
        }

        // Calculate total Umsatz
        const fetchGesammtUmsatz = async () => {
            const filedata = await window.api.listfiles("rechnungen/");
            const uniqueFiles = [...new Set(filedata)]; // remove duplicates
            const values = await Promise.all(uniqueFiles.map(item => get_Umsatz(item)));
            console.log("bbg", values);
            let total = 0;
            for (let val of values) {
                total += Number(val);
            }
            setGes(Number(total / 2).toFixed(2));
        }
        fetchGesammtUmsatz();

    }, []);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
            }}
        >
            <Headline>Dashboard</Headline>
            <Box sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 4,
                mt: 2,
                p: 3
            }}>
                <Box sx={{
                    width: "94%",
                    display: "flex",
                    flexDirection: "column",
                    p: 3,
                    gap: 2,
                    bgcolor: "background.surface",
                    borderRadius: '12px',
                }}>
                    <Typography level="h4" sx={{ ml: 1 }}>Aktuelle Statistiken</Typography>
                    <Table size='md' sx={{
                        borderRadius: "12px",
                        width: "100%",
                        mt: 2
                    }}>
                        <thead>
                            <th>Information</th>
                            <th style={{ width: "20%" }}>Einheit</th>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Gesammter Umsatz</td>
                                <td>{ges}€</td>
                            </tr>
                            <tr>
                                <td>Monatlicher Umsatz</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Quatal Umsatz</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Anzahl der Gestellten Rechnungen</td>
                                <td>{count}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Box>
            </Box>

            <Box sx={{
                width: "97%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 4,
                mt: 2,
                p: 3,
                height: "40vh",
                maxHeight: "40vh",
            }}>
                <Box sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    p: 3,
                    gap: 2,
                    bgcolor: "background.surface",
                    borderRadius: '12px'
                }}>
                    <Typography level="h4" sx={{ ml: 1 }}>Unbezahlte Rechnugen</Typography>
                    <Box sx={{ height: "100%", overflowY: "auto" }}>
                        <Table size='md'
                            stickyHeader sx={{
                                borderRadius: "12px",
                                width: "100%",
                                mt: 2,
                            }}
                        >
                            <thead>
                                <tr>
                                    <th style={{ position: "sticky", top: 0, background: "var(--joy-palette-background-surface)", zIndex: 1 }}>R-Nummer</th>
                                    <th style={{ width: "20%", position: "sticky", top: 0, background: "var(--joy-palette-background-surface)", zIndex: 1 }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {u_rechnungen?.list?.map((item) => (
                                    <Box component={"tr"} onClick={() => navigate("/kunden-viewer/" + item.id)} sx={{
                                        transition: 'background-color 0.2s',
                                        '&:hover': {
                                            bgcolor: 'neutral.plainHoverBg',
                                        },
                                        cursor: "pointer"
                                    }} key={item.rechnung}>
                                        <td>{item.rechnung}</td>
                                        <td><Chip startDecorator={<FiberManualRecordOutlinedIcon />} color='danger'>Unbezhalt</Chip></td>
                                    </Box>
                                ))}
                            </tbody>
                        </Table>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default Dashboard;