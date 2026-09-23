import express from 'express';
import multer from 'multer';
import path from 'path';
import { promises as fs } from 'fs';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../utils/auth.js';
import { readJson, writeJson, nextId, formatDisplayDate } from '../utils/jsonStore.js';

dotenv.config();

const router = express.Router();
const DATA_DIR = path.join(process.cwd(), 'data');
const NEWS_FILE = path.join(DATA_DIR, 'news.json');
const ALBUMS_FILE = path.join(DATA_DIR, 'albums.json');
const VIDEO_FILE = path.join(DATA_DIR, 'video.json');
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const NEWS_UPLOADS_DIR = path.join(UPLOADS_DIR, 'news');
const ALBUMS_UPLOADS_DIR = path.join(UPLOADS_DIR, 'albums');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = req.originalUrl.split('?')[0].includes('/albums') ? ALBUMS_UPLOADS_DIR : NEWS_UPLOADS_DIR;
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({ storage });

const parseOptionalInt = (value) => {
  const num = Number.parseInt(value, 10);
  return Number.isNaN(num) ? null : num;
};

const unlinkIfExists = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch {
    // файла нет — игнорируем
  }
};

router.post('/login', async (req, res) => {
  const { password } = req.body;
  const isValid = bcrypt.compareSync(password, process.env.ADMIN_PASSWORD);
  if (isValid) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ success: true, message: 'Успешный вход', token });
  } else {
    res.status(401).json({ success: false, message: 'Неверный пароль' });
  }
});

router.use(authMiddleware);

/* NEWS START */

