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
import NotificationImportantOutlinedIcon from '@mui/icons-material/NotificationImportantOutlined';
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
        { icon: <NotificationImportantOutlinedIcon />, label: "Mahnung erstellen", color: 'warning' },
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
                    position: "absolute",
                    right: 25,
                    top: "50%",
                    transform: "translateY(-50%)",
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
                    "&:hover": { boxShadow: "0 12px 24px rgba(0,0,0,0.25)", transition: "box-shadow 0.3s ease" },
                }}
            >
                {sidebarButtons.map((item, idx) => (
                    <Tooltip key={idx} title={item.label} placement="left">
                        <IconButton
                            variant="soft"
                            color={item.color || 'primary'}
                            size="lg"
                            sx={{ borderRadius: "12px", transition: "all 0.2s ease", "&:hover": { transform: "scale(1.1)" } }}
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
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, minHeight: 0 }}>
                    <Typography level="h2" sx={{ maxWidth: "60%" }}>Musterfirma GmbH</Typography>
                    {/* Logo placeholder */}
                    <Box sx={{ width: 'auto', height: 150, bgcolor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
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
                    <Box sx={{ display: "flex", flexDirection: "column", minWidth: 120 }}>
                        <Typography level='title-sm'>Rechnung</Typography>
                        <Typography level='body-xs'>Rechnungs-Nr: {rechnung.split("-")[3]}</Typography>
                        <Typography level='body-xs'>Kunden-Nr: K001</Typography>
                        <Typography level='body-xs'>Ausstellungsdatum: 09.10.2024</Typography>
                        <Typography level='body-xs'>Seite 1 von 1</Typography>
                    </Box>
                </Box>

                {/* Table */}
                <Table size='sm' sx={{ mt: 4, bgcolor: "white", borderRadius: "10px", borderCollapse: 'collapse', width: '100%', tableLayout: 'fixed' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '10%', textAlign: 'center', borderBottom: '2px solid #000', padding: '3mm 2mm', fontWeight: 700, fontSize: '1em', background: "#f7f7fa" }}>Position</th>
                            <th style={{ width: '40%', textAlign: 'left', borderBottom: '2px solid #000', padding: '3mm 2mm', fontWeight: 700, fontSize: '1em', background: "#f7f7fa" }}>Bezeichnung</th>
                            <th style={{ width: '15%', textAlign: 'center', borderBottom: '2px solid #000', padding: '3mm 2mm', fontWeight: 700, fontSize: '1em', background: "#f7f7fa" }}>Menge</th>
                            <th style={{ width: '15%', textAlign: 'right', borderBottom: '2px solid #000', padding: '3mm 2mm', fontWeight: 700, fontSize: '1em', background: "#f7f7fa" }}>Einzelpreis</th>
                            <th style={{ width: '20%', textAlign: 'right', borderBottom: '2px solid #000', padding: '3mm 2mm', fontWeight: 700, fontSize: '1em', background: "#f7f7fa" }}>Gesamt</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid #e0e0e0', background: "#fff" }}>
                            <td style={{ textAlign: 'center', padding: '2mm', fontWeight: 500 }}>1</td>
                            <td style={{ textAlign: 'left', padding: '2mm' }}>Webdesign Dienstleistung</td>
                            <td style={{ textAlign: 'center', padding: '2mm' }}>10x</td>
                            <td style={{ textAlign: 'right', padding: '2mm' }}>85.00€</td>
                            <td style={{ textAlign: 'right', padding: '2mm' }}>850.00€</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e0e0e0', background: "#fafbfc" }}>
                            <td style={{ textAlign: 'center', padding: '2mm', fontWeight: 500 }}>2</td>
                            <td style={{ textAlign: 'left', padding: '2mm' }}>Hosting (Jahresgebühr)</td>
                            <td style={{ textAlign: 'center', padding: '2mm' }}>1x</td>
                            <td style={{ textAlign: 'right', padding: '2mm' }}>120.00€</td>
                            <td style={{ textAlign: 'right', padding: '2mm' }}>120.00€</td>
                        </tr>
                        <tr>
                            <td colSpan={2}></td>
                            <td style={{ textAlign: 'center', padding: '2mm' }}>Netto</td>
                            <td colSpan={1}></td>
                            <td style={{ textAlign: 'right', padding: '2mm' }}>970.00€</td>
                        </tr>
                        <tr>
                            <td colSpan={2}></td>
                            <td style={{ textAlign: 'center', padding: '2mm' }}>zzgl. USt.</td>
                            <td colSpan={1}></td>
                            <td style={{ textAlign: 'right', padding: '2mm' }}>184.30€</td>
                        </tr>
                        <tr>
                            <td colSpan={2}></td>
                            <td style={{ textAlign: 'center', padding: '2mm', fontWeight: 'bold' }}>Brutto</td>
                            <td colSpan={1}></td>
                            <td style={{ textAlign: 'right', padding: '2mm', fontWeight: 'bold' }}>1154.30€</td>
                        </tr>
                    </tbody>
                </Table>



                {/* Spacer to push footer to bottom */}
                <Box sx={{ flex: 1 }} />

                {/* Footer */}
                <Box sx={{ width: "100%", mt: 2 }}>
                    <Typography level="body-xs" sx={{ fontSize: "10px" }} fontWeight="bold">Musterfirma GmbH</Typography>
                    <Typography level='body-xs' sx={{ fontSize: "10px" }}>Musterstraße 42, 80331 München</Typography>
                    <Typography level='body-xs' sx={{ fontSize: "10px" }}>Tel: +49 89 12345678, Email: info@musterfirma.de, www.musterfirma.de</Typography>
                    <Typography level='body-xs' sx={{ fontSize: "10px" }}>Musterbank AG, IBAN: DE89 3704 0044 0532 0130 00</Typography>
                    <Typography level='body-xs' sx={{ fontSize: "10px" }}>Kontoinhaber: Musterfirma GmbH, BIC: COBADEFFXXX</Typography>
                    <Typography level='body-xs' sx={{ fontSize: "10px" }}>HRB 12345, Inhaber: Max Muster, USt-ID-NR: DE123456789, Steuer-Nr: 123/456/78900</Typography>
                    <Typography level='body-xs' sx={{ fontSize: "10px" }}>Zu zahlen innerhalb 14 Tagen nach Zustellung ohne Abzüge</Typography>
                </Box>
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
