import { Box, Typography } from '@mui/joy';
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Headline from '../components/Headline';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
function RechnungsViewer() {
    const {kid,id} = useParams();
    const navigate = useNavigate();
    function onb(){
        navigate("/kunden-viewer/" + kid);
    }
    return (
        <Box sx={{width: "100%", height: "100vh"}}>
            <Headline back={!(Number(kid) == -1)} onback={onb}> {id}</Headline>
             





        </Box>
    )
}

export default RechnungsViewer
