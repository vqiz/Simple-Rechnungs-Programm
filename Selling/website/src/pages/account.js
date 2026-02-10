import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { Box, Typography, Button, Card, Table, Chip, Divider, Stack, Grid, CircularProgress, Alert, Container, Sheet } from '@mui/joy';
import Link from '@docusaurus/Link';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DownloadIcon from '@mui/icons-material/Download';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyIcon from '@mui/icons-material/Key';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptIcon from '@mui/icons-material/Receipt';

export default function Account() {
    const [accountData, setAccountData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAccountData();
    }, []);

    const fetchAccountData = async () => {
        try {
            const response = await fetch('/rechnix_api/auth/account', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include' // Important for session cookies
            });

            if (response.ok) {
                const data = await response.json();
                setAccountData(data);
            } else {
                const errorText = await response.text();
                console.error("Account fetch error:", response.status, errorText);

                if (response.status === 401 || response.status === 403) {
                    setError({ type: 'auth', message: `Nicht eingeloggt. Bitte melden Sie sich erneut an.` });
                } else {
                    setError({ type: 'general', message: `Fehler beim Laden: ${response.status}` });
                }
            }
        } catch (err) {
            console.error(err);
            setError({ type: 'network', message: "Verbindungsfehler: " + err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('rechnix_user');
        fetch('/rechnix_api/logout', { method: 'POST' });
        window.location.href = '/';
    };

    if (loading) {
        return (
            <Layout title="Mein Konto" noFooter>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <CircularProgress size="lg" variant="soft" />
                </Box>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout title="Mein Konto">
                <Container maxWidth="sm" sx={{ py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <ErrorOutlineIcon sx={{ fontSize: 60, color: 'danger.500', mb: 2 }} />
                    <Typography level="h3" mb={2}>Zugriff verweigert</Typography>
                    <Alert color="danger" variant="soft" sx={{ mb: 4, width: '100%' }}>{error.message}</Alert>

                    {error.type === 'auth' ? (
                        <Button component={Link} to="/login" size="lg" startDecorator={<LogoutIcon />}>Zur Anmeldung</Button>
                    ) : (
                        <Button onClick={fetchAccountData} variant="outlined">Erneut versuchen</Button>
                    )}
                </Container>
            </Layout>
        );
    }

    return (
        <Layout title="Mein Konto">
            <Box sx={{
                minHeight: '90vh',
                bgcolor: 'background.level1',
                py: 4
            }}>
                <Container maxWidth="lg">
                    {/* Header Section */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Box>
                            <Typography level="h2" component="h1" fontWeight="xl">Mein Konto</Typography>
                            <Typography level="body-md" textColor="text.tertiary">Verwalten Sie Ihre Lizenzen und Bestellungen.</Typography>
                        </Box>
                        <Button
                            onClick={handleLogout}
                            color="neutral"
                            variant="outlined"
                            startDecorator={<LogoutIcon />}
                            sx={{ '&:hover': { bgcolor: 'background.level2' } }}
                        >
                            Abmelden
                        </Button>
                    </Box>

                    <Grid container spacing={3}>
                        {/* Left Column: Profile & License */}
                        <Grid xs={12} md={4}>
                            <Stack spacing={3}>
                                {/* Profile Card */}
                                <Card variant="outlined" sx={{ boxShadow: 'sm' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                        <Box sx={{
                                            width: 48, height: 48, borderRadius: '50%',
                                            bgcolor: 'primary.100', color: 'primary.600',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <PersonIcon fontSize="large" />
                                        </Box>
                                        <Box>
                                            <Typography level="title-lg">{accountData?.email}</Typography>
                                            <Typography level="body-sm">Benutzer</Typography>
                                        </Box>
                                    </Box>
                                    <Divider />
                                    <Box sx={{ mt: 2 }}>
                                        <Typography level="body-xs" textTransform="uppercase" fontWeight="lg" letterSpacing="1px" mb={1}>Mitgliedschaft</Typography>
                                        <Chip color="primary" variant="soft" size="md">Standard</Chip>
                                    </Box>
                                </Card>

                                {/* License Card */}
                                <Card variant="outlined" sx={{ boxShadow: 'sm', bgcolor: 'primary.50', borderColor: 'primary.200' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <KeyIcon sx={{ color: 'primary.600' }} />
                                        <Typography level="title-lg" textColor="primary.800">Lizenzschlüssel</Typography>
                                    </Box>

                                    {accountData?.licenseKey ? (
                                        <>
                                            <Sheet variant="soft" color="primary" sx={{
                                                p: 2, borderRadius: 'md',
                                                fontFamily: 'monospace', fontSize: 'lg', fontWeight: 'bold',
                                                textAlign: 'center', border: '1px dashed', borderColor: 'primary.300',
                                                bgcolor: 'white'
                                            }}>
                                                {accountData.licenseKey}
                                            </Sheet>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, alignItems: 'center' }}>
                                                <Typography level="body-sm">Status:</Typography>
                                                <Chip
                                                    color={accountData.licenseStatus === 'Aktiv' ? 'success' : 'neutral'}
                                                    variant="solid"
                                                    startDecorator={accountData.licenseStatus === 'Aktiv' ? <CheckCircleIcon /> : null}
                                                >
                                                    {accountData.licenseStatus}
                                                </Chip>
                                            </Box>
                                            {accountData.hardwareId && (
                                                <Box sx={{ mt: 1 }}>
                                                    <Typography level="body-xs" textColor="text.tertiary">Gebunden an Hardware-ID:</Typography>
                                                    <Typography level="body-xs" fontFamily="monospace" sx={{ wordBreak: 'break-all' }}>{accountData.hardwareId}</Typography>
                                                </Box>
                                            )}
                                        </>
                                    ) : (
                                        <Alert color="warning" variant="soft">Keine aktive Lizenz gefunden.</Alert>
                                    )}
                                </Card>
                            </Stack>
                        </Grid>

                        {/* Right Column: Purchase History */}
                        <Grid xs={12} md={8}>
                            <Card variant="outlined" sx={{ height: '100%', boxShadow: 'sm' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <ReceiptIcon sx={{ color: 'text.secondary' }} />
                                    <Typography level="title-lg">Bestellhistorie & Downloads</Typography>
                                </Box>
                                <Divider sx={{ mb: 2 }} />

                                {accountData?.purchaseHistory?.length > 0 ? (
                                    <Table hoverRow stripe="odd" sx={{ '--TableCell-headBackground': 'transparent' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ width: '30%' }}>Typ</th>
                                                <th>Version</th>
                                                <th>Datum</th>
                                                <th>Status</th>
                                                <th style={{ textAlign: 'right' }}>Aktion</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {accountData.purchaseHistory.map((purchase) => (
                                                <tr key={purchase.id}>
                                                    <td>
                                                        <Typography fontWeight="md">
                                                            {purchase.type === 'LICENSE' ? 'Neulizenz' : 'Update'}
                                                        </Typography>
                                                    </td>
                                                    <td>{purchase.version || '-'}</td>
                                                    <td>{new Date(purchase.timestamp).toLocaleDateString('de-DE')}</td>
                                                    <td>
                                                        <Chip
                                                            size="sm"
                                                            variant="soft"
                                                            color={purchase.status === 'COMPLETED' ? 'success' : 'warning'}
                                                        >
                                                            {purchase.status}
                                                        </Chip>
                                                    </td>
                                                    <td style={{ textAlign: 'right' }}>
                                                        {purchase.type === 'UPDATE' && purchase.status === 'COMPLETED' ? (
                                                            <Button
                                                                component="a"
                                                                href={`/rechnix_api/updates/download/${purchase.version}`}
                                                                target="_blank"
                                                                size="sm"
                                                                variant="plain"
                                                                color="primary"
                                                                startDecorator={<DownloadIcon />}
                                                            >
                                                                Download
                                                            </Button>
                                                        ) : (
                                                            <Typography level="body-xs" textColor="text.tertiary">-</Typography>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <Box sx={{ py: 4, textAlign: 'center' }}>
                                        <Typography textColor="text.tertiary">Keine Bestellungen gefunden.</Typography>
                                        <Button component={Link} to="/#preise" variant="soft" color="primary" sx={{ mt: 2 }}>
                                            Jetzt Lizenz erwerben
                                        </Button>
                                    </Box>
                                )}
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
}
