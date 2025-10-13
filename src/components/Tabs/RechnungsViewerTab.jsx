import { Box, IconButton, Tab, TabList, Tabs, Tooltip, Typography } from '@mui/joy'
import React, { useEffect, useState } from 'react'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
function RechnungsViewerTab({ tabtoOpen }) {
    const [tabs, setTabs] = useState(["R2025-9-29-7", "aaa","bbb","ccc","ddd","eee","fff","hhh","iii","jjj"]);
    const [value, setvalue] = useState(0);
    useEffect(() => {
        const itemstring = sessionStorage.getItem("R-Viewer-Tabs");
        const item = JSON.parse(itemstring);

        if (item) {
            if (tabtoOpen) {
                item.push(tabtoOpen);
                sessionStorage.setItem("R-Viewer-Tabs", JSON.stringify(item));
            }
            setTabs(item);
        } else if (tabtoOpen) {
            sessionStorage.setItem("R-Viewer-Tabs", JSON.stringify([tabtoOpen]));
            setTabs([tabtoOpen]);
        }
        const selected = sessionStorage.getItem("R-Viewer-Selected");
        console.log(selected);
        if (selected) {
            setvalue(Number(selected));
        }
        
    }, []);
    return (
        <Tabs
            orientation="horizontal"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
                minHeight: "100vh",
                overflowX: "auto",
                bgcolor: "background.body",
                "& .MuiTabs-indicator": { bgcolor: "primary.500", height: 3 },
            }}
            value={value}
            onChange={(e,newV) => {setvalue(newV);
                sessionStorage.setItem("R-Viewer-Selected", newV);
            }}
        >
            <TabList
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "nowrap",
                    overflowX: "auto",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    maxWidth: "100%",
                    px: 1,
                    minWidth: "max-content",
                    "&::-webkit-scrollbar": {
                        height: 4,
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "rgba(0,0,0,0.3)",
                        borderRadius: 2,
                    },
                    "&::-webkit-scrollbar-track": {
                        backgroundColor: "transparent",
                    },
                }}
            >
                {tabs.map((item, index) => (
                    <Tab
                        key={index}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            textTransform: "none",
                            minWidth: 100,
                            px: 2,
                            py: 1,
                            minHeight: 54,
                            borderRadius: 2,
                            "&:hover": { bgcolor: "neutral.soft" },
                            "&.Mui-selected": {
                                bgcolor: "primary.100",
                                fontWeight: "bold",
                            },
                        }}
                        

                    >
                      
                            <ReceiptLongOutlinedIcon style={{ fontSize: 20 }} />
                            <Typography sx={{ fontSize: "1rem", flexGrow: 1 }}>{item}</Typography>
                            <Tooltip title="Schließen">
                                <IconButton
                                    size="sm"
                                    color="danger"
                                    onClick={() => {
                                        const newTabs = tabs.filter((_, i) => i !== index);
                                        setTabs(newTabs);
                                        sessionStorage.setItem(
                                            "R-Viewer-Tabs",
                                            JSON.stringify(newTabs)
                                        );
                                    }}
                                >
                                    <CancelOutlinedIcon style={{ fontSize: 18 }} />
                                </IconButton>
                            </Tooltip>
                        
                    </Tab>
                ))}
            </TabList>
        </Tabs>
    )
}

export default RechnungsViewerTab
