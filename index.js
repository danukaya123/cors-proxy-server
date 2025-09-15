// index.js
import cors from 'cors';
import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(cors());

async function fetchWithRetries(url, retries = 5, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; ProxyServer/1.0)',
                    'Accept': '*/*'
                },
                timeout: 10000 // 10s timeout
            });

            if (!response.ok) {
                throw new Error(`Bad response: ${response.status}`);
            }

            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
                return await response.json();
            } else {
                return await response.text();
            }
        } catch (err) {
            if (i === retries - 1) throw err; // final attempt failed
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

app.get('/', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send('Missing url parameter');

    try {
        const data = await fetchWithRetries(targetUrl, 3, 800); // retry 3 times
        if (typeof data === 'object') {
            res.json(data);
        } else {
            res.send(data);
        }
    } catch (err) {
        res.status(500).json({ error: true, message: `Proxy failed after retries: ${err.message}` });
    }
});

// For Vercel deployment
export default app;
