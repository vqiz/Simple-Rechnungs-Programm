import React from 'react'
import Headline from '../Headline'
import { Box, Typography } from '@mui/joy'
import InfoCard from '../InfoCard'

function RechnungErstellen() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 0,
        position: 'relative'
      }}
    >
      <Headline>Rechnung erstellen</Headline>
      <Box sx={{ p: 2 }}>
        <InfoCard headline={"Information"}>
          Im Folgenden können Sie eine Rechnung erstellen. Wählen Sie einen Kunden aus oder erstellen Sie einen, falls dieser noch nicht existiert.
          <br/> Bestehende Rechnungen können sie unter dem jeweiligen Kunden finden. Diese sind unter <Typography sx={{fontWeight: "bold"}}>KundenVerwaltung</Typography> zu finden
        </InfoCard>
      </Box>



    </Box>
  )
}

export default RechnungErstellen
