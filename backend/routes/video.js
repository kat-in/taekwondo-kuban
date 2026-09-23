import express from 'express';
import { promises as fs } from 'fs';

const router = express.Router();

const readVideos = async () => {
    const data = await fs.readFile('./data/video.json', 'utf8')
    const videoData = JSON.parse(data)

    const seen = new Set()
    const unique = []
    for (const video of videoData) {
        if (!video || seen.has(video.videoId)) continue
        seen.add(video.videoId)
        unique.push(video)
    }
    return unique
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