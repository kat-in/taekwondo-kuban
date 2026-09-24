import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const DATA_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data', 'video.json');

const router = express.Router();

const readVideos = async () => {
    const data = await fs.readFile(DATA_FILE, 'utf8')
    const videoData = JSON.parse(data)

    const seen = new Set()
    const unique = []
    for (const video of videoData) {
        if (!video || video.id === undefined || seen.has(video.id)) continue
        seen.add(video.id)
        unique.push(video)
    }
    return unique.sort((a, b) => {
        const dateOrder = (b.date || '').localeCompare(a.date || '')
        return dateOrder || (Number(b.id) || 0) - (Number(a.id) || 0)
    })
}

router.get('/', async (req, res) => {
    try {
        res.json(await readVideos());
    } catch (parseErr) {
        res.status(500).send(parseErr.message);
    }
});

router.get('/:newsId', async (req, res) => {
    try {
        const newsId = parseInt(req.params.newsId);
        const videoData = await readVideos()
        const newsVideo = videoData.filter((video) => video.newsId === newsId)
        res.json(newsVideo);
    } catch (parseErr) {
        res.status(500).send(parseErr.message);
    }
});

export default router