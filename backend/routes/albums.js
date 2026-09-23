import express from 'express';
import { promises as fs } from 'fs';

const router = express.Router();

const readAlbums = async () => {
    const data = await fs.readFile('./data/albums.json', 'utf8')
    const albumsData = JSON.parse(data)

    const seen = new Set()
    const seenNews = new Set()
    const unique = []
    for (const album of albumsData) {
        if (!album || album.id === undefined || seen.has(album.id)) continue
        if (album.newsId !== null && album.newsId !== undefined && seenNews.has(album.newsId)) continue
        seen.add(album.id)
        if (album.newsId !== null && album.newsId !== undefined) seenNews.add(album.newsId)
        unique.push(album)
    }
    return unique
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