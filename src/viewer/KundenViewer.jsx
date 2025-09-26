import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getKunde } from '../Scripts/Filehandler';
import { Box } from '@mui/joy';

function KundenViewer() {
 const {id} = useParams();
 const [kunde, setkunde] = useState();
 useEffect(() => {
    setkunde(getKunde(id));
 },[]);


  return (
    <Box sx={{width: "100%", minheight: "100vh", display: "flex", overflowY: "auto", flexDirection: "row"}}>
      <Box sx={{ flex: 1 }}>

      </Box>

    </Box>
  )
}

export default KundenViewer
