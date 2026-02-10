import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { Box, Typography, Button, Input, Textarea, Card, Divider } from '@mui/joy';

export default function Admin() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');

    // Updates State
    const [updates, setUpdates] = useState([]);
    const [version, setVersion] = useState('');
    const [date, setDate] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [downloadUrl, setDownloadUrl] = useState('');

    // Legal State
    const [imprint, setImprint] = useState('');
    const [disclaimer, setDisclaimer] = useState('');

    useEffect(() => {
        // Load existing updates
        fetch('/updates.json')
            .then(res => res.json())
            .then(data => setUpdates(data))
            .catch(err => console.error("Could not load updates", err));

        // Load existing legal
        fetch('/legal.json')
            .then(res => res.json())
            .then(data => {
                setImprint(data.imprint);
                setDisclaimer(data.disclaimer);
            })
            .catch(err => console.error("Could not load legal", err));
    }, []);

    const handleLogin = async () => {
        try {
            const response = await fetch('/rechnix_api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'admin@rechnix.com', password: password }),
            });
            if (response.ok) {
                setIsAuthenticated(true);
            } else {
                alert("Login fehlgeschlagen");
            }
        } catch (e) {
            alert("Fehler: " + e.message);
        }
    };

    const handleAddUpdate = async () => {
        alert("Bitte nutzen Sie den Upload Button unten.");
    };

    const handleUploadFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('version', version);
        formData.append('price', 19.99); // Harcoded for demo
        formData.append('description', description);

        try {
            const res = await fetch('/rechnix_api/updates/admin/upload', {
                method: 'POST',
                body: formData
            });
            if (res.ok) {
                alert("Upload erfolgreich!");
            } else {
                alert("Upload fehlgeschlagen: " + await res.text());
            }
        } catch (err) {
            console.error(err);
            alert("Error: " + err.message);
        }
    };

    // Placeholder for saving legal texts - implement specific endpoint if needed
    const handleSaveLegal = () => {
        alert("Funktion noch nicht mit Backend verbunden.");
    };

    if (!isAuthenticated) {
        return (
            <Layout title="Admin Login">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <Card variant="outlined" sx={{ p: 4, width: 400, textAlign: 'center' }}>
                        <Typography level="h4" mb={2}>Admin Login</Typography>
                        <Input
                            type="password"
                            placeholder="Passwort eingeben"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Button onClick={handleLogin}>Login</Button>
                    </Card>
                </Box>
            </Layout>
        );
    }

    return (
        <Layout title="Administration">
            <main className="container margin-vert--xl">
                <Typography level="h1" mb={4}>Administration</Typography>

                <Grid container spacing={4}>
                    {/* Updates Management */}
                    <Grid xs={12} md={6}>
                        <Card variant="outlined" sx={{ p: 3, mb: 4 }}>
                            <Typography level="h3" mb={2}>Update Management</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Input placeholder="Version (z.B. 1.0.1)" value={version} onChange={e => setVersion(e.target.value)} />
                                <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
                                <Input placeholder="Titel" value={title} onChange={e => setTitle(e.target.value)} />
                                <Textarea placeholder="Beschreibung (Markdown unterstützt)" minRows={3} value={description} onChange={e => setDescription(e.target.value)} />
                                <Typography level="body-sm">Update Datei hochladen:</Typography>
                                <input type="file" onChange={handleUploadFile} />
                                <Divider />
                                <Typography level="body-sm">
                                    Backend Upload aktiv.
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>

                    {/* Legal Management */}
                    <Grid xs={12} md={6}>
                        <Card variant="outlined" sx={{ p: 3, mb: 4 }}>
                            <Typography level="h3" mb={2}>Rechtstexte Bearbeiten</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Typography level="title-md">Impressum (Markdown)</Typography>
                                <Textarea minRows={10} value={imprint} onChange={e => setImprint(e.target.value)} />

                                <Typography level="title-md">Haftungsausschluss (Markdown)</Typography>
                                <Textarea minRows={10} value={disclaimer} onChange={e => setDisclaimer(e.target.value)} />

                                <Divider />
                                <Button color="warning" onClick={handleSaveLegal}>Legal Texte Speichern</Button>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            </main>
        </Layout>
    );
}

function Grid({ children, container, spacing, xs, md }) {
    if (container) {
        return <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing * 8 + 'px' }}>{children}</div>
    }
    const width = xs === 12 ? '100%' : md === 6 ? 'calc(50% - 16px)' : '100%';
    return <div style={{ width: width, flexGrow: 1 }}>{children}</div>
}
