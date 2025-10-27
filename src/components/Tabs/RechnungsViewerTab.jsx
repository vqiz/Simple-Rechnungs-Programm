import { Box, IconButton, Tab, TabList, TabPanel, Tabs, Tooltip, Typography } from '@mui/joy'
import React, { useEffect, useState } from 'react'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import RechnungsViewer from '../../viewer/RechnungsViewer';
import { handleLoadFile } from '../../Scripts/Filehandler';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
function RechnungsViewerTab({ tabtoOpen }) {
    const [tabs, setTabs] = useState(["R2025-9-29-7"]);
    const [value, setvalue] = useState(0);
    const [unternehmen, setUnternehmen] = useState();
    useEffect(() => {
        const itemstring = sessionStorage.getItem("R-Viewer-Tabs");
        const item = JSON.parse(itemstring);

        if (item) {
            if (tabtoOpen && tabtoOpen != "-1") {
                item.push(tabtoOpen);
                sessionStorage.setItem("R-Viewer-Tabs", JSON.stringify(item));
            }
            setTabs(item);
        } else if (tabtoOpen && tabtoOpen != "-1") {
            sessionStorage.setItem("R-Viewer-Tabs", JSON.stringify([tabtoOpen]));
            setTabs([tabtoOpen]);
        }
        const selected = sessionStorage.getItem("R-Viewer-Selected");
        console.log(selected);
        if (selected) {
            setvalue(Number(selected));
        }

        const fetch = async () => {
            const jsonstring = await handleLoadFile("settings/unternehmen.rechnix");
            const phrased = JSON.parse(jsonstring);
            if (jsonstring === "{}") {
                return;
            }
            setUnternehmen(phrased);
        }
        fetch();
    }, []);
    return (
        <Tabs
            orientation="horizontal"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                bgcolor: "background.body",
                "& .MuiTabs-indicator": { bgcolor: "primary.500", height: 3 },
            }}
            value={value}
            onChange={(e, newV) => {
                setvalue(newV);
                sessionStorage.setItem("R-Viewer-Selected", newV);
            }}
        >
            <TabList
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                flexShrink: 0,
                borderBottom: "1px solid",
                borderColor: "divider",
                backgroundColor: "background.body",
                position: "sticky",
                top: 0,
                zIndex: 10,
                overflowX: "auto",
                overflowY: "hidden",
                whiteSpace: "nowrap",
                "&::-webkit-scrollbar": { height: 6 },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0,0,0,0.3)",
                  borderRadius: 3,
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
                    minHeight: "5.1vh",
                    borderRadius: 2,
                    "&:hover": { bgcolor: "neutral.soft" },
                    "&.Mui-selected": { bgcolor: "primary.100", fontWeight: "bold" },
                    flex: "0 0 auto",
                  }}
                >
                  <ReceiptLongOutlinedIcon style={{ fontSize: 20 }} />
                  <Typography sx={{ fontSize: "1rem", flexGrow: 1 }}>{item}</Typography>
                  <Tooltip title="Schließen">
                    <IconButton
                      size="sm"
                      color="danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newTabs = tabs.filter((_, i) => i !== index);
                        setTabs(newTabs);
                        sessionStorage.setItem("R-Viewer-Tabs", JSON.stringify(newTabs));
                      }}
                    >
                      <CancelOutlinedIcon style={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                </Tab>
              ))}
            </TabList>
            <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
                {tabs.map((item, index) => (
                    <TabPanel sx={{ p: 0 }} value={index}>
                        <RechnungsViewer rechnung={item} unternehmen={unternehmen}/>
                    </TabPanel>
                ))}
            </Box>
        </Tabs>
    )
}

export default RechnungsViewerTab
