import { Box, IconButton, Tab, TabList, TabPanel, Tabs, Tooltip, Typography } from '@mui/joy'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import RechnungsViewer from '../../viewer/RechnungsViewer';
import { handleLoadFile } from '../../Scripts/Filehandler';
import { handleSaveFile } from '../../Scripts/Filehandler';



function RechnungsViewerTab({ tabtoOpen }) {
  const { id } = useParams();
  const targetTab = tabtoOpen || id;

  const [tabs, setTabs] = useState([]);
  const [selectedTab, setSelectedTab] = useState(null);
  const [unternehmen, setUnternehmen] = useState();

  useEffect(() => {
    const loadTabs = async () => {
      // Load tabs from file
      const storedTabsString = await handleLoadFile("fast_accsess/tabs.rechnix");
      let currentTabs = [];
      if (storedTabsString && storedTabsString !== "{}") {
        currentTabs = JSON.parse(storedTabsString);
      }

      // Add new tab if valid and not already present
      if (targetTab && targetTab !== "-1" && !currentTabs.includes(targetTab)) {
        currentTabs.push(targetTab);
        await handleSaveFile("fast_accsess/tabs.rechnix", JSON.stringify(currentTabs));
      }

      setTabs(currentTabs);

      // Determine selected tab
      let selected;
      if (targetTab && targetTab !== "-1") {
        selected = targetTab;
      } else {
        selected = currentTabs[0] || null;
      }
      setSelectedTab(selected);
    };

    loadTabs();

    // Load company settings
    const fetchUnternehmen = async () => {
      const jsonstring = await handleLoadFile("settings/unternehmen.rechnix");
      if (!jsonstring || jsonstring === "{}") return;
      setUnternehmen(JSON.parse(jsonstring));
    }
    fetchUnternehmen();
  }, [targetTab]);

  const handleTabChange = (e, newValue) => {
    setSelectedTab(newValue);
  };

  const handleCloseTab = async (tab) => {
    const newTabs = tabs.filter(t => t !== tab);
    setTabs(newTabs);
    await handleSaveFile("fast_accsess/tabs.rechnix", JSON.stringify(newTabs));

    // Adjust selected tab if the closed one was active
    if (selectedTab === tab) {
      setSelectedTab(newTabs[0] || null);
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