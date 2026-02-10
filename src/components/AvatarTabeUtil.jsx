import { Avatar, Box } from '@mui/joy'
import React from 'react'
import FactoryOutlinedIcon from '@mui/icons-material/FactoryOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

function AvatarTabeUtil({ istfirma }) {
    return (
        <Avatar size="sm">
            {istfirma ? <FactoryOutlinedIcon /> : <AccountCircleOutlinedIcon />}
        </Avatar>
    )
}

export default AvatarTabeUtil
