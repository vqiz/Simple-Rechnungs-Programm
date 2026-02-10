import { Box, Card, Typography } from '@mui/joy'
import React from 'react'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import '../styles/swiss.css';

function InfoCard({ headline, children }) {
  return (
    <Card
      variant="soft"
      color="primary"
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'start', // Align start for multi-line text
        padding: '16px',
        bgcolor: 'var(--md-sys-color-secondary)', // Light blue bg
        border: 'none',
        borderRadius: '12px',
        gap: '16px',
        boxShadow: 'none',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'var(--md-sys-color-on-secondary)',
          mt: '2px' // Optical alignment with title
        }}
      >
        <InfoOutlinedIcon />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Typography level="title-md" sx={{
          fontWeight: 500,
          color: 'var(--md-sys-color-on-secondary)', // Darker blue text
          fontSize: '14px',
          lineHeight: '20px'
        }}>
          {headline}
        </Typography>
        <Typography sx={{
          color: 'var(--md-sys-color-on-secondary-container)',
          fontSize: '13px',
          lineHeight: '20px'
        }}>
          {children}
        </Typography>
      </Box>
    </Card>
  )
}

export default InfoCard
