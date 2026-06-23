import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const data = await fs.readFile('./data/news.json', 'utf8')
        const newsData = JSON.parse(data);
        res.json(newsData);
    } catch (parseErr) {
        res.status(500).send(parseErr.message);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const newsId = parseInt(req.params.id);
        const data = await fs.readFile('./data/news.json', 'utf8')
        const news = JSON.parse(data).find((item) => item.id === newsId)
        res.json(news);
    } catch (parseErr) {
        res.status(500).send(parseErr.message);
    }
});

export default router
