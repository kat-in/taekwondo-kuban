import express from 'express';
import { readJson } from '../utils/jsonStore.js';
import path from 'path';
import { fileURLToPath } from 'url';

const DATA_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data', 'news.json');

const router = express.Router();

const sortByDateDesc = (items) => [...items].sort((a, b) => {
    const dateOrder = (b.date || '').localeCompare(a.date || '');
    return dateOrder || (Number(b.id) || 0) - (Number(a.id) || 0);
});

const parseId = (value) => {
    const id = Number.parseInt(value, 10);
    return Number.isNaN(id) ? null : id;
};

const readNews = async () => {
    const newsData = await readJson(DATA_FILE)

    const seen = new Set()
    const unique = []
    for (const news of newsData) {
        if (!news || news.id === undefined || seen.has(news.id)) continue
        seen.add(news.id)
        unique.push(news)
    }
    return sortByDateDesc(unique)
}

router.get('/', async (req, res) => {
    res.json(await readNews());
});

router.get('/:id', async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) {
        return res.status(400).json({ success: false, message: 'Некорректный идентификатор новости' });
    }
    const news = (await readNews()).find((item) => item.id === id);
    if (!news) {
        return res.status(404).json({ success: false, message: 'Новость не найдена' });
    }
    res.json(news);
});

export default router
