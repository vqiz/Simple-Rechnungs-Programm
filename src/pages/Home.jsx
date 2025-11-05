import { Box, colors, Divider, List, ListItem, ListItemDecorator, Typography } from '@mui/joy'
import { Tab, TabList, TabPanel, Tabs } from '@mui/joy'
import React, { useEffect, useState } from 'react'
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
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useParams } from 'react-router-dom'
import ListPart from '../components/ListPart'
import RechnungsViewerTab from '../components/Tabs/RechnungsViewerTab'
import LieferantenVerwaltung from '../components/Tabs/LieferantenVerwaltung'

function Home() {
  const { selected, selectedUserRechnung } = useParams();
  useEffect(() => {
    if (selected !== undefined) {
      setvalue(Number(selected));
    }
  }, [])
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





  return (
    <Tabs
      sx={{ width: "100%", minHeight: "100vh", bgcolor: "background.body", color: "#333", fontFamily: "Arial, sans-serif", boxShadow: "sm", borderRadius: "md" }}
      orientation="vertical"
      value={value}
    >
      <TabList sx={{ bgcolor: "#ffffff", borderRight: "1px solid", borderColor: "divider", px: 0, py: 1, display: "flex", alignItems: "center", minWidth: "220px", userSelect: "none" }}>
        <Typography startDecorator={<NearMeOutlinedIcon />} sx={{ fontSize: '1.25rem', mt: 0.7, fontWeight: "bold", mb: 1.387 }}>Navigation</Typography>
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mb: 2 }}><Divider sx={{ width: "90%" }} orientation="horizontal" /></Box>
        <ListPart title={"Allgemein"}>
          <ListItem>
            <Box>
              <Typography
                level="body-xs"
                startDecorator={<DashboardIcon />}
                sx={{ "&:hover": { color: "primary.plainColor" }, cursor: "pointer", color: value == -1 ? "primary.plainColor" : "" }}
              >
                Dashboard
              </Typography>
            </Box>
          </ListItem>
          <ListItem >
            <Box onClick={() => setvalue(0)}>
              <Typography
                level="body-xs"
                startDecorator={<ReceiptIcon />}
                sx={{ "&:hover": { color: "primary.plainColor" }, cursor: "pointer", color: value == 0 ? "primary.plainColor" : "" }}
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
                sx={{ "&:hover": { color: "primary.plainColor" }, cursor: "pointer", color: value == 1 ? "primary.plainColor" : "" }}
              >
                Rechnungen anzeigen
              </Typography>
            </Box>
          </ListItem>
          <ListItem>
            <Box onClick={() => setvalue(2)}>
              <Typography
                level='body-xs'
                startDecorator={<ContactPageOutlinedIcon />}
                sx={{ "&:hover": { color: "primary.plainColor" }, cursor: "pointer", color: value == 2 ? "primary.plainColor" : "" }}
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
                sx={{ "&:hover": { color: "primary.plainColor" }, cursor: "pointer", color: value == 3 ? "primary.plainColor" : "" }}
              >
                Produktverwaltung
              </Typography>
            </Box>
          </ListItem>
        </ListPart>


        <ListPart title={"Buchaltung"}>
          <Box onClick={() => setvalue(5)}>
          <ListItem>
            <Typography
              level='body-xs'
              startDecorator={<AssuredWorkloadIcon />}
              sx={{ "&:hover": { color: "primary.plainColor" }, cursor: "pointer", color: value == 5 ? "primary.plainColor" : "" }}
            >
              Lieferantenrechnungen
            </Typography>
          </ListItem>
          </Box>
          <ListItem>
            <Typography
              level='body-xs'
              startDecorator={<AccountBalanceWalletIcon />}
              sx={{ "&:hover": { color: "primary.plainColor" }, cursor: "pointer", color: value == 6 ? "primary.plainColor" : "" }}
            >
              Export
            </Typography>
          </ListItem>
        </ListPart>
        <ListPart title={"Sonstiges"}>
          <ListItem>
            <Box onClick={() => setvalue(4)}>
              <Typography
                level='body-xs'
                startDecorator={<LeaderboardOutlinedIcon />}
                sx={{ "&:hover": { color: "primary.plainColor" }, cursor: "pointer", color: value == 4 ? "primary.plainColor" : "" }}
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
                sx={{ "&:hover": { color: "primary.plainColor" }, cursor: "pointer", color: value == 7 ? "primary.plainColor" : "" }}
              >
                Einstellungen
              </Typography>
            </Box>
          </ListItem>
        </ListPart>

      </TabList>
      <TabPanel sx={{ p: 0, overflowY: "auto" }} value={0}>
        <RechnungErstellen selUser={selectedUserRechnung} />
      </TabPanel>
      <TabPanel sx={{ p: 0, overflowY: "auto" }} value={1}>
        <RechnungsViewerTab tabtoOpen={selectedUserRechnung} />
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
      <TabPanel sx={{ p: 0, overflowY: "auto" }} value={5}>
        <LieferantenVerwaltung />
      </TabPanel>
    </Tabs>
  )
}

export default Home
