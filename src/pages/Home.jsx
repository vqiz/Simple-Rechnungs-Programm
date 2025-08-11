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
function Home() {
  return (
    <Tabs
      sx={{ width: "100%", height: "100vh", bgcolor: "#f9f9f9", color: "#333", fontFamily: "Arial, sans-serif" }}
      orientation="vertical"
    >
      <TabList sx={{ bgcolor: "#ffffff", borderRight: "1px solid #ddd" }}>
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReceiptIcon />
            Rechnung erstellen
          </Box>
        </Tab>
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FindInPageIcon />
            Bestehende Rechnung abrufen
          </Box>
        </Tab>
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ContactPageOutlinedIcon />
            Kundenverwaltung
          </Box>
        </Tab>
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InventoryIcon />
            Produkte verwalten
          </Box>
        </Tab>
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LeaderboardOutlinedIcon />
            Unternehmensdaten 
          </Box>
        </Tab>
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
      <TabPanel sx={{ p: 0 }} value={3}>
        <ProdukteVerwalten />
      </TabPanel>
      <TabPanel sx={{p: 0, overflowY: "auto"}} value={4}>
          <Unternehmen/>
      </TabPanel>
    </Tabs>
  )
}

export default Home
