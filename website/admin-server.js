
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Enable CORS for localhost:3000 (Docusaurus)
app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json());

const STATIC_DIR = path.join(__dirname, 'static');

// Endpoint to save updates.json
app.post('/save-updates', (req, res) => {
    const filePath = path.join(STATIC_DIR, 'updates.json');
    try {
        fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
        console.log(`[Admin Server] Saved updates.json to ${filePath}`);
        res.json({ success: true, message: 'File saved successfully' });
    } catch (err) {
        console.error(`[Admin Server] Error saving updates.json:`, err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Endpoint to save legal.json
app.post('/save-legal', (req, res) => {
    const filePath = path.join(STATIC_DIR, 'legal.json');
    try {
        fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
        console.log(`[Admin Server] Saved legal.json to ${filePath}`);
        res.json({ success: true, message: 'File saved successfully' });
    } catch (err) {
        console.error(`[Admin Server] Error saving legal.json:`, err);
        res.status(500).json({ success: false, message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`\n✅ Local Admin Server running at http://localhost:${PORT}`);
    console.log(`You can now save files directly from the Rechnix Admin Panel.\n`);
});
