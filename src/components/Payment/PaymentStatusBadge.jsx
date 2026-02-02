import React from 'react';
import { Chip } from '@mui/joy';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';

export default function PaymentStatusBadge({ status }) {
    const getStatusConfig = () => {
        switch (status) {
            case 'paid':
                return {
                    label: 'Bezahlt',
                    color: 'success',
                    icon: <CheckCircleOutlineIcon />
                };
            case 'partial':
                return {
                    label: 'Teilzahlung',
                    color: 'warning',
                    icon: <HourglassEmptyOutlinedIcon />
                };
            case 'overdue':
                return {
                    label: 'Überfällig',
                    color: 'danger',
                    icon: <ErrorOutlineIcon />
                };
            case 'unpaid':
            default:
                return {
                    label: 'Offen',
                    color: 'neutral',
                    icon: <PendingOutlinedIcon />
                };
        }
    };

    const config = getStatusConfig();

    return (
        <Chip
            variant="soft"
            color={config.color}
            size="sm"
            startDecorator={config.icon}
        >
            {config.label}
        </Chip>
    );
}
