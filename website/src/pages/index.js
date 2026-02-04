
import React, { useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import { Box, Typography, Button, Checkbox, Card, Divider, Grid, Alert } from '@mui/joy';
import { RECHNIX_CONFIG } from '../rechnix-config';
import { loadStripe } from '@stripe/stripe-js';
import { motion } from 'framer-motion';

// Initialize Stripe
const stripePromise = loadStripe(RECHNIX_CONFIG.stripe.publishableKey);

// Animation variants (Subtle)
const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Home() {
    const { siteConfig } = useDocusaurusContext();
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [error, setError] = useState(false);

    const handleCheckout = async (priceId) => {
        if (!acceptedTerms) {
            setError(true);
            return;
        }
        setError(false);
        const stripe = await stripePromise;
        const { error: stripeError } = await stripe.redirectToCheckout({
            lineItems: [{ price: priceId, quantity: 1 }],
            mode: 'payment',
            successUrl: window.location.origin + '/success?session_id={CHECKOUT_SESSION_ID}',
            cancelUrl: window.location.origin,
        });
        if (stripeError) console.warn(stripeError);
    };

    return (
        <Layout
            title={`Rechnix - ${siteConfig.tagline}`}
            description="Das einfache Rechnungsprogramm für macOS und Windows.">

            <main className="container margin-vert--xl">
                <div style={{ textAlign: 'center', maxWidth: '1000px', margin: '0 auto' }}>

                    {/* Hero Section */}
                    <Heading as="h1" className="hero__title" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
                        Rechnungen schreiben.<br />
                        <span style={{ color: 'var(--ifm-color-primary)' }}>Ohne Abo. Ohne Cloud.</span>
                    </Heading>
                    <p className="hero__subtitle" style={{ fontSize: '1.5rem', color: 'var(--ifm-color-emphasis-700)', marginBottom: '2rem' }}>
                        Die einfache Software für Selbstständige auf Mac & Windows.
                    </p>



                    {/* Beta Notice */}
                    <div className="alert alert--warning" style={{ marginBottom: '2rem', display: 'inline-block', textAlign: 'left' }}>
                        <Heading as="h3">🚧 Beta Version</Heading>
                        <div>
                            Diese Software befindet sich noch in der <strong>Beta-Phase</strong>. <br />
                            Es können Fehler auftreten. Bitte melden Sie Probleme dem Support.
                        </div>
                    </div>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 8 }}>
                        <Link
                            className="button button--secondary button--lg"
                            to="/handbuch">
                            Handbuch ansehen
                        </Link>
                        <Link
                            className="button button--primary button--lg"
                            to="#preise">
                            Lizenz Kaufen
                        </Link>
                    </Box>

                    <Divider sx={{ my: 6 }} />

                    {/* Features Grid (Simple) */}
                    <Grid container spacing={4} sx={{ textAlign: 'left', mb: 8 }}>
                        {[
                            { title: "Einfach & Lokal", desc: "Ihre Daten bleiben auf Ihrem Gerät. Keine Cloud, kein Tracking." },
                            { title: "Rechtssicher", desc: "Erfüllt alle Anforderungen an ordnungsgemäße Rechnungen (GoBD)." },
                            { title: "Individuell", desc: "Passen Sie das Design an Ihre Marke an. Eigenes Logo, eigene Farben." },
                            { title: "E-Rechnung", desc: "Zukunftssicher mit integriertem XRechnung Export." }
                        ].map((f, i) => (
                            <Grid key={i} xs={12} md={6}>
                                <Card variant="soft" sx={{ bgcolor: 'background.level1' }}>
                                    <Typography level="h4" mb={1}>{f.title}</Typography>
                                    <Typography>{f.desc}</Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Pricing Section */}
                    <section id="preise">
                        <Heading as="h2" style={{ marginBottom: '2rem' }}>Preise</Heading>
                        <Grid container spacing={4} justifyContent="center" alignItems="stretch">

                            {/* Full Version */}
                            <Grid xs={12} md={5}>
                                <motion.div whileHover={{ y: -5 }} transition={{ type: "spring" }} style={{ height: '100%' }}>
                                    <Card variant="outlined" sx={{ p: 4, height: '100%', borderColor: 'primary.500', boxShadow: 'md' }}>
                                        <Typography level="title-lg" color="primary">Vollversion</Typography>
                                        <Typography level="h1" sx={{ fontSize: '3rem', my: 2 }}>{RECHNIX_CONFIG.stripe.products.fullVersion.amount}€</Typography>
                                        <Typography level="body-sm" mb={3}>Einmalige Zahlung. Lebenslange Nutzung.</Typography>

                                        <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', marginBottom: 'auto' }}>
                                            <li style={{ marginBottom: '0.5rem' }}>✅ Unbegrenzte Rechnungen</li>
                                            <li style={{ marginBottom: '0.5rem' }}>✅ Kundenverwaltung</li>
                                            <li style={{ marginBottom: '0.5rem' }}>✅ E-Rechnung (XRechnung)</li>
                                            <li>⚠️ Jedes Update ist kostenpflichtig</li>
                                        </ul>

                                        <Divider sx={{ my: 3 }} />

                                        <Button size="lg" onClick={() => handleCheckout(RECHNIX_CONFIG.stripe.products.fullVersion.priceId)}>
                                            Lizenz Kaufen
                                        </Button>
                                    </Card>
                                </motion.div>
                            </Grid>

                            {/* Update */}
                            <Grid xs={12} md={5}>
                                <motion.div whileHover={{ y: -5 }} transition={{ type: "spring" }} style={{ height: '100%' }}>
                                    <Card variant="outlined" sx={{ p: 4, height: '100%' }}>
                                        <Typography level="title-lg">Update</Typography>
                                        <Typography level="h1" sx={{ fontSize: '3rem', my: 2 }}>{RECHNIX_CONFIG.stripe.products.update.amount}€</Typography>
                                        <Typography level="body-sm" mb={3}>Für bestehende Kunden.</Typography>

                                        <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', marginBottom: 'auto' }}>
                                            <li style={{ marginBottom: '0.5rem' }}>⭐ Alle neuen Features</li>
                                        </ul>

                                        <Divider sx={{ my: 3 }} />

                                        <Button variant="outlined" size="lg" onClick={() => handleCheckout(RECHNIX_CONFIG.stripe.products.update.priceId)}>
                                            Update Kaufen
                                        </Button>
                                    </Card>
                                </motion.div>
                            </Grid>

                        </Grid>

                        {/* Terms Checkbox */}
                        <Box sx={{ mt: 4, bgcolor: 'background.level1', p: 2, borderRadius: 'md', display: 'inline-block', maxWidth: '600px' }}>
                            <Checkbox
                                label={
                                    <Typography level="body-sm">
                                        Ich habe die <Link to="/datenschutz-haftung">Haftungsausschluss</Link> gelesen und akzeptiere diese.
                                        Ich verstehe, dass dies ein digitaler Download ist.
                                    </Typography>
                                }
                                checked={acceptedTerms}
                                onChange={(e) => {
                                    setAcceptedTerms(e.target.checked);
                                    if (e.target.checked) setError(false);
                                }}
                                color={error ? 'danger' : 'primary'}
                            />
                            {error && (
                                <Typography level="body-xs" color="danger" sx={{ mt: 1 }}>
                                    Bitte akzeptieren Sie die Bedingungen, um fortzufahren.
                                </Typography>
                            )}
                        </Box>

                    </section>
                </div>
            </main>
        </Layout>
    );
}
