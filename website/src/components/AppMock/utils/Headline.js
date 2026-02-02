import { Box, IconButton, Tooltip, Typography } from '@mui/joy'
import React from 'react'
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';

function Headline({ children, back, onback }) {
    return (
        <Box
            sx={{
                width: '100%',
                minHeight: '55px',

                display: 'flex',
                alignItems: 'center',
                borderBottom: '1px solid #ddd',
                bgcolor: "background.surface",
                padding: '0 16px' // Added slight padding for doc presentation
            }}
        >
            <Box sx={{ width: "100%", flexDirection: "row", display: "flex", alignItems: 'center' }}>
                {
                    back && (
                        <Tooltip title="Zurück">
                            <IconButton onClick={() => onback && onback()} sx={{
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
                        ml: back ? '15px' : '0px',
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
