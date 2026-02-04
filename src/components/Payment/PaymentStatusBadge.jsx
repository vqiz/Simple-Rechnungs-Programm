import React, { useState, useEffect } from 'react';
import { Chip } from '@mui/joy';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import { getInvoicePaymentStatus } from '../../Scripts/Filehandler';

export default function PaymentStatusBadge({ status: providedStatus, invoiceNumber }) {
    const [status, setStatus] = useState(providedStatus || 'loading');

    useEffect(() => {
        if (providedStatus) {
            setStatus(providedStatus);
            return;
        }

        if (invoiceNumber) {
            let isMounted = true;
            const fetchStatus = async () => {
                try {
                    const s = await getInvoicePaymentStatus(invoiceNumber);
                    if (isMounted) setStatus(s || 'unpaid');
                } catch (error) {
                    console.error("Failed to fetch payment status for", invoiceNumber, error);
                    if (isMounted) setStatus('unpaid');
                }
            };
            fetchStatus();
            return () => { isMounted = false; };
        }
    }, [providedStatus, invoiceNumber]);

    const getStatusConfig = (currentStatus) => {
        switch (currentStatus) {
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
            case 'loading':
                return {
                    label: 'Lädt...',
                    color: 'neutral',
                    icon: <PendingOutlinedIcon />
                }
            case 'open':
            case 'Offen':
            case 'unpaid':
            default:
                return {
                    label: 'Ausstehend',
                    color: 'neutral',
                    icon: <PendingOutlinedIcon />
                };
        }
    };

    const config = getStatusConfig(status);

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
