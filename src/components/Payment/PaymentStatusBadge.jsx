import React, { useState, useEffect } from 'react';
import { Chip } from '@mui/joy';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircle';
import PendingOutlinedIcon from '@mui/icons-material/Pending';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmpty';
import { getInvoicePaymentStatus } from '../../Scripts/Filehandler';
import '../../styles/swiss.css';

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
                    // Google Green
                    bgcolor: '#CEEAD6',
                    color: '#0D652D',
                    icon: <CheckCircleOutlineIcon style={{ fontSize: '18px' }} />
                };
            case 'partial':
                return {
                    label: 'Teilzahlung',
                    // Google Yellow/Orange
                    bgcolor: '#FEF7E0',
                    color: '#E37400',
                    icon: <HourglassEmptyOutlinedIcon style={{ fontSize: '18px' }} />
                };
            case 'overdue':
                return {
                    label: 'Überfällig',
                    // Google Red
                    bgcolor: '#FAD2CF',
                    color: '#A50E0E',
                    icon: <ErrorOutlineIcon style={{ fontSize: '18px' }} />
                };
            case 'loading':
                return {
                    label: 'Lädt...',
                    bgcolor: 'var(--swiss-gray-100)',
                    color: 'var(--swiss-gray-500)',
                    icon: <PendingOutlinedIcon style={{ fontSize: '18px' }} />
                }
            case 'open':
            case 'Offen':
            case 'unpaid':
            default:
                return {
                    label: 'Ausstehend',
                    // Google Grey
                    bgcolor: '#F1F3F4',
                    color: '#5F6368',
                    icon: <PendingOutlinedIcon style={{ fontSize: '18px' }} />
                };
        }
    };

    const config = getStatusConfig(status);

    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 12px 4px 8px',
            borderRadius: '16px', // Full pill
            backgroundColor: config.bgcolor,
            color: config.color,
            fontSize: '12px',
            fontWeight: 500,
            userSelect: 'none'
        }}>
            {React.cloneElement(config.icon, { style: { fontSize: '16px', color: 'inherit' } })}
            <span>{config.label}</span>
        </div>
    );
}
