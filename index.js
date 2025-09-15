import cors from 'cors';
import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(cors());

app.get('/', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send('Missing url parameter');

    try {
        const response = await fetch(targetUrl);
        const data = await response.text();
        res.send(data);
    } catch (err) {
        res.status(500).send('Error fetching target URL');
    }
});

// New endpoint to force clean filename download
app.get('/download', async (req, res) => {
    const targetUrl = req.query.url;
    const filename = req.query.filename || 'file.mp3';
    if (!targetUrl) return res.status(400).send('Missing url parameter');

    try {
        const response = await fetch(targetUrl);
        const contentType = response.headers.get('content-type') || 'application/octet-stream';
        const buffer = await response.buffer();

        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', contentType);
        res.send(buffer);
    } catch (err) {
        res.status(500).send('Error downloading file');
    }
});

export default app;