router.get('/news', async (req, res) => {
  try {
    res.json(await readJson(NEWS_FILE));
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.post('/news', upload.single('cover'), async (req, res) => {
  try {
    const news = await readJson(NEWS_FILE);
    const albums = await readJson(ALBUMS_FILE);
    const videos = await readJson(VIDEO_FILE);
    const id = nextId(news);
    const date = req.body.date || new Date().toISOString().slice(0, 10);
    const item = {
      id,
      category: req.body.category || '',
      date,
      displayDate: formatDisplayDate(date),
      title: req.body.title || '',
      content: req.body.content || '',
    };
    if (req.body.details) item.details = req.body.details;
    let attestation = {};
    try {
      attestation = JSON.parse(req.body.attestation || '{}');
    } catch {
      attestation = {};
    }
    if (Object.keys(attestation).length) item.attestation = attestation;
    if (req.file) {
      item.image = {
        url: `/uploads/news/${req.file.filename}`,
        description: req.body.imageDescription || '',
      };
    }
    const albumId = parseOptionalInt(req.body.albumId);
    if (albumId !== null) {
      const album = albums.find((a) => a.id === albumId);
      if (album) album.newsId = id;
    }
    const videoId = parseOptionalInt(req.body.videoId);
    if (videoId !== null) {
      const video = videos.find((v) => v.id === videoId);
      if (video) video.newsId = id;
    }
    news.push(item);
    await writeJson(NEWS_FILE, news);
    await writeJson(ALBUMS_FILE, albums);
    await writeJson(VIDEO_FILE, videos);
    res.json({ success: true, data: item });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.put('/news/:id', upload.single('cover'), async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const news = await readJson(NEWS_FILE);
    const albums = await readJson(ALBUMS_FILE);
    const videos = await readJson(VIDEO_FILE);
    const item = news.find((n) => n.id === id);
    if (!item) return res.status(404).json({ success: false, message: 'Новость не найдена' });

    const date = req.body.date || item.date;
    item.category = req.body.category ?? item.category;
    item.date = date;
    item.displayDate = formatDisplayDate(date);
    item.title = req.body.title ?? item.title;
    item.content = req.body.content ?? item.content;
    if (req.body.details !== undefined) item.details = req.body.details;
    let attestation = {};
    try {
      attestation = JSON.parse(req.body.attestation || '{}');
    } catch {
      attestation = {};
    }
    if (Object.keys(attestation).length) item.attestation = attestation;
    else delete item.attestation;
    if (req.body.imageDescription !== undefined && item.image?.url) item.image = { ...item.image, description: req.body.imageDescription };

    if (req.file) {
      if (item.image?.url) {
        const oldPath = path.join(UPLOADS_DIR, item.image.url.replace('/uploads/', ''));
        await unlinkIfExists(oldPath);
      }
      item.image = { url: `/uploads/news/${req.file.filename}`, description: req.body.imageDescription || '' };
    }
    if (req.body.removeImage === '1') {
      if (item.image?.url) {
        const oldPath = path.join(UPLOADS_DIR, item.image.url.replace('/uploads/', ''));
        await unlinkIfExists(oldPath);
      }
      delete item.image;
    }

    const albumId = parseOptionalInt(req.body.albumId);
    albums.forEach((a) => { if (a.id === albumId) a.newsId = id; });
    const videoId = parseOptionalInt(req.body.videoId);
    videos.forEach((v) => { if (v.id === videoId) v.newsId = id; });

    await writeJson(NEWS_FILE, news);
    await writeJson(ALBUMS_FILE, albums);
    await writeJson(VIDEO_FILE, videos);
    res.json({ success: true, data: item });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.delete('/news/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const news = await readJson(NEWS_FILE);
    const albums = await readJson(ALBUMS_FILE);
    const videos = await readJson(VIDEO_FILE);
    const item = news.find((n) => n.id === id);
    if (!item) return res.status(404).json({ success: false, message: 'Новость не найдена' });

    if (item.image?.url) {
      const oldPath = path.join(UPLOADS_DIR, item.image.url.replace('/uploads/', ''));
      await unlinkIfExists(oldPath);
    }
    albums.forEach((a) => { if (a.newsId === id) a.newsId = null; });
    videos.forEach((v) => { if (v.newsId === id) v.newsId = null; });

    await writeJson(NEWS_FILE, news.filter((n) => n.id !== id));
    await writeJson(ALBUMS_FILE, albums);
    await writeJson(VIDEO_FILE, videos);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

/* NEWS END */

/* ALBUMS START */

router.get('/albums', async (req, res) => {
  try {
    res.json(await readJson(ALBUMS_FILE));
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.post('/albums', upload.array('photos', 100), async (req, res) => {
  try {
    const albums = await readJson(ALBUMS_FILE);
    const id = nextId(albums);
    const date = req.body.date || new Date().toISOString().slice(0, 10);
    const photos = (req.files || []).map((f) => `/uploads/albums/${f.filename}`);
    const item = {
      newsId: parseOptionalInt(req.body.newsId),
      id,
      title: req.body.title || '',
      date,
      photos,
    };
    albums.push(item);
    await writeJson(ALBUMS_FILE, albums);
    res.json({ success: true, data: item });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.put('/albums/:id', upload.array('photos', 100), async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const albums = await readJson(ALBUMS_FILE);
    const item = albums.find((a) => a.id === id);
    if (!item) return res.status(404).json({ success: false, message: 'Альбом не найден' });

    const date = req.body.date || item.date;
    item.newsId = parseOptionalInt(req.body.newsId);
    item.title = req.body.title ?? item.title;
    item.date = date;

    const removed = JSON.parse(req.body.removedPhotos || '[]');
    for (const photoUrl of removed) {
      if (!photoUrl.startsWith('/uploads/')) continue;
      await unlinkIfExists(path.join(UPLOADS_DIR, photoUrl.replace('/uploads/', '')));
    }
    item.photos = item.photos.filter((p) => !removed.includes(p));
    (req.files || []).forEach((f) => item.photos.push(`/uploads/albums/${f.filename}`));

    await writeJson(ALBUMS_FILE, albums);
    res.json({ success: true, data: item });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.delete('/albums/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const albums = await readJson(ALBUMS_FILE);
    const item = albums.find((a) => a.id === id);
    if (!item) return res.status(404).json({ success: false, message: 'Альбом не найден' });

    for (const photoUrl of item.photos || []) {
      if (!photoUrl.startsWith('/uploads/')) continue;
      await unlinkIfExists(path.join(UPLOADS_DIR, photoUrl.replace('/uploads/', '')));
    }
    await writeJson(ALBUMS_FILE, albums.filter((a) => a.id !== id));
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

/* ALBUMS END */

/* VIDEOS START */

router.get('/video', async (req, res) => {
  try {
    res.json(await readJson(VIDEO_FILE));
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.post('/video', async (req, res) => {
  try {
    const videos = await readJson(VIDEO_FILE);
    const id = nextId(videos);
    const date = req.body.date || new Date().toISOString().slice(0, 10);
    const item = {
      newsId: parseOptionalInt(req.body.newsId),
      id,
      date,
      videoId: req.body.videoId || '',
      title: req.body.title || '',
    };
    videos.push(item);
    await writeJson(VIDEO_FILE, videos);
    res.json({ success: true, data: item });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.put('/video/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const videos = await readJson(VIDEO_FILE);
    const item = videos.find((v) => v.id === id);
    if (!item) return res.status(404).json({ success: false, message: 'Видео не найдено' });

    const date = req.body.date || item.date;
    item.newsId = parseOptionalInt(req.body.newsId);
    item.date = date;
    item.videoId = req.body.videoId ?? item.videoId;
    item.title = req.body.title ?? item.title;

    await writeJson(VIDEO_FILE, videos);
    res.json({ success: true, data: item });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.delete('/video/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const videos = await readJson(VIDEO_FILE);
    if (!videos.find((v) => v.id === id)) return res.status(404).json({ success: false, message: 'Видео не найдено' });
    await writeJson(VIDEO_FILE, videos.filter((v) => v.id !== id));
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

/* VIDEOS END */

export default router