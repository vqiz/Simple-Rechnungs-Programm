import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { Box, Typography, Button, Input, Card, Alert, Stack, Divider, FormControl, FormLabel } from '@mui/joy';
import Link from '@docusaurus/Link';
import { motion } from 'framer-motion';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setError("Passwörter stimmen nicht überein.");
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await fetch('/rechnix_api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                // Auto-login logic or redirect
                alert("Registrierung erfolgreich! Bitte loggen Sie sich ein.");
                window.location.href = '/login';
            } else {
                const msg = await response.text();
                setError("Registrierung fehlgeschlagen: " + msg);
            }
        } catch (err) {
            setError("Verbindungsfehler zum Backend.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Registrieren" noFooter>
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', // Slightly lighter dark theme for register
                position: 'relative',
                overflow: 'hidden',
                py: 4
            }}>
                {/* Background Decorations */}
                <Box sx={{
                    position: 'absolute',
                    top: '10%',
                    right: '-5%',
                    width: '400px',
                    height: '400px',
                    background: 'radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, rgba(0,0,0,0) 70%)',
                    filter: 'blur(60px)',
                    zIndex: 0
                }} />
                <Box sx={{
                    position: 'absolute',
                    bottom: '-10%',
                    left: '-5%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(0,0,0,0) 70%)',
                    filter: 'blur(60px)',
                    zIndex: 0
                }} />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{ zIndex: 1, width: '100%', maxWidth: '450px', padding: '20px' }}
                >
                    <Card
                        variant="plain"
                        sx={{
                            p: 4,
                            borderRadius: 'xl',
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                    >
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <Typography level="h2" component="h1" fontWeight="xl" sx={{ mb: 1 }}>
                                Konto erstellen
                            </Typography>
                            <Typography level="body-md" textColor="text.secondary">
                                Starten Sie noch heute mit Rechnix.
                            </Typography>
                        </Box>

                        {error && <Alert color="danger" variant="soft" sx={{ mb: 2 }}>{error}</Alert>}

                        <Stack spacing={2}>
                            <FormControl>
                                <FormLabel>E-Mail Adresse</FormLabel>
                                <Input
                                    type="email"
                                    placeholder="name@firma.de"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    variant="outlined"
                                    size="lg"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Passwort</FormLabel>
                                <Input
                                    type="password"
                                    placeholder="Mindestens 8 Zeichen"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    variant="outlined"
                                    size="lg"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Passwort bestätigen</FormLabel>
                                <Input
                                    type="password"
                                    placeholder="Passwort wiederholen"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    variant="outlined"
                                    size="lg"
                                />
                            </FormControl>

                            <Button
                                onClick={handleRegister}
                                loading={loading}
                                size="lg"
                                sx={{
                                    mt: 2,
                                    borderRadius: 'md',
                                    background: 'linear-gradient(45deg, #8b5cf6, #d946ef)', // Purple to Pink
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)'
                                    }
                                }}
                            >
                                Kostenlos Registrieren
                            </Button>
                        </Stack>

                        <Divider sx={{ my: 4 }} />

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography level="body-sm" textColor="text.secondary">
                                Bereits registriert?{' '}
                                <Link to="/login" style={{ fontWeight: 600, color: '#0ea5e9', textDecoration: 'none' }}>
                                    Hier einloggen
                                </Link>
                            </Typography>
                        </Box>
                    </Card>
                </motion.div>
            </Box>
        </Layout>
    );
}
