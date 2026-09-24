import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const DATA_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data', 'news.json');

const router = express.Router();

const sortByDateDesc = (items) => [...items].sort((a, b) => {
    const dateOrder = (b.date || '').localeCompare(a.date || '');
    return dateOrder || (Number(b.id) || 0) - (Number(a.id) || 0);
});

router.get('/', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8')
        const newsData = JSON.parse(data);
        res.json(sortByDateDesc(newsData));
    } catch (parseErr) {
        res.status(500).send(parseErr.message);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const newsId = parseInt(req.params.id);
        const data = await fs.readFile(DATA_FILE, 'utf8')
        const news = JSON.parse(data).find((item) => item.id === newsId)
        if (!news) return res.status(404).json({ error: 'Новость не найдена' });
        res.json(news);
    } catch (parseErr) {
        res.status(500).send(parseErr.message);
    }
});

export default router
