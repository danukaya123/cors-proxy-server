import cors from 'cors';
import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(cors()); // Allow all origins

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

// For Vercel deployment
export default app;
