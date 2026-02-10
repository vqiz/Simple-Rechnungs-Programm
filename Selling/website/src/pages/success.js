
import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import { Box, Typography, Button, Sheet, CircularProgress } from '@mui/joy';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DownloadIcon from '@mui/icons-material/Download';
import { RECHNIX_CONFIG } from '../rechnix-config';
import { useLocation } from 'react-router-dom';

export default function Success() {
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const sessionId = query.get('session_id');

        if (sessionId) {
            // Verify session with Backend
            fetch('/rechnix_api/payment/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId })
            })
                .then(res => {
                    if (res.ok) {
                        setVerified(true);
                    } else {
                        setVerified(false);
                    }
                })
                .catch(err => {
                    console.error(err);
                    setVerified(false);
                })
                .finally(() => setLoading(false));

        } else {
            setLoading(false);
            setVerified(false);
        }
    }, [location]);

    return (
        <Layout title="Zahlung erfolgreich" description="Danke für Ihren Kauf">
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                textAlign: 'center',
                p: 4
            }}>
                {loading ? (
                    <CircularProgress />
                ) : verified ? (
                    <Sheet variant="outlined" sx={{ p: 6, borderRadius: 'lg', maxWidth: 600, boxShadow: 'lg' }}>
                        <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.500', mb: 2 }} />
                        <Typography level="h1" mb={2}>Vielen Dank!</Typography>
                        <Typography level="body-lg" mb={4}>
                            Ihre Zahlung war erfolgreich. Sie können Rechnix nun herunterladen.
                        </Typography>

                        <Button
                            component="a"
                            href={`/downloads/${RECHNIX_CONFIG.app.downloadFileName}`}
                            startDecorator={<DownloadIcon />}
                            size="lg"
                            color="primary"
                        >
                            Rechnix herunterladen ({RECHNIX_CONFIG.app.currentVersion})
                        </Button>

                        <Typography level="body-sm" mt={4} color="neutral">
                            Bitte bewahren Sie Ihre E-Mail Quittung als Kaufbeleg auf.
                        </Typography>
                    </Sheet>
                ) : (
                    <Sheet variant="outlined" sx={{ p: 4, borderRadius: 'md', maxWidth: 500 }}>
                        <Typography level="h3" color="danger" mb={2}>Fehler</Typography>
                        <Typography>
                            Wir konnten Ihre Zahlung nicht verifizieren oder Sie haben diese Seite direkt aufgerufen.
                        </Typography>
                        <Button component="a" href="/" sx={{ mt: 2 }} variant="soft">
                            Zur Startseite
                        </Button>
                    </Sheet>
                )}
            </Box>
        </Layout>
    );
}
