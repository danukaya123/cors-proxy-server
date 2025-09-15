import fetch from "node-fetch";

export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) return res.status(400).json({ error: "Missing URL parameter." });

    try {
        const apiResponse = await fetch(`https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(url)}`);
        const data = await apiResponse.json();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
