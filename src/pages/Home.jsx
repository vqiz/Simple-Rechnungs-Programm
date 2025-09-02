import { Box } from '@mui/joy'
import { Tab, TabList, TabPanel, Tabs } from '@mui/joy'
import React from 'react'
import ReceiptIcon from '@mui/icons-material/Receipt'
import FindInPageIcon from '@mui/icons-material/FindInPage'
import InventoryIcon from '@mui/icons-material/Inventory'
import ProdukteVerwalten from '../components/Tabs/ProdukteVerwalten'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ContactPageOutlinedIcon from '@mui/icons-material/ContactPageOutlined';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import Unternehmen from '../components/Tabs/Unternehmen'
import RechnungErstellen from '../components/Tabs/RechnungErstellen'
import KundenVerwaltung from '../components/Tabs/KundenVerwaltung'
function Home() {

  const TabProvider = ({ children }) => {
    return (
      <Tab
        sx={{
          justifyContent: 'flex-start',
          textAlign: 'left',
          fontWeight: 500,
          fontSize: '1rem',
          padding: '12px 16px',
          borderRadius: '6px',
          mx: 1,
          my: 0.5,
          textTransform: 'none',
          color: '#333',
          '&:hover': {
            bgcolor: '#f0f0f0',
          },
          '&[aria-selected="true"]': {
            bgcolor: '#e0e0e0',
            color: '#000',
          },
        }}
      >
        {children}
      </Tab>
    )
  }


  return (
    <Tabs
      sx={{ width: "100%", height: "100vh", bgcolor: "#f9f9f9", color: "#333", fontFamily: "Arial, sans-serif" }}
      orientation="vertical"
    >
      <TabList sx={{ bgcolor: "#ffffff", borderRight: "1px solid #ddd" }}>
        <TabProvider>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReceiptIcon />
            Rechnung erstellen
          </Box>
        </TabProvider>
        <TabProvider>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FindInPageIcon />
            Bestehende Rechnung abrufen
          </Box>
        </TabProvider>
        <TabProvider>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ContactPageOutlinedIcon />
            Kundenverwaltung
          </Box>
        </TabProvider>
        <TabProvider>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InventoryIcon />
            Produkte verwalten
          </Box>
        </TabProvider>
        <TabProvider>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LeaderboardOutlinedIcon />
            Unternehmensdaten
          </Box>
        </TabProvider>
        <TabProvider>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SettingsOutlinedIcon />
            Einstellungen
          </Box>
        </TabProvider>
      </TabList>
      <TabPanel sx={{ p: 0, overflowY: "auto" }} value={0}>
        <RechnungErstellen />
      </TabPanel>
      <TabPanel sx={{ p: 0, overflowY: "auto" }} value={2}>
        <KundenVerwaltung />
      </TabPanel>
      <TabPanel sx={{ p: 0 }} value={3}>
        <ProdukteVerwalten />
      </TabPanel>
      <TabPanel sx={{ p: 0, overflowY: "auto" }} value={4}>
        <Unternehmen />
      </TabPanel>
    </Tabs>
  )
}

export default Home
