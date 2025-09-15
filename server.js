// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors()); // Allow requests from any origin

const PORT = process.env.PORT || 3000;

app.get("/ytmp3", async (req, res) => {
    const { url } = req.query;

    if (!url) return res.status(400).json({ error: "Missing URL parameter." });

    try {
        // Call the real API
        const apiResponse = await fetch(`https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(url)}`);
        const data = await apiResponse.json();
        res.json(data); // Return the API response to the browser
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/youtube-search", async (req, res) => {
    const { query } = req.query;

    if (!query) return res.status(400).json({ error: "Missing query parameter." });

    try {
        const searchResponse = await fetch(`https://api.vreden.my.id/api/youtube?query=${encodeURIComponent(query)}`);
        const data = await searchResponse.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
