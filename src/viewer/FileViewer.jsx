import { Box } from '@mui/joy';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Headline from '../components/Headline';
import FilePdfViewer from './FilePdfViewer';
import FileXRechnungViewer from './FileXRechnungViewer';

function FileViewer() {
    //kundenid for navigation back
    const { item, kundenid } = useParams();
    const [data, setData] = useState();
    const navigate = useNavigate();
    useEffect(() => {
        //getting file data from session storage
        const storage = sessionStorage.getItem(item);
        const json = JSON.parse(storage);
        setData(json);
    }, [])
    const navBack = () => {
        navigate("/lieferanten-viewer/" + kundenid);
    }
    return (
        <Box>
            <Headline onback={navBack} back={true}>{data?.name}</Headline>
            <Box sx={{ width: "100%", height: "calc(100vh - 55px)", display: "flex", overflowY: "auto", flexDirection: "row" }}>
                {
                    data?.type === "PDF" ? (
                        <FilePdfViewer/>
                    ) : (
                        <FileXRechnungViewer/>
                    )
                }
            </Box>
        </Box>
    )
}

export default FileViewer
