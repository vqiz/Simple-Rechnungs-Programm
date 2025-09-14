import { Box } from '@mui/joy';
import React from 'react'
//bgcolor: 'rgba(0, 0, 0, 0.5)',
function MaskProvider({children}) {
  return (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                
                zIndex: 10
            }}
        >
            <Box
                sx={{
                    boxShadow: 3,
                    zIndex: 11
                }}
            >
                {children}
            </Box>
        </Box>
  )
}
export default MaskProvider;