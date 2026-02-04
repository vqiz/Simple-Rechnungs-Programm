
import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { Box, Typography, Button, Input, Textarea, Card, Divider } from '@mui/joy';

const ADMIN_PASSWORD_HASH = "RechnixAdmin2024!"; // Simple hardcoded password for now

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

    const handleLogin = () => {
        if (password === ADMIN_PASSWORD_HASH) {
            setIsAuthenticated(true);
        } else {
            alert("Falsches Passwort!");
        }
    };

    const handleAddUpdate = () => {
        const newUpdate = {
            version,
            date,
            title,
            description,
            downloadUrl
        };
        const newUpdatesList = [newUpdate, ...updates];
        setUpdates(newUpdatesList);
        // Clear form
        setVersion('');
        setDate('');
        setTitle('');
        setDescription('');
        setDownloadUrl('');
    };

    const saveToServer = async (endpoint, data, filename) => {
        try {
            const response = await fetch(`http://localhost:3001${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.success) {
                alert(`✅ ${filename} erfolgreich auf dem Server gespeichert!`);
                return true;
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.warn("Server save failed, falling back to download:", error);
            if (confirm(`⚠️ Der Admin-Server (Port 3001) ist nicht erreichbar.\n\nMöchten Sie ${filename} stattdessen herunterladen?`)) {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
                const downloadAnchorNode = document.createElement('a');
                downloadAnchorNode.setAttribute("href", dataStr);
                downloadAnchorNode.setAttribute("download", filename);
                document.body.appendChild(downloadAnchorNode);
                downloadAnchorNode.click();
                downloadAnchorNode.remove();
            }
            return false;
        }
    };

    const handleSaveUpdates = () => {
        saveToServer('/save-updates', updates, 'updates.json');
    };

    const handleSaveLegal = () => {
        const legalData = { imprint, disclaimer };
        saveToServer('/save-legal', legalData, 'legal.json');
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
                                <Input placeholder="Download URL (z.B. /downloads/Update-1.0.1.zip)" value={downloadUrl} onChange={e => setDownloadUrl(e.target.value)} />
                                <Button onClick={handleAddUpdate}>Update Hinzufügen</Button>
                                <Divider />
                                <Typography level="body-sm">
                                    Starten Sie <code>node admin-server.js</code> um direkt zu speichern.
                                </Typography>
                                <Button color="success" onClick={handleSaveUpdates}>Updates Speichern</Button>
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
                                <Typography level="body-sm">
                                    Starten Sie <code>node admin-server.js</code> um direkt zu speichern.
                                </Typography>
                                <Button color="warning" onClick={handleSaveLegal}>Legal Texte Speichern</Button>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            </main>
        </Layout>
    );
}

// Simple Grid replacement for layout since Joy UI Grid import might need checking
function Grid({ children, container, spacing, xs, md }) {
    if (container) {
        return <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing * 8 + 'px' }}>{children}</div>
    }
    const width = xs === 12 ? '100%' : md === 6 ? 'calc(50% - 16px)' : '100%';
    return <div style={{ width: width, flexGrow: 1 }}>{children}</div>
}
