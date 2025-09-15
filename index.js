import cors from 'cors';
import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(cors()); // Allow all origins

// --- Default proxy for general URLs ---
app.get('/', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send('Missing url parameter');

    try {
        const response = await fetch(targetUrl);
        const data = await response.text(); // return raw text
        res.send(data);
    } catch (err) {
        res.status(500).send('Error fetching target URL');
    }
});

// --- New endpoint for clean downloads ---
app.get('/download', async (req, res) => {
    try {
        const { url, filename } = req.query;
        if (!url || !filename) return res.status(400).send('Missing url or filename');

        const response = await fetch(url);
        if (!response.ok) return res.status(500).send('Failed to fetch file');

        const buffer = await response.arrayBuffer();

        // Force the clean filename
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.send(Buffer.from(buffer));
    } catch (err) {
        res.status(500).send('Error: ' + err.message);
    }
});

export default app;
