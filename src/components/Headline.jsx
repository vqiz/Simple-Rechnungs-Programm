import { Box, IconButton, Tooltip, Typography } from '@mui/joy'
import React from 'react'
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
function Headline({ children, back, onback }) {
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
      <Box sx={{ width: "50%", flexDirection: "row", display: "flex" }}>
        {
          back && (
            <Tooltip title="Zurück">
              <IconButton onClick={() => onback()} sx={{
                "&:hover": {
                  color: "#1976d2"
                }
              }}>
                <ArrowCircleLeftOutlinedIcon />
              </IconButton>
            </Tooltip>
          )
        }

        <Typography
          sx={{
            ml: '15px',
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#333',
            cursor: "default",
            userSelect: "none",
            mt: 0.35,
          }}
        >
          {children}
        </Typography>
      </Box>
    </Box>
  )
}

export default Headline
