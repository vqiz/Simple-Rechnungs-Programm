import { Box, Typography } from '@mui/joy'
import React from 'react'
import Headline from '../Headline'
import InfoCard from '../InfoCard'

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
        <InfoCard headline={"Information"}>Hier werden die Unternehmensdaten ihres <Typography sx={{ fontWeight: "bold" }}>eigenen</Typography> Unternehmens bearbeitet. Diese werden später auf Rechnungen bei <Typography sx={{ fontWeight: "bold" }}>Verkäufer</Typography> angezeigt</InfoCard>
      </Box>


    </Box>
  )
}

export default Unternehmen
