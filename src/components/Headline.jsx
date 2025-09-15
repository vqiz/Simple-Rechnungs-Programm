import { Box, Typography } from '@mui/joy'
import React from 'react'

function Headline({children}) {
  return (
      <Box
        sx={{
          width: '100%',
          minHeight: '55px',
          bgcolor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #ddd',
          bgcolor: "background.surface",
        }}
      >
        <Typography
          sx={{
            ml: '15px',
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#333',
            cursor: "default",
            userSelect: "none",
          }}
        >
          {children}
        </Typography>
      </Box>
  )
}

export default Headline
