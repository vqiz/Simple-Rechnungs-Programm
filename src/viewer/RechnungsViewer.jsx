import { Box, Typography } from '@mui/joy';
import React from 'react'
import { useParams } from 'react-router-dom'
import Headline from '../components/Headline';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
function RechnungsViewer() {
    const {id} = useParams();
    return (
        <Box sx={{width: "100%", height: "100vh"}}>
            <Headline><ArrowCircleLeftOutlinedIcon/> {id}</Headline>
            





        </Box>
    )
}

export default RechnungsViewer
