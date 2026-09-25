import express from 'express';
import { readJson } from '../utils/jsonStore.js';
import path from 'path';
import { fileURLToPath } from 'url';

const DATA_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data', 'albums.json');

const router = express.Router();

const parseId = (value) => {
    const id = Number.parseInt(value, 10);
    return Number.isNaN(id) ? null : id;
};

const readAlbums = async () => {
    const albumsData = await readJson(DATA_FILE);

    const seen = new Set()
    const unique = []
    for (const album of albumsData) {
        if (!album || album.id === undefined || seen.has(album.id)) continue
        seen.add(album.id)
        unique.push(album)
    }
    return unique.sort((a, b) => {
        const dateOrder = (b.date || '').localeCompare(a.date || '')
        return dateOrder || (Number(b.id) || 0) - (Number(a.id) || 0)
    })
}

router.get('/', async (req, res) => {
    res.json(await readAlbums());
});

router.get('/by-news/:newsId', async (req, res) => {
    const newsId = parseId(req.params.newsId);
    if (newsId === null) {
        return res.status(400).json({ success: false, message: 'Некорректный идентификатор новости' });
    }
    const newsAlbum = (await readAlbums()).find((album) => album.newsId === newsId);
    if (!newsAlbum) {
        return res.status(404).json({ success: false, message: 'Альбом не найден', data: null });
    }
    res.json(newsAlbum);
});

router.get('/:id', async (req, res) => {
    const albumId = parseId(req.params.id);
    if (albumId === null) {
        return res.status(400).json({ success: false, message: 'Некорректный идентификатор альбома' });
    }
    const newsAlbum = (await readAlbums()).find((album) => album.id === albumId);
    if (!newsAlbum) {
        return res.status(404).json({ success: false, message: 'Альбом не найден', data: null });
    }
    res.json(newsAlbum);
});

export default router
