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
import { markInvoiceAsPaid, markInvoiceAsPartiallyPaid } from '../../Scripts/Filehandler';

export default function PaymentModal({ open, onClose, invoiceNumber, invoiceTotal, onPaymentRecorded }) {
    const [paymentAmount, setPaymentAmount] = useState(invoiceTotal || 0);
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
    const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
    const [paymentType, setPaymentType] = useState('full'); // 'full' or 'partial'

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
                        Rechnungsbetrag: {invoiceTotal?.toFixed(2)} €
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
