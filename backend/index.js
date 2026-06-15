import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { promises as fs } from 'fs';


dotenv.config();
const app = express();
const port = process.env.PORT || 5001;
app.use(cors())
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/news', async (req, res) => {
    try {
        const data = await fs.readFile('./data/news.json', 'utf8')
        const newsData = JSON.parse(data);
        res.json(newsData);
    } catch (parseErr) {
        res.status(500).send(parseErr.message);
    }
});

app.get('/api/news/:id', async (req, res) => {
    try {
        const newsId = parseInt(req.params.id);
        const data = await fs.readFile('./data/news.json', 'utf8')
        const news = JSON.parse(data).find((item) => item.id === newsId)
        res.json(news);
    } catch (parseErr) {
        res.status(500).send(parseErr.message);
    }
});


app.get('/api/albums', async (req, res) => {
    try {
        const data = await fs.readFile('./data/albums.json', 'utf8')
        const albumsData = JSON.parse(data);
        res.json(albumsData);
    } catch (parseErr) {
        res.status(500).send(parseErr.message);
    }
});

app.get('/api/albums/:id', async (req, res) => {
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

app.get('/api/video', async (req, res) => {
    try {
        const data = await fs.readFile('./data/video.json', 'utf8')
        const videoData = JSON.parse(data);
        res.json(videoData);
    } catch (parseErr) {
        res.status(500).send(parseErr.message);
    }
});

app.get('/api/video/:id', async (req, res) => {
    try {
        const newsId = parseInt(req.params.id);
        const data = await fs.readFile('./data/video.json', 'utf8')
        const newsVideo = JSON.parse(data).filter((video) => video.newsId === newsId)
        res.json(newsVideo);
    } catch (parseErr) {
        res.status(500).send(parseErr.message);
    }
});


app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
