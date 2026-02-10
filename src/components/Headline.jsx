import { Box, IconButton, Tooltip, Typography } from '@mui/joy'
import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../styles/swiss.css';

function Headline({ children, back, onback }) {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '64px', // Standard height
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid var(--md-sys-color-outline)',
        padding: '0 24px',
        bgcolor: 'var(--md-sys-color-surface)',
        gap: '16px'
      }}
    >
      {
        back && (
          <Tooltip title="Zurück">
            <IconButton
              onClick={() => onback()}
              variant="plain"
              sx={{
                color: "var(--md-sys-color-on-surface)",
                "&:hover": { bgcolor: "var(--md-sys-color-secondary)" }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
        )
      }

      <Typography
        sx={{
          fontSize: '22px',
          fontWeight: 400, // Google Sans Regular
          color: 'var(--md-sys-color-on-surface)',
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
