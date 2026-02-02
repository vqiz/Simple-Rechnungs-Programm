import { Box, IconButton, Tab, TabList, TabPanel, Tabs, Tooltip, Typography, Table } from '@mui/joy'
import React, { useState } from 'react'
import MockFrame from './MockFrame';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import ForwardToInboxOutlinedIcon from '@mui/icons-material/ForwardToInboxOutlined';
// Mocking A4 dimensions
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const PAGE_PADDING_MM = 15;

export default function InvoicesMock() {
    const [tabs, setTabs] = useState(["R2024-10-09-1"]);
    const [selectedTab, setSelectedTab] = useState("R2024-10-09-1");

    const handleCloseTab = (tab) => {
        const newTabs = tabs.filter(t => t !== tab);
        setTabs(newTabs);
        if (selectedTab === tab) {
            setSelectedTab(newTabs[0] || null);
        }
    };

    const sidebarButtons = [
        { icon: <PersonOutlinedIcon />, label: "zum Kunden" },
        { icon: <PictureAsPdfOutlinedIcon />, label: "Als PDF exportieren" },
        { icon: <PrintOutlinedIcon />, label: "Drucken" },
        { icon: <SendOutlinedIcon />, label: "Als E-Rechnung exportieren" },
        { icon: <ForwardToInboxOutlinedIcon />, label: "Per Email weiterverschicken" },
        { icon: <DeleteOutlineOutlinedIcon />, label: "Löschen", color: 'danger' },
    ];

    const InvoiceContent = ({ rechnung }) => (
        <Box sx={{ width: "100%", minHeight: "100vh", pb: 6, background: "#f7f7f7", position: 'relative' }}>
            {/* Sidebar Buttons */}
            <Box
                sx={{
                    position: "fixed", // In MockFrame context this might need absolute relative to main? 
                    // But let's keep fixed for authenticity if MockFrame handles iframe isolation or similar.
                    // Actually in a mock component on a doc page, fixed might break out. changing to absolute.
                    position: "absolute",
                    right: 25,
                    top: "100px",
                    width: 80,
                    background: "linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)",
                    borderRadius: "20px",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingY: 2,
                    gap: 1.5,
                    zIndex: 20,
                }}
            >
                {sidebarButtons.map((item, idx) => (
                    <Tooltip key={idx} title={item.label} placement="left">
                        <IconButton
                            variant="soft"
                            color={item.color || 'primary'}
                            size="lg"
                            sx={{ borderRadius: "12px" }}
                        >
                            {item.icon}
                        </IconButton>
                    </Tooltip>
                ))}
            </Box>

            {/* A4 Page Mock */}
            <Box
                sx={{
                    width: '90%', // Scale down slightly for doc view
                    maxWidth: `${A4_WIDTH_MM}mm`,
                    minHeight: `${A4_HEIGHT_MM}mm`,
                    margin: '20px auto',
                    background: "#fff",
                    borderRadius: "6px",
                    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                    padding: `${PAGE_PADDING_MM}mm`,
                    display: "flex",
                    flexDirection: "column",
                    boxSizing: "border-box",
                }}
            >
                {/* Header Mock */}
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
                    <Typography level="h2">Musterfirma GmbH</Typography>
                    {/* Logo placeholder */}
                    <Box sx={{ width: 100, height: 50, bgcolor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        Logo
                    </Box>
                </Box>

                {/* Customer Info */}
                <Box sx={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", mb: 2 }}>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography level='body-xs'>Herr</Typography>
                        <Typography level="body-xs">Max Mustermann</Typography>
                        <Typography level="body-xs">Musterstraße 1</Typography>
                        <Typography level='body-xs'>12345 Musterstadt</Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", minWidth: 120, textAlign: 'right' }}>
                        <Typography level='title-sm'>Rechnung</Typography>
                        <Typography level='body-xs'>Rechnungs-Nr: {rechnung}</Typography>
                        <Typography level='body-xs'>Datum: 09.10.2024</Typography>
                    </Box>
                </Box>

                {/* Table */}
                <Table size='sm' sx={{ mt: 4 }}>
                    <thead>
                        <tr>
                            <th>Pos</th>
                            <th>Bezeichnung</th>
                            <th style={{ textAlign: 'center' }}>Menge</th>
                            <th style={{ textAlign: 'right' }}>Einzel</th>
                            <th style={{ textAlign: 'right' }}>Gesamt</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Webdesign Dienstleistung</td>
                            <td style={{ textAlign: 'center' }}>10</td>
                            <td style={{ textAlign: 'right' }}>85.00€</td>
                            <td style={{ textAlign: 'right' }}>850.00€</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Hosting (Jahresgebühr)</td>
                            <td style={{ textAlign: 'center' }}>1</td>
                            <td style={{ textAlign: 'right' }}>120.00€</td>
                            <td style={{ textAlign: 'right' }}>120.00€</td>
                        </tr>
                        <tr>
                            <td colSpan={3}></td>
                            <td style={{ textAlign: 'right', fontWeight: 'bold' }}>Summe</td>
                            <td style={{ textAlign: 'right', fontWeight: 'bold' }}>970.00€</td>
                        </tr>
                    </tbody>
                </Table>
            </Box>
        </Box>
    );

    return (
        <MockFrame activePage="Rechnungen">
            <Tabs
                orientation="horizontal"
                variant="scrollable"
                scrollButtons="auto"
                value={selectedTab}
                onChange={(e, val) => setSelectedTab(val)}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    bgcolor: "background.body",
                    "& .MuiTabs-indicator": { bgcolor: "primary.500", height: 3 },
                }}
            >
                <TabList
                    sx={{
                        flexShrink: 0,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        backgroundColor: "background.body",
                    }}
                >
                    {tabs.map((tab) => (
                        <Tab
                            key={tab}
                            value={tab}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                textTransform: "none",
                                minWidth: 100,
                                borderRadius: 2,
                                "&.Mui-selected": { bgcolor: "primary.100", fontWeight: "bold" },
                            }}
                        >
                            <ReceiptLongOutlinedIcon style={{ fontSize: 20 }} />
                            <Typography>{tab}</Typography>
                            <Tooltip title="Schließen">
                                <IconButton
                                    size="sm"
                                    color="danger"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCloseTab(tab);
                                    }}
                                >
                                    <CancelOutlinedIcon style={{ fontSize: 18 }} />
                                </IconButton>
                            </Tooltip>
                        </Tab>
                    ))}
                    {/* Fake "Add/Search" tab could go here to show interaction */}
                </TabList>

                <Box sx={{ flexGrow: 1, overflowY: "auto", position: 'relative' }}>
                    {tabs.map((tab) => (
                        <TabPanel key={tab} value={tab} sx={{ p: 0 }}>
                            <InvoiceContent rechnung={tab} />
                        </TabPanel>
                    ))}
                    {tabs.length === 0 && (
                        <Box sx={{ p: 4, textAlign: 'center' }}>Keine offenen Rechnungen</Box>
                    )}
                </Box>
            </Tabs>
        </MockFrame>
    )
}
