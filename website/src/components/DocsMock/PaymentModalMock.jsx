import React from 'react';
import {
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

export default function PaymentModalMock() {
    const invoiceNumber = "R2024-2-1-42";
    const invoiceTotal = 1250.00;
    const paymentAmount = 1250.00;
    const paymentDate = "2024-02-01";
    const paymentMethod = "bank_transfer";
    const paymentType = "full";

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <ModalDialog
                variant="outlined"
                sx={{
                    borderRadius: "md",
                    width: "600px",
                    maxWidth: "90vw",
                    position: 'static',
                    transform: 'none',
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
                        <Select value={paymentType}>
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
                            />
                        </FormControl>
                    </Box>

                    <FormControl>
                        <FormLabel>Zahlungsmethode</FormLabel>
                        <Select value={paymentMethod}>
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
                        variant='outlined'
                        color="neutral"
                    >
                        Abbrechen
                    </Button>

                    <Button
                        color="success"
                        variant='solid'
                    >
                        Zahlung erfassen
                    </Button>
                </Box>
            </ModalDialog>
        </div>
    );
}
