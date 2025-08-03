import { Avatar, Box, FormControl, FormLabel, Input, Typography } from '@mui/joy'
import React from 'react'
import Headline from '../Headline'
import InfoCard from '../InfoCard'
import FactoryIcon from '@mui/icons-material/Factory';


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
    </Box>
 
  )
}

export default Unternehmen
