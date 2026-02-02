import { Avatar, Box, Typography } from '@mui/joy'
import React from 'react'
import FactoryOutlinedIcon from '@mui/icons-material/FactoryOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

function AvatarTabeUtil({ name, email, istfirma }) {
    return (
        <Box component="td" sx={{ padding: '12px 16px' }}>
            <Box sx={{
                display: "flex", alignContent: "center", flexDirection: "row",
            }}>
                {
                    istfirma ? (
                        <Avatar size="lg">
                            <FactoryOutlinedIcon />
                        </Avatar>

                    ) : (
                        <Avatar size="lg">
                            <AccountCircleOutlinedIcon />
                        </Avatar>

                    )
                }
                <Box sx={{ display: "flex", flexDirection: "column", ml: 1, cursor: "pointer" }}>
                    <Typography level="body-md" sx={{ cursor: "pointer", userSelect: "none" }}>{name}</Typography>
                    <Typography sx={{ color: "darkgray", cursor: "pointer", userSelect: "none" }} level="body-sm">{email}</Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default AvatarTabeUtil
