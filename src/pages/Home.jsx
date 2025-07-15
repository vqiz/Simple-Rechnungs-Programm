import { Box } from '@mui/joy'
import { Tab, TabList, TabPanel, Tabs } from '@mui/joy'
import React from 'react'
import ReceiptIcon from '@mui/icons-material/Receipt'
import FindInPageIcon from '@mui/icons-material/FindInPage'
import InventoryIcon from '@mui/icons-material/Inventory'
import ProdukteVerwalten from '../components/Tabs/ProdukteVerwalten'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

function Home() {
  return (
    <Tabs sx={{ width: "100%", height: "100vh" }} orientation="vertical">
      <TabList>
        <Tab sx={{ fontWeight: 'bold', padding: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReceiptIcon />
            Rechnung erstellen
          </Box>
        </Tab>
        <Tab sx={{ fontWeight: 'bold', padding: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FindInPageIcon />
            Bestehende Rechnung abrufen
          </Box>
        </Tab>
        <Tab sx={{ fontWeight: 'bold', padding: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InventoryIcon />
            Produkte verwalten
          </Box>
        </Tab>
        <Tab sx={{ fontWeight: 'bold', padding: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SettingsOutlinedIcon />
            Einstellungen
          </Box>
        </Tab>
      </TabList>
      <TabPanel value={0}>
        {/* Inhalt für Rechnung erstellen */}
      </TabPanel>
      <TabPanel value={1}>
        {/* Inhalt für bestehende Rechnung abrufen */}
      </TabPanel>
      <TabPanel value={2}>
        <ProdukteVerwalten />
      </TabPanel>
    </Tabs>
  )
}

export default Home
