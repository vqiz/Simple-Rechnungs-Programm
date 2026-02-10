import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { Box, Typography, Button, Input, Card, Link as JoyLink, Alert, Stack, Divider, FormControl, FormLabel } from '@mui/joy';
import Link from '@docusaurus/Link';
import { motion } from 'framer-motion';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/rechnix_api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                const user = {
                    email: data.email,
                    roles: data.roles
                };
                localStorage.setItem('rechnix_user', JSON.stringify(user));
                window.location.href = '/';
            } else {
                setError("Login fehlgeschlagen. Bitte überprüfen Sie Ihre Daten.");
            }
        } catch (err) {
            setError("Verbindungsfehler zum Backend.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Login" noFooter>
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)', // Dark premium background
                position: 'relative',
                overflow: 'hidden',
                py: 4
            }}>
                {/* Background Decorations */}
                <Box sx={{
                    position: 'absolute',
                    top: '-10%',
                    left: '-10%',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(0,0,0,0) 70%)',
                    filter: 'blur(60px)',
                    zIndex: 0
                }} />
                <Box sx={{
                    position: 'absolute',
                    bottom: '-10%',
                    right: '-10%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(217, 70, 239, 0.4) 0%, rgba(0,0,0,0) 70%)',
                    filter: 'blur(60px)',
                    zIndex: 0
                }} />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ zIndex: 1, width: '100%', maxWidth: '450px', padding: '20px' }}
                >
                    <Card
                        variant="plain"
                        sx={{
                            p: 4,
                            borderRadius: 'xl',
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                    >
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <Typography level="h2" component="h1" fontWeight="xl" sx={{
                                background: 'linear-gradient(45deg, #0ea5e9, #8b5cf6)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 1
                            }}>
                                Rechnix
                            </Typography>
                            <Typography level="body-md" textColor="text.secondary">
                                Willkommen zurück.
                            </Typography>
                        </Box>

                        {error && (
                            <Alert color="danger" variant="soft" sx={{ mb: 2, borderRadius: 'md' }}>
                                {error}
                            </Alert>
                        )}

                        <Stack spacing={2}>
                            <FormControl>
                                <FormLabel>E-Mail Adresse</FormLabel>
                                <Input
                                    type="email"
                                    placeholder="name@beispiel.de"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    variant="outlined"
                                    size="lg"
                                    sx={{ borderRadius: 'md' }}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Passwort</FormLabel>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    variant="outlined"
                                    size="lg"
                                    sx={{ borderRadius: 'md' }}
                                />
                            </FormControl>

                            <Button
                                onClick={handleLogin}
                                loading={loading}
                                size="lg"
                                sx={{
                                    mt: 2,
                                    borderRadius: 'md',
                                    background: 'linear-gradient(45deg, #0ea5e9, #8b5cf6)',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(14, 165, 233, 0.4)'
                                    }
                                }}
                            >
                                Anmelden
                            </Button>
                        </Stack>

                        <Divider sx={{ my: 4 }}>ODER</Divider>

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography level="body-sm" textColor="text.secondary">
                                Noch kein Konto?{' '}
                                <Link to="/register" style={{ fontWeight: 600, color: '#8b5cf6', textDecoration: 'none' }}>
                                    Jetzt kostenlos registrieren
                                </Link>
                            </Typography>
                        </Box>
                    </Card>
                </motion.div>
            </Box>
        </Layout>
    );
}
