import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const DATA_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data', 'albums.json');

const router = express.Router();

const readAlbums = async () => {
    const data = await fs.readFile(DATA_FILE, 'utf8')
    const albumsData = JSON.parse(data)

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
    try {
        res.json(await readAlbums());
    } catch (parseErr) {
        res.status(500).send(parseErr.message);
    }
});

router.get('/by-news/:newsId', async (req, res) => {
    try {
        const newsId = parseInt(req.params.newsId);
        const albumsData = await readAlbums()
        const newsAlbum = albumsData.find((album) => album.newsId === newsId)
        if (!newsAlbum) {
            return res.status(404).json({ error: 'Альбом не найден', data: null });
        }
        res.json(newsAlbum);
    } catch (parseErr) {
        res.status(500).send(parseErr.message);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const albumId = parseInt(req.params.id);
        const albumsData = await readAlbums()
        const newsAlbum = albumsData.find((album) => album.id === albumId)
        if (!newsAlbum) {
            return res.status(404).json({ error: 'Альбом не найден', data: null });
        }
        res.json(newsAlbum);
    } catch (parseErr) {
        res.status(500).send(parseErr.message);
    }
});

export default router