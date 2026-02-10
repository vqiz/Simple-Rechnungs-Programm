import React, { useState, useEffect } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { Box, Typography, Button, Checkbox, Card, Divider, Grid, Alert, Sheet, Stack, Chip } from '@mui/joy';
import { RECHNIX_CONFIG } from '../rechnix-config';
import { loadStripe } from '@stripe/stripe-js';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

// Initialize Stripe
const stripePromise = loadStripe(RECHNIX_CONFIG.stripe.publishableKey);

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Home() {
    const { siteConfig } = useDocusaurusContext();
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [error, setError] = useState(false);
    const [user, setUser] = useState(null);
    const [latestUpdateId, setLatestUpdateId] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('rechnix_user');
        if (stored) setUser(JSON.parse(stored));

        // Fetch latest update ID
        fetch('/rechnix_api/updates/latest')
            .then(res => {
                if (res.ok) return res.json();
                return null;
            })
            .then(data => {
                if (data && data.id) setLatestUpdateId(data.id);
            })
            .catch(err => console.error("Failed to fetch latest update", err));
    }, []);

    const handleCheckout = async (priceId, isUpdate = false) => {
        if (!user) {
            alert("Bitte loggen Sie sich zuerst ein oder registrieren Sie sich.");
            window.location.href = '/login';
            return;
        }

        if (!acceptedTerms) {
            setError(true);
            return;
        }
        setError(false);

        try {
            const endpoint = isUpdate ? '/payment/checkout/update' : '/payment/checkout/license';

            if (isUpdate && !latestUpdateId) {
                alert("Derzeit sind keine Updates verfügbar.");
                return;
            }

            const body = isUpdate ? { priceId, updateId: latestUpdateId } : { priceId };

            const response = await fetch(`/rechnix_api${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert("Fehler beim Starten des Bezahlvorgangs: " + JSON.stringify(data));
            }

        } catch (err) {
            console.error(err);
            alert("Verbindungsfehler: " + err.message);
        }
    };

    return (
        <Layout
            title={`Rechnix - ${siteConfig.tagline}`}
            description="Das einfache Rechnungsprogramm für macOS und Windows.">

            <Box component="main">
                {/* Hero Section */}
                <Box sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    py: { xs: 8, md: 12 },
                    textAlign: 'center',
                    background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)'
                }}>
                    <Container maxWidth="md">
                        <motion.div variants={containerVariants} initial="hidden" animate="visible">
                            <motion.div variants={itemVariants}>
                                <Typography level="h1" sx={{
                                    fontSize: { xs: '2.5rem', md: '4.5rem' },
                                    fontWeight: 800,
                                    mb: 2,
                                    letterSpacing: '-0.03em',
                                    color: '#0f172a'
                                }}>
                                    Rechnungen schreiben.<br />
                                    <span style={{ color: '#6366f1' }}>Ohne Abo. Ohne Cloud.</span>
                                </Typography>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <Typography level="title-lg" sx={{ mb: 4, maxWidth: '600px', mx: 'auto', color: '#64748b', fontSize: '1.25rem', lineHeight: 1.6 }}>
                                    Die einfache Software für Selbstständige auf Mac & Windows.
                                    Daten bleiben bei Ihnen. Einmal zahlen, immer nutzen.
                                </Typography>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 6 }}>
                                    <Button
                                        component={Link}
                                        to="#preise"
                                        size="lg"
                                        endDecorator={<ArrowForwardIcon />}
                                        sx={{
                                            borderRadius: '8px',
                                            px: 4,
                                            py: 1.5,
                                            fontSize: '1.1rem',
                                            fontWeight: 600,
                                            bgcolor: '#0f172a',
                                            color: '#ffffff',
                                            '&:hover': { bgcolor: '#1e293b', transform: 'translateY(-2px)' },
                                            transition: 'all 0.2s',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                        }}
                                    >
                                        Lizenz Kaufen
                                    </Button>
                                    <Button
                                        component={Link}
                                        to="/handbuch/dashboard"
                                        variant="outlined"
                                        size="lg"
                                        sx={{
                                            borderRadius: '8px',
                                            px: 4,
                                            py: 1.5,
                                            fontSize: '1rem',
                                            color: '#475569',
                                            borderColor: '#cbd5e1',
                                            '&:hover': { borderColor: '#94a3b8', color: '#1e293b', bgcolor: 'transparent' }
                                        }}
                                    >
                                        Handbuch ansehen
                                    </Button>
                                </Stack>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <Alert
                                    color="warning"
                                    variant="soft"
                                    startDecorator={<WarningIcon />}
                                    sx={{ display: 'inline-flex', textAlign: 'left', maxWidth: '500px', bgcolor: '#fffbeb', color: '#92400e', border: '1px solid #fcd34d' }}
                                >
                                    <Box>
                                        <Typography fontWeight="bold" textColor="inherit">Beta Version</Typography>
                                        <Typography level="body-sm" textColor="inherit">Diese Software befindet sich in der Entwicklung.</Typography>
                                    </Box>
                                </Alert>
                            </motion.div>
                        </motion.div>
                    </Container>
                </Box>

                <Divider />

                {/* Features Split */}
                <Container maxWidth="lg" sx={{ py: 10 }}>
                    <Grid container spacing={4} sx={{ mb: 8 }}>
                        {[
                            { title: "Einfach & Lokal", desc: "Ihre Daten bleiben auf Ihrem Gerät. Keine Cloud, kein Tracking. Volle Kontrolle.", icon: "🔒" },
                            { title: "Rechtssicher", desc: "Erfüllt alle Anforderungen an ordnungsgemäße Rechnungen (GoBD).", icon: "⚖️" },
                            { title: "Individuell", desc: "Passen Sie das Design an Ihre Marke an. Eigenes Logo, eigene Farben.", icon: "🎨" },
                            { title: "E-Rechnung", desc: "Zukunftssicher mit integriertem XRechnung Export für Behörden.", icon: "📄" }
                        ].map((f, i) => (
                            <Grid key={i} xs={12} md={6}>
                                <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                                    <Card variant="outlined" sx={{ height: '100%', p: 4, borderColor: '#e2e8f0', borderRadius: '12px', bgcolor: 'white', '&:hover': { borderColor: '#cbd5e1' } }}>
                                        <Typography level="h1" sx={{ fontSize: '2.5rem', mb: 2 }}>{f.icon}</Typography>
                                        <Typography level="h4" fontWeight="800" mb={1} sx={{ color: '#1e293b' }}>{f.title}</Typography>
                                        <Typography sx={{ color: '#64748b' }}>{f.desc}</Typography>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>

                {/* Pricing Section - Clean, Professional Design */}
                <Box id="preise" sx={{ py: 10, bgcolor: '#f8f9fa' }}>
                    <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
                        <Typography level="h1" fontSize="3rem" fontWeight="800" mb={2} sx={{ color: '#1e293b' }}>
                            Einmal kaufen. <span style={{ color: '#6366f1' }}>Für immer nutzen.</span>
                        </Typography>
                        <Typography level="body-lg" mb={8} sx={{ maxWidth: '600px', mx: 'auto', color: '#64748b' }}>
                            Keine versteckten Abos. Sie haben die volle Kontrolle darüber, wann sich ein Update für Sie lohnt.
                        </Typography>

                        <Grid container spacing={4} justifyContent="center" alignItems="flex-start">
                            {/* Full Version - The "Hero" Product */}
                            <Grid xs={12} md={5}>
                                <Card variant="outlined" sx={{
                                    p: 0,
                                    height: '100%',
                                    bgcolor: 'white',
                                    borderColor: '#e2e8f0',
                                    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    zIndex: 2,
                                    border: '1px solid #e2e8f0',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)'
                                    }
                                }}>
                                    {/* Header */}
                                    <Box sx={{ p: 4, bgcolor: 'white', borderBottom: '1px solid #f1f5f9' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                            <Typography level="title-sm" textTransform="uppercase" fontWeight="bold" letterSpacing="1px" sx={{ color: '#6366f1' }}>
                                                Vollversion
                                            </Typography>
                                            <Chip size="sm" variant="soft" color="primary" sx={{ bgcolor: '#e0e7ff', color: '#4338ca', fontWeight: 'bold' }}>BELIEBT</Chip>
                                        </Box>
                                        <Typography level="h2" fontSize="3.5rem" fontWeight="800" sx={{ color: '#0f172a' }}>
                                            {RECHNIX_CONFIG.stripe.products.fullVersion.amount.toFixed(2)}€
                                        </Typography>
                                        <Typography level="body-sm" sx={{ color: '#64748b' }}>einmalige Zahlung</Typography>

                                        <Button
                                            size="lg"
                                            fullWidth
                                            sx={{
                                                mt: 3,
                                                bgcolor: '#0f172a',
                                                color: 'white',
                                                borderRadius: '8px',
                                                fontSize: '1rem',
                                                fontWeight: 600,
                                                '&:hover': { bgcolor: '#1e293b' }
                                            }}
                                            onClick={() => handleCheckout(RECHNIX_CONFIG.stripe.products.fullVersion.priceId)}
                                        >
                                            Jetzt Lizenz sichern
                                        </Button>
                                    </Box>

                                    {/* Features */}
                                    <Box sx={{ p: 4 }}>
                                        <Typography level="title-md" fontWeight="bold" mb={2} sx={{ textAlign: 'left', color: '#1e293b' }}>Enthält alles für den Start:</Typography>
                                        <Stack spacing={2} sx={{ textAlign: 'left' }}>
                                            <FeatureItem text="Unbegrenzte Rechnungen erstellen" />
                                            <FeatureItem text="Kunden- & Artikelverwaltung" />
                                            <FeatureItem text="XRechnung (E-Rechnung) Export" />
                                            <FeatureItem text="100% Offline & Lokal" />
                                            <FeatureItem text="Eigenes Logo & Briefpapier" />
                                        </Stack>
                                    </Box>
                                </Card>
                            </Grid>

                            {/* Update - Secondary Product */}
                            <Grid xs={12} md={5}>
                                <Card variant="outlined" sx={{
                                    p: 0,
                                    height: '100%',
                                    bgcolor: '#f8fafc',
                                    borderColor: '#e2e8f0',
                                    boxShadow: 'none',
                                    borderRadius: '16px'
                                }}>
                                    {/* Header */}
                                    <Box sx={{ p: 4, borderBottom: '1px solid #e2e8f0' }}>
                                        <Typography level="title-sm" textTransform="uppercase" fontWeight="bold" letterSpacing="1px" sx={{ color: '#64748b', mb: 1 }}>
                                            Optionales Update
                                        </Typography>
                                        <Typography level="h2" fontSize="3.5rem" fontWeight="800" sx={{ color: '#334155' }}>
                                            {RECHNIX_CONFIG.stripe.products.update.amount.toFixed(2)}€
                                        </Typography>
                                        <Typography level="body-sm" sx={{ color: '#64748b' }}>pro Version</Typography>

                                        {user ? (
                                            <Button
                                                size="lg"
                                                fullWidth
                                                variant="outlined"
                                                sx={{
                                                    mt: 3,
                                                    borderColor: '#cbd5e1',
                                                    color: '#475569',
                                                    bgcolor: 'white',
                                                    borderRadius: '8px',
                                                    '&:hover': { borderColor: '#94a3b8', color: '#334155' }
                                                }}
                                                onClick={() => handleCheckout(RECHNIX_CONFIG.stripe.products.update.priceId, true)}
                                            >
                                                Update kaufen
                                            </Button>
                                        ) : (
                                            <Button
                                                size="lg"
                                                fullWidth
                                                disabled
                                                variant="outlined"
                                                sx={{ mt: 3, borderRadius: '8px', color: '#94a3b8', borderColor: '#e2e8f0' }}
                                            >
                                                Login erforderlich
                                            </Button>
                                        )}
                                        {!user && <Typography level="body-xs" mt={1} color="danger">Nur für bestehende Kunden</Typography>}
                                    </Box>

                                    {/* Features */}
                                    <Box sx={{ p: 4 }}>
                                        <Typography level="title-md" fontWeight="bold" mb={2} sx={{ textAlign: 'left', color: '#475569' }}>Lohnt sich, wenn Sie:</Typography>
                                        <Stack spacing={2} sx={{ textAlign: 'left' }}>
                                            <FeatureItem text="Neue Funktionen benötigen" color="#64748b" />
                                            <FeatureItem text="Sicherheitsupdates wünschen" color="#64748b" />
                                            <FeatureItem text="Support verlängern möchten" color="#64748b" />
                                        </Stack>
                                    </Box>
                                </Card>
                            </Grid>
                        </Grid>

                        <Box sx={{ mt: 8, p: 2, bgcolor: 'white', borderRadius: '12px', display: 'inline-flex', border: '1px solid #e2e8f0', alignItems: 'center', gap: 2 }}>
                            <Checkbox
                                label={
                                    <Typography level="body-sm" sx={{ color: '#475569' }}>
                                        Ich habe den <Link to="/datenschutz-haftung" style={{ color: '#6366f1' }}>Haftungsausschluss</Link> gelesen.
                                    </Typography>
                                }
                                checked={acceptedTerms}
                                onChange={(e) => {
                                    setAcceptedTerms(e.target.checked);
                                    if (e.target.checked) setError(false);
                                }}
                                color={error ? 'danger' : 'neutral'}
                                sx={{ alignItems: 'center' }}
                            />
                        </Box>
                        {error && (
                            <Typography level="body-xs" color="danger" sx={{ mt: 1 }}>
                                Bitte bestätigen Sie die Hinweise, um fortzufahren.
                            </Typography>
                        )}
                    </Container>
                </Box>
            </Box>
        </Layout>
    );
}

function Container({ children, maxWidth = 'lg', sx = {} }) {
    const maxWidths = {
        sm: '600px',
        md: '900px',
        lg: '1200px'
    };
    return (
        <Box sx={{
            width: '100%',
            maxWidth: maxWidths[maxWidth],
            mx: 'auto',
            px: 3,
            ...sx
        }}>
            {children}
        </Box>
    );
}

function FeatureItem({ text, color = '#334155' }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{
                minWidth: 20,
                height: 20,
                borderRadius: '50%',
                bgcolor: '#e0e7ff',
                color: '#4338ca',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold'
            }}>
                ✓
            </Box>
            <Typography level="body-md" sx={{ color: color }}>{text}</Typography>
        </Box>
    );
}
