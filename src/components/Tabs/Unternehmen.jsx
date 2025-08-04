import { Avatar, Box, Button, Divider, FormControl, FormLabel, Input, Typography } from '@mui/joy'
import React from 'react'
import Headline from '../Headline'
import InfoCard from '../InfoCard'
import FactoryIcon from '@mui/icons-material/Factory';

const labelstyle = { color: "gray" }
const boxlinestyle = { display: "flex", width: "auto", flexDirection: "row", gap: 2 }
function Unternehmen() {
  return (
    <Box
      sx={{
        height: '100vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 0,
        position: 'relative'
      }}
    >
      <Headline>Unternehmensdaten Verwalten</Headline>
      <Box sx={{ p: 2 }}>
        <InfoCard headline={"Information"}>Hier werden die Unternehmensdaten ihres <Typography sx={{ fontWeight: "bold" }}>eigenen</Typography> Unternehmens bearbeitet. Diese werden später auf Rechnungen bei <Typography sx={{ fontWeight: "bold" }}>Verkäufer</Typography> angezeigt. <br />
          Alle Pflichtfelder sind für eine E-Rechnung bzw. XRechnung nach geltendem Gesetzlichen Standart <Typography sx={{ fontWeight: "bold" }}>Unverzichtbar</Typography>! </InfoCard>
      </Box>

      <Typography sx={{ color: "gray", ml: 2 }} level="title-md">Unternehmensdaten</Typography>
      <Divider orientation="horizontal"></Divider>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
        <Box sx={boxlinestyle}>
          <FormControl sx={{ width: "74.6%" }}>
            <FormLabel sx={labelstyle}>Unternehmensname {"(Pflichtfeld)"}</FormLabel>
            <Input placeholder='z.B. Mustermann & Landes GMBH' />
          </FormControl>
          <FormControl sx={{ width: "auto" }}>
            <FormLabel sx={labelstyle}>Postleitzahl {"(Pflichtfeld)"}</FormLabel>
            <Input type='number' placeholder='z.B. 94315' />
          </FormControl>
        </Box>
        <Box sx={boxlinestyle}>
          <FormControl sx={{ width: "50%" }}>
            <FormLabel sx={labelstyle}>Straße {"(Pflichtfeld)"}</FormLabel>
            <Input placeholder='z.B. Musterstraße' />
          </FormControl>
          <FormControl sx={{ width: "23.5%" }}>
            <FormLabel sx={labelstyle}>Hausnummer {"(Pflichtfeld)"}</FormLabel>
            <Input placeholder='z.B. 92' />
          </FormControl>
          <FormControl>
            <FormLabel sx={labelstyle}>Stadt | Ort {"(Pflichtfeld)"}</FormLabel>
            <Input placeholder='z.B. Straubing' />
          </FormControl>
        </Box>
        <Box sx={boxlinestyle}>
          <FormControl>
            <FormLabel sx={labelstyle}>Länder Code | ISO-Code {"(Pflichtfeld)"} </FormLabel>
            <Input placeholder='z.B. DE' />
          </FormControl>
          <FormControl sx={{ width: "31%" }}>
            <FormLabel sx={labelstyle}>Umsatzsteuer-ID {"(Pflichtfeld)"}</FormLabel>
            <Input placeholder='z.B. DE123456789' />
          </FormControl>
          <FormControl sx={{ width: "39.5%" }}>
            <FormLabel sx={labelstyle}>Bankverbindung | für Sepa Lastschriften etc. {"(Pflichtfeld)"}</FormLabel>
            <Input placeholder='z.B. DE21 3704 0044 0532 0130 00' />
          </FormControl>
        </Box>
        <Box sx={boxlinestyle}>
          <FormControl sx={{ width: "50%" }}>
            <FormLabel sx={labelstyle}>Handelsregisternummer</FormLabel>
            <Input />
          </FormControl>
          <FormControl sx={{ width: "39.5%" }}>
            <FormLabel>Telefonnummer</FormLabel>
            <Input placeholder='+49 1515 1145345' />
          </FormControl>
        </Box>
        <Box sx={boxlinestyle}>
          <FormControl sx={{ width: "50%" }}>
            <FormLabel sx={labelstyle}>Emailadresse</FormLabel>
            <Input placeholder='z.B. org.example@gmail.com' />
          </FormControl>

        </Box>
      </Box>
      <Typography sx={{ color: "gray", ml: 2 }}>Kontaktperson</Typography>
      <Divider orientation="horizontal" />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
        <Box sx={boxlinestyle}>
          <FormControl sx={{ width: "50%" }}>
            <FormLabel sx={labelstyle}>Name</FormLabel>
            <Input placeholder='z.B Max Mustermann' />
          </FormControl>
          <FormControl sx={{ width: "39.5%" }}>
            <FormControl sx={labelstyle}>Emailadresse</FormControl>
            <Input placeholder='z.B max.musterman@t-online.de' />
          </FormControl>
        </Box>
        <Box sx={boxlinestyle}>
          <FormControl sx={{ width: "50%" }}>
            <FormControl sx={labelstyle}>Telefonnummer</FormControl>
            <Input placeholder='+49 1515 1145345' />
          </FormControl>

        </Box>
      </Box>

      <Typography sx={{ color: "gray", ml: 2 }}>Sonstiges</Typography>
      <Divider orientation="horizontal" />
      <Button sx={{ width: "10%", ml: 2 }}>
        Speichern
      </Button>
    </Box>

  )
}

export default Unternehmen
