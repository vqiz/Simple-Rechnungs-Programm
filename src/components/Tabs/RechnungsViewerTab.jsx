import { Box, IconButton, Tab, TabList, TabPanel, Tabs, Tooltip, Typography } from '@mui/joy'
import React, { useEffect, useState } from 'react'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import RechnungsViewer from '../../viewer/RechnungsViewer';
import { handleLoadFile } from '../../Scripts/Filehandler';

function RechnungsViewerTab({ tabtoOpen }) {
  const [tabs, setTabs] = useState([]);
  const [selectedTab, setSelectedTab] = useState(null);
  const [unternehmen, setUnternehmen] = useState();

  useEffect(() => {
    // Load tabs from sessionStorage
    const storedTabs = sessionStorage.getItem("R-Viewer-Tabs");
    let currentTabs = storedTabs ? JSON.parse(storedTabs) : [];

    // Add new tab if valid and not already present
    if (tabtoOpen && tabtoOpen !== "-1" && !currentTabs.includes(tabtoOpen)) {
      currentTabs.push(tabtoOpen);
      sessionStorage.setItem("R-Viewer-Tabs", JSON.stringify(currentTabs));
    }

    setTabs(currentTabs);

    // Determine selected tab
    let selected;
    if (tabtoOpen && tabtoOpen !== "-1") {
      selected = tabtoOpen;
    } else {
      const storedSelected = sessionStorage.getItem("R-Viewer-Selected");
      selected = storedSelected && currentTabs.includes(storedSelected) ? storedSelected : currentTabs[0] || null;
    }
    setSelectedTab(selected);

    // Load company settings
    const fetchUnternehmen = async () => {
      const jsonstring = await handleLoadFile("settings/unternehmen.rechnix");
      if (!jsonstring || jsonstring === "{}") return;
      setUnternehmen(JSON.parse(jsonstring));
    }
    fetchUnternehmen();
  }, [tabtoOpen]);

  const handleTabChange = (e, newValue) => {
    setSelectedTab(newValue);
    sessionStorage.setItem("R-Viewer-Selected", newValue);
  };

  const handleCloseTab = (tab) => {
    const newTabs = tabs.filter(t => t !== tab);
    setTabs(newTabs);
    sessionStorage.setItem("R-Viewer-Tabs", JSON.stringify(newTabs));

    // Adjust selected tab if the closed one was active
    if (selectedTab === tab) {
      setSelectedTab(newTabs[0] || null);
      sessionStorage.setItem("R-Viewer-Selected", newTabs[0] || "");
    }
  };

  return (
    <Tabs
      orientation="horizontal"
      variant="scrollable"
      scrollButtons="auto"
      value={selectedTab}
      onChange={handleTabChange}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "background.body",
        "& .MuiTabs-indicator": { bgcolor: "primary.500", height: 3 },
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
            <Typography sx={{ fontSize: "1rem", flexGrow: 1 }}>{tab}</Typography>
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
      </TabList>

      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        {tabs.map((tab) => (
          <TabPanel key={tab} value={tab} sx={{ p: 0 }}>
            <RechnungsViewer rechnung={tab} unternehmen={unternehmen} />
          </TabPanel>
        ))}
      </Box>
    </Tabs>
  );
}

export default RechnungsViewerTab;