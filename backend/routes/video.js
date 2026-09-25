import express from 'express';
import { readJsonCached } from '../utils/jsonStore.js';
import path from 'path';
import { fileURLToPath } from 'url';

const DATA_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data', 'video.json');

const router = express.Router();

const parseId = (value) => {
    const id = Number.parseInt(value, 10);
    return Number.isNaN(id) ? null : id;
};

const readVideos = async () => {
    const videoData = await readJsonCached(DATA_FILE)

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
    res.json(await readVideos());
});

router.get('/:newsId', async (req, res) => {
    const newsId = parseId(req.params.newsId);
    if (newsId === null) {
        return res.status(400).json({ success: false, message: 'Некорректный идентификатор новости' });
    }
    res.json((await readVideos()).filter((video) => video.newsId === newsId));
});

export default router
