import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../utils/auth.js';
import { readJson, writeJson, nextId, formatDisplayDate } from '../utils/jsonStore.js';

const BACKEND_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(BACKEND_DIR, '.env') });

const router = express.Router();
const DATA_DIR = path.join(BACKEND_DIR, 'data');
const NEWS_FILE = path.join(DATA_DIR, 'news.json');
const ALBUMS_FILE = path.join(DATA_DIR, 'albums.json');
const VIDEO_FILE = path.join(DATA_DIR, 'video.json');
const UPLOADS_DIR = path.join(BACKEND_DIR, 'uploads');
const NEWS_UPLOADS_DIR = path.join(UPLOADS_DIR, 'news');
const ALBUMS_UPLOADS_DIR = path.join(UPLOADS_DIR, 'albums');
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_ALBUM_PHOTOS = 50;
const WEBP_QUALITY = 84;
const MAX_IMAGE_DIMENSION = 2560;

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

const upload = multer({
  storage,
  limits: { fileSize: MAX_IMAGE_SIZE },
  fileFilter: (req, file, cb) => cb(null, file.mimetype.startsWith('image/')),
});

const parseOptionalInt = (value) => {
  const num = Number.parseInt(value, 10);
  return Number.isNaN(num) ? null : num;
};

const parseText = (value) => typeof value === 'string' ? value.trim() : '';

const parseOptionalIntList = (value) => {
  let values = value;
  if (typeof value === 'string') {
    try {
      values = JSON.parse(value);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(values)) return [];
  return [...new Set(values.map((item) => parseOptionalInt(item)).filter((item) => item !== null))];
};

const parseVideoIds = (value, legacyValue) => {
  if (value !== undefined) return parseOptionalIntList(value);
  if (legacyValue === undefined || legacyValue === null || legacyValue === '') return [];
  return parseOptionalIntList([legacyValue]);
};

const resolveUploadPath = (url) => {
  if (typeof url !== 'string' || !url.startsWith('/uploads/')) return null;
  const resolved = path.resolve(UPLOADS_DIR, url.slice('/uploads/'.length));
  return resolved.startsWith(`${UPLOADS_DIR}${path.sep}`) ? resolved : null;
};

await fs.mkdir(NEWS_UPLOADS_DIR, { recursive: true });
await fs.mkdir(ALBUMS_UPLOADS_DIR, { recursive: true });

const unlinkIfExists = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch {
    // файла нет — игнорируем
  }
};

const removeUploadedFiles = (files = []) => Promise.all(files.map((file) => unlinkIfExists(file.path)));

