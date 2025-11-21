import { Box, IconButton, Tooltip } from '@mui/joy';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Headline from '../components/Headline';
import FilePdfViewer from './FilePdfViewer';
import FileXRechnungViewer from './FileXRechnungViewer';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { handleLoadFile, handleSaveFile } from '../Scripts/Filehandler';
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
    const sidebarButtons = [
        { icon: <DeleteOutlineOutlinedIcon />, label: "Löschen", color: 'danger', click: () => del() },
    ];
    async function del(){
        const phrase = await handleLoadFile("lieferanten/" + kundenid);
        const json = JSON.parse(phrase);
        console.log("acac", json);
        json.rechnungen = json.rechnungen.filter((i) => Number(i.id) != Number(data.id));
        await handleSaveFile("lieferanten/" + kundenid, JSON.stringify(json));
        await window.api.delFile("lieferantenrechnungen/" + data.id);
        navBack();
    }
    return (
        <Box>
            <Headline onback={navBack} back={true}>{data?.name}</Headline>
            <Box sx={{ width: "100%", height: "calc(100vh - 55px)", display: "flex", overflowY: "auto", flexDirection: "row" }}>
                {
                    data?.type === "PDF" ? (
                        <FilePdfViewer data={data} />
                    ) : (
                        <FileXRechnungViewer d={data} />
                    )
                }
                {/* Sidebar Buttons */}
                <Box
                    sx={{
                        position: "fixed",
                        right: 25,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 80,
                        background: "linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)",
                        borderRadius: "20px",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        paddingY: 2,
                        gap: 1.5,
                        zIndex: 20,
                        "&:hover": { boxShadow: "0 12px 24px rgba(0,0,0,0.25)", transition: "box-shadow 0.3s ease" },
                    }}
                >
                    {sidebarButtons.map((item, idx) => (
                        <Tooltip key={idx} title={item.label} placement="left">
                            <IconButton
                                variant="soft"
                                color={item.color}
                                size="lg"
                                onClick={item.click}
                                sx={{ borderRadius: "12px", transition: "all 0.2s ease", "&:hover": { transform: "scale(1.1)" } }}
                            >
                                {item.icon}
                            </IconButton>
                        </Tooltip>
                    ))}
                </Box>
            </Box>
        </Box>
    )
}

export default FileViewer
