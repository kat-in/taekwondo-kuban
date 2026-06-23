import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const data = await fs.readFile('./data/albums.json', 'utf8')
        const albumsData = JSON.parse(data);
        res.json(albumsData);
    } catch (parseErr) {
        res.status(500).send(parseErr.message);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const newsId = parseInt(req.params.id);
        const data = await fs.readFile('./data/albums.json', 'utf8')
        const newsAlbum = JSON.parse(data).find((album) => album.newsId === newsId)
        if (!newsAlbum) {
            return res.status(404).json({ error: 'Альбом не найден', data: null });
        }
         res.json(newsAlbum);
    } catch (parseErr) {
        res.status(500).send(parseErr.message);
    }
});

export default router


