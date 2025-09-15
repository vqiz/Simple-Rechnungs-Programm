import { Box, colors, Divider, List, ListItem, ListItemDecorator, Typography } from '@mui/joy'
import { Tab, TabList, TabPanel, Tabs } from '@mui/joy'
import React, { useState } from 'react'
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
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
function Home() {

  const TabProvider = ({ children }) => {
    return (
      <Tab
        sx={{
          justifyContent: 'flex-start',
          textAlign: 'left',
          fontWeight: 500,
          fontSize: '0.9rem',
          padding: '8px 12px',
          borderRadius: 'md',
          mx: 1,
          my: 0.5,
          textTransform: 'none',
          color: 'text.secondary',
          '&:hover': {
            bgcolor: 'neutral.100',
          },
          '&[aria-selected="true"]': {
            bgcolor: 'neutral.200',
            color: 'text.primary',
          },
        }}
      >
        {children}
      </Tab>
    )
  }
  const [value, setvalue] = useState(0);

  const ListPart = ({ title, children }) => {

    return (
      <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-start", width: "100%", flexDirection: "column", mb: 3 }}>
        <Typography
          id={title}
          level="body-xs"
          sx={{ textTransform: 'uppercase', fontWeight: 'lg', mb: 1, ml: 1 }}
        >
          {title}
        </Typography>
        <List size='sm' aria-labelledby={title}>
          {children}
        </List>
      </Box>
    )
  }



  return (
    <Tabs
      sx={{ width: "100%",minHeight: "100vh", bgcolor: "background.body", color: "#333", fontFamily: "Arial, sans-serif", boxShadow: "sm", borderRadius: "md" }}
      orientation="vertical"
      value={value}
    >
      <TabList sx={{ bgcolor: "#ffffff", borderRight: "1px solid", borderColor: "divider", px: 0, py: 1, display: "flex", alignItems: "center", minWidth: "220px", userSelect: "none" }}>
        <Typography startDecorator={<NearMeOutlinedIcon />} sx={{ fontSize: '1.25rem', mt: 0.7, fontWeight: "bold", mb: 1.387 }}>Navigation</Typography>
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mb: 2 }}><Divider sx={{ width: "90%" }} orientation="horizontal" /></Box>
        <ListPart title={"Allgemein"}>
          <ListItem >
            <Box onClick={() => setvalue(0)}>
              <Typography
                level="body-xs"
                startDecorator={<ReceiptIcon />}
                sx={{ "&:hover": { color: "primary.plainColor" }, cursor: "pointer", color: value == 0 ? "primary.plainColor": "" }}
              >
                Rechnung erstellen
              </Typography>
            </Box>
          </ListItem>
        </ListPart>
        <ListPart title={"Verwaltung"}>
          <ListItem>
            <Box onClick={() => setvalue(1)}>
              <Typography
                level='body-xs'
                startDecorator={<FindInPageIcon />}
                sx={{ "&:hover": { color: "primary.plainColor" }, cursor: "pointer", color: value == 1 ? "primary.plainColor": ""   }}
              >
                Rechnung suchen
              </Typography>
            </Box>
          </ListItem>
          <ListItem>
            <Box onClick={() => setvalue(2)}>
              <Typography
                level='body-xs'
                startDecorator={<ContactPageOutlinedIcon />}
                sx={{ "&:hover": { color: "primary.plainColor" } , cursor: "pointer", color: value == 2 ? "primary.plainColor": ""  }}
              >
                Kundenverwaltung
              </Typography>
            </Box>
          </ListItem>
          <ListItem>
            <Box onClick={() => setvalue(3)}>
              <Typography
                level='body-xs'
                startDecorator={<InventoryIcon />}
                sx={{ "&:hover": { color: "primary.plainColor" }, cursor: "pointer", color: value == 3 ? "primary.plainColor": ""   }}
              >
                Produktverwaltung
              </Typography>
            </Box>
          </ListItem>
        </ListPart>
        <ListPart title={"Sonstiges"}>
          <ListItem>
            <Box onClick={() => setvalue(4)}>
              <Typography
                level='body-xs'
                startDecorator={<LeaderboardOutlinedIcon />}
                sx={{ "&:hover": { color: "primary.plainColor" }, cursor: "pointer", color: value == 4 ? "primary.plainColor": ""   }}
              >
                Datenverwaltung
              </Typography>
            </Box>
          </ListItem>
          <ListItem>
            <Box onClick={() => setvalue(5)}>
              <Typography
                level='body-xs'
                startDecorator={<SettingsOutlinedIcon />}
                sx={{ "&:hover": { color: "primary.plainColor" }, cursor: "pointer", color: value == 5 ? "primary.plainColor": ""   }}
              >
                Settings
              </Typography>
            </Box>
          </ListItem>
        </ListPart>
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
