import { Box, Card, Typography } from '@mui/joy'
import React from 'react'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
function InfoCard({headline,children}) {
  return (
        <Card
          variant="outlined"
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 2,
            bgcolor: '#f9f9f9'
          }}
        >
          <Box
            sx={{
              height: '100%',
              fontSize: '1.5rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <InfoOutlinedIcon />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 2 }}>
            <Typography level="title-md" sx={{ fontWeight: 500, color: '#333', cursor: "default", userSelect: "none"}}>
              {headline}
            </Typography>
            <Typography sx={{ color: '#555', fontSize: '0.95rem',  cursor: "default", userSelect: "none" }}>
                {children}
            </Typography>
          </Box>
        </Card>
  )
}

export default InfoCard
