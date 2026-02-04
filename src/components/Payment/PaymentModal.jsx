import React, { useState } from 'react';
import {
    Modal,
    ModalDialog,
    Typography,
    Divider,
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    Option,
    Chip
} from '@mui/joy';
import { markInvoiceAsPaid, markInvoiceAsPartiallyPaid, getInvoicePayments, removePayment } from '../../Scripts/Filehandler';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import HistoryIcon from '@mui/icons-material/History';
import { IconButton, Table, Sheet } from '@mui/joy';

export default function PaymentModal({ open, onClose, invoiceNumber, invoiceTotal, onPaymentRecorded }) {
    const [paymentAmount, setPaymentAmount] = useState(invoiceTotal || 0);
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
    const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
    const [paymentType, setPaymentType] = useState('full'); // 'full' or 'partial'
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

    React.useEffect(() => {
        if (open && invoiceNumber) {
            loadHistory();
        }
    }, [open, invoiceNumber]);

    const loadHistory = async () => {
        try {
            const h = await getInvoicePayments(invoiceNumber);
            setHistory(h);
        } catch (e) {
            console.error("Failed to load payment history", e);
        }
    };

    const handleDeletePayment = async (index) => {
        if (window.confirm("Möchten Sie diese Zahlung wirklich löschen?")) {
            await removePayment(invoiceNumber, index);
            loadHistory();
            if (onPaymentRecorded) onPaymentRecorded();
        }
    };

    const handleSubmit = async () => {
        const paymentData = {
            paymentAmount: parseFloat(paymentAmount),
            paymentDate: new Date(paymentDate).toISOString(),
            paymentMethod
        };

        try {
            if (paymentType === 'full' || parseFloat(paymentAmount) >= invoiceTotal) {
                await markInvoiceAsPaid(invoiceNumber, paymentData);
            } else {
                await markInvoiceAsPartiallyPaid(invoiceNumber, paymentData);
            }

            if (onPaymentRecorded) {
                onPaymentRecorded();
            }
            onClose();
        } catch (error) {
            console.error('Error recording payment:', error);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog
                variant="outlined"
                sx={{
                    borderRadius: "md",
                    width: "600px",
                    maxWidth: "90vw",
                }}
            >
                <Typography level='h3' mb={1}>
                    Zahlung erfassen
                </Typography>
                <Divider />

                <Box sx={{ mt: 2, mb: 2 }}>
                    <Typography level="body-sm" sx={{ mb: 1 }}>
                        Rechnung: <Chip variant="soft" size="sm">{invoiceNumber}</Chip>
                    </Typography>
                    <Typography level="body-sm" fontWeight="bold">
                        Rechnungsbetrag: {invoiceTotal ? Number(invoiceTotal).toFixed(2) : '0.00'} €
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControl>
                        <FormLabel>Zahlungsart</FormLabel>
                        <Select value={paymentType} onChange={(e, val) => {
                            setPaymentType(val);
                            if (val === 'full') {
                                setPaymentAmount(invoiceTotal);
                            }
                        }}>
                            <Option value="full">Vollständige Zahlung</Option>
                            <Option value="partial">Teilzahlung</Option>
                        </Select>
                    </FormControl>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl sx={{ flex: 1 }}>
                            <FormLabel>Betrag (€)</FormLabel>
                            <Input
                                type="number"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                                min="0"
                                max={invoiceTotal}
                                step="0.01"
                                disabled={paymentType === 'full'}
                            />
                        </FormControl>

                        <FormControl sx={{ flex: 1 }}>
                            <FormLabel>Zahlungsdatum</FormLabel>
                            <Input
                                type="date"
                                value={paymentDate}
                                onChange={(e) => setPaymentDate(e.target.value)}
                            />
                        </FormControl>
                    </Box>

                    <FormControl>
                        <FormLabel>Zahlungsmethode</FormLabel>
                        <Select value={paymentMethod} onChange={(e, val) => setPaymentMethod(val)}>
                            <Option value="bank_transfer">Banküberweisung</Option>
                            <Option value="cash">Bargeld</Option>
                            <Option value="card">Kartenzahlung</Option>
                            <Option value="paypal">PayPal</Option>
                            <Option value="other">Sonstige</Option>
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ mt: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Button
                            variant="plain"
                            color="neutral"
                            startDecorator={<HistoryIcon />}
                            onClick={() => setShowHistory(!showHistory)}
                            size="sm"
                        >
                            {showHistory ? "Historie ausblenden" : "Zahlungshistorie anzeigen"}
                        </Button>
                    </Box>

                    {showHistory && (
                        <Sheet variant="outlined" sx={{ borderRadius: 'sm', p: 1, maxHeight: 150, overflow: 'auto' }}>
                            {history.length > 0 ? (
                                <Table size="sm" stickyHeader>
                                    <thead>
                                        <tr>
                                            <th>Datum</th>
                                            <th>Betrag</th>
                                            <th>Methode</th>
                                            <th style={{ width: 50 }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((pay, idx) => (
                                            <tr key={idx}>
                                                <td>{new Date(pay.date).toLocaleDateString()}</td>
                                                <td>{Number(pay.amount).toFixed(2)} €</td>
                                                <td>{pay.method}</td>
                                                <td>
                                                    <IconButton size="sm" color="danger" variant="plain" onClick={() => handleDeletePayment(pay.index)}>
                                                        <DeleteOutlineIcon />
                                                    </IconButton>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            ) : (
                                <Typography level="body-xs" textAlign="center" p={2}>Keine Zahlungen vorhanden</Typography>
                            )}
                        </Sheet>
                    )}
                </Box>

                <Box
                    sx={{
                        width: "100%",
                        mt: 3,
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Button
                        onClick={onClose}
                        variant='outlined'
                        color="neutral"
                    >
                        Abbrechen
                    </Button>

                    <Button
                        onClick={handleSubmit}
                        color="success"
                        variant='solid'
                    >
                        Zahlung erfassen
                    </Button>
                </Box>
            </ModalDialog>
        </Modal>
    );
}
