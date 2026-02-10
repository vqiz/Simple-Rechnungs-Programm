import { Box, IconButton, Tab, TabList, TabPanel, Tabs, Tooltip, Typography } from '@mui/joy'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import CloseIcon from '@mui/icons-material/Close';
import RechnungsViewer from '../../viewer/RechnungsViewer';
import { handleLoadFile } from '../../Scripts/Filehandler';
import { handleSaveFile } from '../../Scripts/Filehandler';
import '../../styles/swiss.css';

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
      aria-label="Rechnungs Tabs"
      value={selectedTab}
      onChange={handleTabChange}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%", // Fit container
        bgcolor: "var(--md-sys-color-surface)",
        border: 'none',
      }}
    >
      <TabList
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          borderBottom: "1px solid var(--md-sys-color-outline)",
          backgroundColor: "var(--md-sys-color-surface)",
          padding: '0 4px',
          gap: '4px',
          "& .MuiTabs-indicator": {
            backgroundColor: "var(--md-sys-color-primary)",
            height: '3px',
            borderRadius: '3px 3px 0 0'
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
              gap: '8px',
              minHeight: '48px',
              padding: '0 16px',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--md-sys-color-on-surface-variant)',
              backgroundColor: 'transparent',
              border: 'none',
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px',
              "&:hover": {
                backgroundColor: 'var(--md-sys-color-surface-variant)',
              },
              "&.Mui-selected": {
                color: 'var(--md-sys-color-primary)',
                backgroundColor: 'var(--md-sys-color-secondary)', // Active tab bg? Or keep transparent with indicator
                // Google Material 3 tabs usually just have text color + indicator, or pill.
                // Let's use slight tint for active state plus indicator
                backgroundColor: 'rgba(26, 115, 232, 0.08)',
              },
            }}
          >
            <ReceiptLongOutlinedIcon style={{ fontSize: '18px' }} />
            <span>{tab}</span>
            <Tooltip title="Schließen">
              <IconButton
                size="sm"
                variant="plain"
                sx={{
                  ml: 1,
                  padding: '2px',
                  minWidth: '20px',
                  minHeight: '20px',
                  color: 'var(--md-sys-color-on-surface-variant)',
                  "&:hover": { color: 'var(--md-sys-color-on-surface)', bgcolor: 'rgba(0,0,0,0.05)' }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseTab(tab);
                }}
              >
                <CloseIcon style={{ fontSize: '16px' }} />
              </IconButton>
            </Tooltip>
          </Tab>
        ))}
      </TabList>

      <Box sx={{ flexGrow: 1, overflowY: "auto", bgcolor: 'var(--md-sys-color-background)' }}>
        {tabs.map((tab) => (
          <TabPanel key={tab} value={tab} sx={{ p: 0, height: '100%' }}>
            <RechnungsViewer rechnung={tab} unternehmen={unternehmen} />
          </TabPanel>
        ))}
        {tabs.length === 0 && (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'var(--md-sys-color-on-surface-variant)'
          }}>
            <ReceiptLongOutlinedIcon sx={{ fontSize: 64, opacity: 0.2, mb: 2 }} />
            <Typography level="h4" sx={{ opacity: 0.5 }}>Keine offenen Rechnungen</Typography>
          </Box>
        )}
      </Box>
    </Tabs>
  );
}

export default RechnungsViewerTab;