const convertUploadedImages = async (req, res, next) => {
  const files = req.files || (req.file ? [req.file] : []);
  try {
    for (const file of files) {
      const sourcePath = file.path;
      const { dir, name } = path.parse(sourcePath);
      const convertedPath = path.join(dir, `${name}-converted.webp`);
      const webpPath = path.join(dir, `${name}.webp`);
      const [originalSize, converted] = await Promise.all([
        fs.stat(sourcePath).then((stats) => stats.size),
        sharp(sourcePath)
          .rotate()
          .resize({
            width: MAX_IMAGE_DIMENSION,
            height: MAX_IMAGE_DIMENSION,
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({ quality: WEBP_QUALITY, effort: 6, smartSubsample: true })
          .toFile(convertedPath),
      ]);

      if (converted.size < originalSize) {
        await unlinkIfExists(sourcePath);
        await fs.rename(convertedPath, webpPath);
        file.path = webpPath;
        file.filename = `${name}.webp`;
        file.size = converted.size;
        file.mimetype = 'image/webp';
      } else {
        await unlinkIfExists(convertedPath);
      }
    }
    next();
  } catch (error) {
    await Promise.all(
      files.flatMap((file) => {
        const { dir, name } = path.parse(file.path);
        return [
          unlinkIfExists(file.path),
          unlinkIfExists(path.join(dir, `${name}-converted.webp`)),
        ];
      })
    );
    error.status = 500;
    error.message = 'Не удалось обработать фото';
    next(error);
  }
};

router.post('/login', async (req, res) => {
  const { password } = req.body;
  const isValid = bcrypt.compareSync(password, globalThis.process.env.ADMIN_PASSWORD);
  if (isValid) {
    const token = jwt.sign({ role: 'admin' }, globalThis.process.env.JWT_SECRET, { expiresIn: '1d' });
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

router.post('/news', upload.single('cover'), convertUploadedImages, async (req, res) => {
  try {
    const news = await readJson(NEWS_FILE);
    const albums = await readJson(ALBUMS_FILE);
    const videos = await readJson(VIDEO_FILE);
    const id = nextId(news);
    const date = req.body.date || '';
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
    const videoIds = parseVideoIds(req.body.videoIds, req.body.videoId);
    if (videoIds.some((videoId) => videos.some((video) => video.id === videoId && video.newsId !== null))) {
      return res.status(409).json({ success: false, message: 'Одно из видео уже привязано к другой новости' });
    }
    videoIds.forEach((videoId) => {
      const video = videos.find((v) => v.id === videoId);
      if (video) video.newsId = id;
    });
    news.push(item);
    await writeJson(NEWS_FILE, news);
    await writeJson(ALBUMS_FILE, albums);
    await writeJson(VIDEO_FILE, videos);
    res.json({ success: true, data: item });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.put('/news/:id', upload.single('cover'), convertUploadedImages, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const news = await readJson(NEWS_FILE);
    const albums = await readJson(ALBUMS_FILE);
    const videos = await readJson(VIDEO_FILE);
    const item = news.find((n) => n.id === id);
    if (!item) return res.status(404).json({ success: false, message: 'Новость не найдена' });

    const date = req.body.date !== undefined ? req.body.date : item.date;
    const dateChanged = date !== item.date;
    item.category = req.body.category ?? item.category;
    item.date = date;
    if (dateChanged || !item.displayDate) item.displayDate = formatDisplayDate(date);
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
    const albumId = parseOptionalInt(req.body.albumId);
    if (albumId !== null && albums.some((album) => album.id === albumId && album.newsId !== null && album.newsId !== id)) {
      return res.status(409).json({ success: false, message: 'Альбом уже привязан к другой новости' });
    }
    const videoIds = parseVideoIds(req.body.videoIds, req.body.videoId);
    if (videoIds.some((videoId) => videos.some((video) => video.id === videoId && video.newsId !== null && video.newsId !== id))) {
      return res.status(409).json({ success: false, message: 'Одно из видео уже привязано к другой новости' });
    }
    if (req.body.imageDescription !== undefined && item.image?.url) item.image = { ...item.image, description: req.body.imageDescription };

    if (req.file) {
      if (item.image?.url) {
        const oldPath = resolveUploadPath(item.image.url);
        if (oldPath) await unlinkIfExists(oldPath);
      }
      item.image = { url: `/uploads/news/${req.file.filename}`, description: req.body.imageDescription || '' };
    }
    if (req.body.removeImage === '1' && !req.file) {
      if (item.image?.url) {
        const oldPath = resolveUploadPath(item.image.url);
        if (oldPath) await unlinkIfExists(oldPath);
      }
      delete item.image;
    }

    albums.forEach((album) => {
      if (album.newsId === id) album.newsId = null;
      if (album.id === albumId) album.newsId = id;
    });
    videos.forEach((video) => {
      if (video.newsId === id) video.newsId = null;
      if (videoIds.includes(video.id)) video.newsId = id;
    });

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
      const oldPath = resolveUploadPath(item.image.url);
      if (oldPath) await unlinkIfExists(oldPath);
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

router.post('/albums', upload.array('photos', MAX_ALBUM_PHOTOS), convertUploadedImages, async (req, res) => {
  try {
    const albums = await readJson(ALBUMS_FILE);
    const date = parseText(req.body.date);
    const title = parseText(req.body.title);
    if (!title || !date) {
      await removeUploadedFiles(req.files);
      return res.status(400).json({ success: false, message: 'Укажите название и дату альбома' });
    }
    const id = nextId(albums);
    const newsId = parseOptionalInt(req.body.newsId);
    if (newsId !== null && albums.some((album) => album.newsId === newsId)) {
      return res.status(409).json({ success: false, message: 'К этой новости уже привязан альбом' });
    }
    const photos = (req.files || []).map((f) => `/uploads/albums/${f.filename}`);
    const item = {
      newsId,
      id,
      title,
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

router.put('/albums/:id', upload.array('photos', MAX_ALBUM_PHOTOS), convertUploadedImages, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const albums = await readJson(ALBUMS_FILE);
    const item = albums.find((a) => a.id === id);
    if (!item) return res.status(404).json({ success: false, message: 'Альбом не найден' });

    const date = parseText(req.body.date !== undefined ? req.body.date : item.date);
    const title = parseText(req.body.title !== undefined ? req.body.title : item.title);
    if (!title || !date) {
      await removeUploadedFiles(req.files);
      return res.status(400).json({ success: false, message: 'Укажите название и дату альбома' });
    }
    const newsId = parseOptionalInt(req.body.newsId);
    if (newsId !== null && albums.some((album) => album.newsId === newsId && album.id !== id)) {
      return res.status(409).json({ success: false, message: 'К этой новости уже привязан альбом' });
    }
    item.newsId = newsId;
    item.title = title;
    item.date = date;

    const removed = JSON.parse(req.body.removedPhotos || '[]');
    const retainedPhotos = item.photos.filter((p) => !removed.includes(p));
    if (retainedPhotos.length + (req.files || []).length > MAX_ALBUM_PHOTOS) {
      await removeUploadedFiles(req.files);
      return res.status(400).json({ success: false, message: `В альбоме можно сохранить не более ${MAX_ALBUM_PHOTOS} фотографий` });
    }
    for (const photoUrl of removed) {
      const photoPath = resolveUploadPath(photoUrl);
      if (photoPath) await unlinkIfExists(photoPath);
    }
    item.photos = retainedPhotos;
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
      const photoPath = resolveUploadPath(photoUrl);
      if (photoPath) await unlinkIfExists(photoPath);
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
    const date = parseText(req.body.date);
    const videoId = parseText(req.body.videoId);
    const title = parseText(req.body.title);
    if (!title || !videoId || !date) {
      return res.status(400).json({ success: false, message: 'Заполните название, ID ролика и дату' });
    }
    const id = nextId(videos);
    const item = {
      newsId: parseOptionalInt(req.body.newsId),
      id,
      date,
      videoId,
      title,
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

    const date = parseText(req.body.date !== undefined ? req.body.date : item.date);
    const videoId = parseText(req.body.videoId !== undefined ? req.body.videoId : item.videoId);
    const title = parseText(req.body.title !== undefined ? req.body.title : item.title);
    if (!title || !videoId || !date) {
      return res.status(400).json({ success: false, message: 'Заполните название, ID ролика и дату' });
    }
    item.newsId = parseOptionalInt(req.body.newsId);
    item.date = date;
    item.videoId = videoId;
    item.title = title;

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

router.use((error, req, res, next) => {
  if (error.status === 500 && error.message === 'Не удалось обработать фото') {
    return res.status(500).json({ success: false, message: error.message })
  }
  if (!(error instanceof multer.MulterError)) return next(error)
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ success: false, message: 'Размер фото не должен превышать 10 МБ' })
  }
  if (error.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({ success: false, message: `В альбоме можно загрузить не более ${MAX_ALBUM_PHOTOS} фотографий за раз` })
  }
  return res.status(400).json({ success: false, message: 'Не удалось загрузить файл' })
})

export default router