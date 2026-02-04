import React from 'react';
import { Box, Chip, Typography } from '@mui/joy';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';

export default function PaymentStatusBadgeMock() {
    return (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', p: 2, border: '1px solid #ddd', borderRadius: '8px', my: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip variant="soft" color="neutral" size="sm" startDecorator={<PendingOutlinedIcon />}>Ausstehend</Chip>
                <Typography level="body-xs">Neu erstellt</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip variant="soft" color="warning" size="sm" startDecorator={<HourglassEmptyOutlinedIcon />}>Teilzahlung</Chip>
                <Typography level="body-xs">Teilweise bezahlt</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip variant="soft" color="success" size="sm" startDecorator={<CheckCircleOutlineIcon />}>Bezahlt</Chip>
                <Typography level="body-xs">Vollständig bezahlt</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip variant="soft" color="danger" size="sm" startDecorator={<ErrorOutlineIcon />}>Überfällig</Chip>
                <Typography level="body-xs">Frist überschritten</Typography>
            </Box>
        </Box>
    );
}
