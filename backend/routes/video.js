import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const data = await fs.readFile('./data/video.json', 'utf8')
        const videoData = JSON.parse(data);
        res.json(videoData);
    } catch (parseErr) {
        res.status(500).send(parseErr.message);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const newsId = parseInt(req.params.id);
        const data = await fs.readFile('./data/video.json', 'utf8')
        const newsVideo = JSON.parse(data).filter((video) => video.newsId === newsId)
        res.json(newsVideo);
    } catch (parseErr) {
        res.status(500).send(parseErr.message);
    }
});

export default router