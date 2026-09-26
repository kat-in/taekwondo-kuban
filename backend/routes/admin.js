import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authMiddleware, passwordFingerprint } from '../utils/auth.js';
import { readJson, writeJson, nextId, formatDisplayDate, withWriteLock } from '../utils/jsonStore.js';
import { parseAttestation, validateAlbum, validateDateValue, validateIdList, validateNewPassword, validateNews, validateVideo } from '../utils/validate.js';
import { removeThumbnail, saveThumbnailInBackground } from '../utils/thumbnails.js';

const BACKEND_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

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
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 8;
const MUTATION_WINDOW_MS = 60 * 1000;
const MUTATION_MAX_REQUESTS = 40;

const filename = (req, file, cb) => {
  const ext = path.extname(file.originalname) || '.jpg';
  cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
};

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    const error = new Error('Можно загружать только изображения');
    error.status = 400;
    return cb(error);
  }
  cb(null, true);
};

const createUploader = (destination) => multer({
  storage: multer.diskStorage({ destination: (req, file, cb) => cb(null, destination), filename }),
  limits: { fileSize: MAX_IMAGE_SIZE, files: MAX_ALBUM_PHOTOS },
  fileFilter,
});

const uploadNewsImage = createUploader(NEWS_UPLOADS_DIR);
const uploadAlbumPhotos = createUploader(ALBUMS_UPLOADS_DIR);

const parseOptionalInt = (value) => {
  const num = Number.parseInt(value, 10);
  return Number.isNaN(num) ? null : num;
};

const parseText = (value) => typeof value === 'string' ? value.trim() : '';

const parseOptionalIntList = (value) => {
  let values = value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];
    if (/^-?\d+$/.test(trimmed)) return [parseOptionalInt(trimmed)].filter((item) => item !== null);
    try {
      values = JSON.parse(trimmed);
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

const parseRemovedPhotos = (value) => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return null;
  }
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

const getUploadedFiles = (req) => req.files || (req.file ? [req.file] : []);

const discardUploads = (req) => removeUploadedFiles(getUploadedFiles(req));

const ENV_FILE = path.join(BACKEND_DIR, '.env');

const readEnvFile = async () => {
  try {
    return await fs.readFile(ENV_FILE, 'utf8');
  } catch {
    return '';
  }
};

const readEnvValue = (content, key) => {
  const line = content.split(/\r?\n/).find((item) => item.startsWith(`${key}=`));
  return line ? line.slice(key.length + 1) : null;
};

const writeEnvValue = async (key, value) => {
  const content = await readEnvFile();
  const eol = content.includes('\r\n') ? '\r\n' : '\n';
  const lines = content.split(/\r?\n/);
  const line = `${key}=${value}`;
  const index = lines.findIndex((item) => item.startsWith(`${key}=`));
  if (index === -1) {
    while (lines.length && lines[lines.length - 1].trim() === '') lines.pop();
    lines.push(line, '');
  } else {
    lines[index] = line;
  }
  const temporaryFile = `${ENV_FILE}.${process.pid}.${Date.now()}.tmp`;
  try {
    await fs.writeFile(temporaryFile, lines.join(eol), { encoding: 'utf8', mode: 0o600 });
    await fs.rename(temporaryFile, ENV_FILE);
  } catch (error) {
    await unlinkIfExists(temporaryFile);
    throw error;
  }
};

const convertUploadedImages = async (req, res, next) => {
  const files = getUploadedFiles(req);
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

const loginLimiter = rateLimit({
  windowMs: LOGIN_WINDOW_MS,
  limit: LOGIN_MAX_ATTEMPTS,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { success: false, message: 'Слишком много попыток входа, попробуйте через 15 минут' },
});

const mutationLimiter = rateLimit({
  windowMs: MUTATION_WINDOW_MS,
  limit: MUTATION_MAX_REQUESTS,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Слишком много изменений, попробуйте позже' },
});

router.post('/login', loginLimiter, async (req, res) => {
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  const passwordHash = process.env.ADMIN_PASSWORD;
  const jwtSecret = process.env.JWT_SECRET;
  if (!password || !passwordHash || !jwtSecret) {
    return res.status(401).json({ success: false, message: 'Неверный пароль' });
  }
  let isValid;
  try {
    isValid = await bcrypt.compare(password, passwordHash);
  } catch {
    return res.status(401).json({ success: false, message: 'Неверный пароль' });
  }
  if (!isValid) {
    return res.status(401).json({ success: false, message: 'Неверный пароль' });
  }
  const token = jwt.sign(
    { role: 'admin', pwd: passwordFingerprint(passwordHash) },
    jwtSecret,
    { expiresIn: '1d' },
  );
  res.json({ success: true, message: 'Успешный вход', token });
});

router.use(authMiddleware);

router.post('/password', mutationLimiter, async (req, res) => {
  const currentPassword = typeof req.body?.currentPassword === 'string' ? req.body.currentPassword : '';
  const newPassword = typeof req.body?.newPassword === 'string' ? req.body.newPassword : '';
  const repeatPassword = typeof req.body?.repeatPassword === 'string' ? req.body.repeatPassword : '';
  const currentHash = process.env.ADMIN_PASSWORD;

  if (!currentHash) {
    return res.status(500).json({ success: false, message: 'Пароль на сервере не настроен' });
  }
  const passwordError = validateNewPassword(newPassword);
  if (passwordError) {
    return res.status(400).json({ success: false, message: passwordError });
  }
  if (newPassword !== repeatPassword) {
    return res.status(400).json({ success: false, message: 'Новый пароль и подтверждение не совпадают' });
  }
  if (newPassword === currentPassword) {
    return res.status(400).json({ success: false, message: 'Новый пароль совпадает с текущим' });
  }

  try {
    const isCurrentValid = await bcrypt.compare(currentPassword, currentHash);
    if (!isCurrentValid) {
      return res.status(401).json({ success: false, message: 'Текущий пароль указан неверно' });
    }
    await withWriteLock(async () => {
      const storedHash = readEnvValue(await readEnvFile(), 'ADMIN_PASSWORD');
      if (storedHash !== currentHash) {
        const error = new Error('Пароль администратора задаётся вне .env — измените его в окружении сервера и перезапустите сервис');
        error.status = 409;
        throw error;
      }
      const newHash = await bcrypt.hash(newPassword, 12);
      await writeEnvValue('ADMIN_PASSWORD', newHash);
      process.env.ADMIN_PASSWORD = newHash;
    });
  } catch (error) {
    if (error.status === 409) {
      return res.status(409).json({ success: false, message: error.message });
    }
    console.error('Не удалось сменить пароль:', error);
    return res.status(500).json({ success: false, message: 'Не удалось сохранить новый пароль, текущий не изменён' });
  }

  console.log('Пароль администратора изменён, все ранее выданные токены аннулированы');
  res.json({ success: true, message: 'Пароль изменён. Войдите заново с новым паролем' });
});

const respond = async (req, res, task) => {
  try {
    const { status = 200, body } = await withWriteLock(task);
    if (status >= 400) await discardUploads(req);
    return res.status(status).json(body);
  } catch (error) {
    await discardUploads(req);
    console.error('Ошибка изменения данных:', error);
    return res.status(500).json({ success: false, message: 'Внутренняя ошибка сервера' });
  }
};

const conflict = (message) => ({ status: 409, body: { success: false, message } });
const notFound = (message) => ({ status: 404, body: { success: false, message } });
const invalid = (message) => ({ status: 400, body: { success: false, message } });
const ok = (data) => ({ status: 200, body: { success: true, data } });

/* NEWS START */

router.get('/news', async (req, res) => {
  res.json(await readJson(NEWS_FILE));
});

router.post('/news', mutationLimiter, uploadNewsImage.single('cover'), convertUploadedImages, (req, res) =>
  respond(req, res, async () => {
    const titleError = validateNews(req.body);
    if (titleError) return invalid(titleError);

    const news = await readJson(NEWS_FILE);
    const albums = await readJson(ALBUMS_FILE);
    const videos = await readJson(VIDEO_FILE);

    const albumId = parseOptionalInt(req.body.albumId);
    if (albumId !== null && albums.some((album) => album.id === albumId && album.newsId !== null)) {
      return conflict('Альбом уже привязан к другой новости');
    }
    if (albumId !== null && !albums.some((album) => album.id === albumId)) {
      return invalid('Выбранный альбом не найден');
    }
    const videoIds = parseVideoIds(req.body.videoIds, req.body.videoId);
    const videoIdsError = validateIdList(videoIds);
    if (videoIdsError) return invalid(videoIdsError);
    if (videoIds.some((videoId) => videos.some((video) => video.id === videoId && video.newsId !== null))) {
      return conflict('Одно из видео уже привязано к другой новости');
    }
    if (videoIds.some((videoId) => !videos.some((video) => video.id === videoId))) {
      return invalid('Одно из выбранных видео не найдено');
    }

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
    const attestation = parseAttestation(req.body.attestation);
    if (attestation) item.attestation = attestation;
    if (req.file) {
      item.image = {
        url: `/uploads/news/${req.file.filename}`,
        description: req.body.imageDescription || '',
      };
    }
    const album = albums.find((entry) => entry.id === albumId);
    if (album) album.newsId = id;
    videoIds.forEach((videoId) => {
      const video = videos.find((entry) => entry.id === videoId);
      if (video) video.newsId = id;
    });

    news.push(item);
    await writeJson(NEWS_FILE, news);
    await writeJson(ALBUMS_FILE, albums);
    await writeJson(VIDEO_FILE, videos);
    return ok(item);
  }));

router.put('/news/:id', mutationLimiter, uploadNewsImage.single('cover'), convertUploadedImages, (req, res) =>
  respond(req, res, async () => {
    const id = parseInt(req.params.id, 10);
    const news = await readJson(NEWS_FILE);
    const albums = await readJson(ALBUMS_FILE);
    const videos = await readJson(VIDEO_FILE);
    const item = news.find((entry) => entry.id === id);
    if (!item) return notFound('Новость не найдена');

    const newsError = validateNews({ ...item, ...req.body });
    if (newsError) return invalid(newsError);
    const dateError = validateDateValue(req.body.date !== undefined ? req.body.date : item.date);
    if (dateError) return invalid(dateError);

    const date = req.body.date !== undefined ? req.body.date : item.date;
    const dateChanged = date !== item.date;
    item.category = req.body.category ?? item.category;
    item.date = date;
    if (dateChanged || !item.displayDate) item.displayDate = formatDisplayDate(date);
    item.title = req.body.title ?? item.title;
    item.content = req.body.content ?? item.content;
    if (req.body.details !== undefined) item.details = req.body.details;
    const attestation = parseAttestation(req.body.attestation);
    if (attestation) item.attestation = attestation;
    else delete item.attestation;

    const albumId = parseOptionalInt(req.body.albumId);
    if (albumId !== null && albums.some((album) => album.id === albumId && album.newsId !== null && album.newsId !== id)) {
      return conflict('Альбом уже привязан к другой новости');
    }
    if (albumId !== null && !albums.some((album) => album.id === albumId)) {
      return invalid('Выбранный альбом не найден');
    }
    const videoIds = parseVideoIds(req.body.videoIds, req.body.videoId);
    const videoIdsError = validateIdList(videoIds);
    if (videoIdsError) return invalid(videoIdsError);
    if (videoIds.some((videoId) => videos.some((video) => video.id === videoId && video.newsId !== null && video.newsId !== id))) {
      return conflict('Одно из видео уже привязано к другой новости');
    }
    if (videoIds.some((videoId) => !videos.some((video) => video.id === videoId))) {
      return invalid('Одно из выбранных видео не найдено');
    }
    if (req.body.imageDescription !== undefined && item.image?.url) item.image = { ...item.image, description: req.body.imageDescription };

    const previousImagePath = item.image?.url ? resolveUploadPath(item.image.url) : null;
    if (req.file) {
      item.image = { url: `/uploads/news/${req.file.filename}`, description: req.body.imageDescription || '' };
    } else if (req.body.removeImage === '1') {
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
    if (previousImagePath && item.image?.url !== previousImagePath) await unlinkIfExists(previousImagePath);
    return ok(item);
  }));

router.delete('/news/:id', mutationLimiter, (req, res) =>
  respond(req, res, async () => {
    const id = parseInt(req.params.id, 10);
    const news = await readJson(NEWS_FILE);
    const albums = await readJson(ALBUMS_FILE);
    const videos = await readJson(VIDEO_FILE);
    const item = news.find((entry) => entry.id === id);
    if (!item) return notFound('Новость не найдена');

    albums.forEach((album) => { if (album.newsId === id) album.newsId = null; });
    videos.forEach((video) => { if (video.newsId === id) video.newsId = null; });

    await writeJson(NEWS_FILE, news.filter((entry) => entry.id !== id));
    await writeJson(ALBUMS_FILE, albums);
    await writeJson(VIDEO_FILE, videos);
    if (item.image?.url) {
      const oldPath = resolveUploadPath(item.image.url);
      if (oldPath) await unlinkIfExists(oldPath);
    }
    return { status: 200, body: { success: true } };
  }));

/* NEWS END */

/* ALBUMS START */

router.get('/albums', async (req, res) => {
  res.json(await readJson(ALBUMS_FILE));
});

router.post('/albums', mutationLimiter, uploadAlbumPhotos.array('photos', MAX_ALBUM_PHOTOS), convertUploadedImages, (req, res) =>
  respond(req, res, async () => {
    const albumError = validateAlbum(req.body);
    if (albumError) return invalid(albumError);
    const albums = await readJson(ALBUMS_FILE);
    const date = parseText(req.body.date);
    const title = parseText(req.body.title);
    const newsId = parseOptionalInt(req.body.newsId);
    if (newsId !== null && albums.some((album) => album.newsId === newsId)) {
      return conflict('К этой новости уже привязан альбом');
    }
    const news = await readJson(NEWS_FILE);
    if (newsId !== null && !news.some((entry) => entry.id === newsId)) {
      return invalid('Выбранная новость не найдена');
    }
    const item = {
      newsId,
      id: nextId(albums),
      title,
      date,
      photos: (req.files || []).map((file) => `/uploads/albums/${file.filename}`),
    };
    albums.push(item);
    await writeJson(ALBUMS_FILE, albums);
    return ok(item);
  }));

router.put('/albums/:id', mutationLimiter, uploadAlbumPhotos.array('photos', MAX_ALBUM_PHOTOS), convertUploadedImages, (req, res) =>
  respond(req, res, async () => {
    const id = parseInt(req.params.id, 10);
    const albums = await readJson(ALBUMS_FILE);
    const item = albums.find((album) => album.id === id);
    if (!item) return notFound('Альбом не найден');

    const albumError = validateAlbum({
      title: req.body.title !== undefined ? req.body.title : item.title,
      date: req.body.date !== undefined ? req.body.date : item.date,
    });
    if (albumError) return invalid(albumError);

    const removed = parseRemovedPhotos(req.body.removedPhotos);
    if (removed === null) return invalid('Некорректный список удаляемых фотографий');

    const retainedPhotos = item.photos.filter((photo) => !removed.includes(photo));
    const addedPhotos = (req.files || []).map((file) => `/uploads/albums/${file.filename}`);
    if (retainedPhotos.length + addedPhotos.length > MAX_ALBUM_PHOTOS) {
      return invalid(`В альбоме можно сохранить не более ${MAX_ALBUM_PHOTOS} фотографий`);
    }
    if (removed.some((photo) => !item.photos.includes(photo))) {
      return invalid('Список удаляемых фотографий содержит неизвестные файлы');
    }

    const newsId = parseOptionalInt(req.body.newsId);
    if (newsId !== null && albums.some((album) => album.newsId === newsId && album.id !== id)) {
      return conflict('К этой новости уже привязан альбом');
    }
    const news = await readJson(NEWS_FILE);
    if (newsId !== null && !news.some((entry) => entry.id === newsId)) {
      return invalid('Выбранная новость не найдена');
    }

    item.newsId = newsId;
    item.title = parseText(req.body.title !== undefined ? req.body.title : item.title);
    item.date = parseText(req.body.date !== undefined ? req.body.date : item.date);
    item.photos = [...retainedPhotos, ...addedPhotos];

    await writeJson(ALBUMS_FILE, albums);
    for (const photoUrl of removed) {
      const photoPath = resolveUploadPath(photoUrl);
      if (photoPath) await unlinkIfExists(photoPath);
    }
    return ok(item);
  }));

router.delete('/albums/:id', mutationLimiter, (req, res) =>
  respond(req, res, async () => {
    const id = parseInt(req.params.id, 10);
    const albums = await readJson(ALBUMS_FILE);
    const item = albums.find((album) => album.id === id);
    if (!item) return notFound('Альбом не найден');

    await writeJson(ALBUMS_FILE, albums.filter((album) => album.id !== id));
    for (const photoUrl of item.photos || []) {
      const photoPath = resolveUploadPath(photoUrl);
      if (photoPath) await unlinkIfExists(photoPath);
    }
    return { status: 200, body: { success: true } };
  }));

/* ALBUMS END */

/* VIDEOS START */

router.get('/video', async (req, res) => {
  res.json(await readJson(VIDEO_FILE));
});

router.post('/video', mutationLimiter, (req, res) =>
  respond(req, res, async () => {
    const videoError = validateVideo(req.body);
    if (videoError) return invalid(videoError);
    const videos = await readJson(VIDEO_FILE);
    const news = await readJson(NEWS_FILE);
    const newsId = parseOptionalInt(req.body.newsId);
    if (newsId !== null && !news.some((entry) => entry.id === newsId)) {
      return invalid('Новость, к которой привязывается видео, не найдена');
    }
    const item = {
      newsId,
      id: nextId(videos),
      date: parseText(req.body.date),
      videoId: parseText(req.body.videoId),
      title: parseText(req.body.title),
    };
    videos.push(item);
    await writeJson(VIDEO_FILE, videos);
    saveThumbnailInBackground(item.videoId);
    return ok(item);
  }));

router.put('/video/:id', mutationLimiter, (req, res) =>
  respond(req, res, async () => {
    const id = parseInt(req.params.id, 10);
    const videos = await readJson(VIDEO_FILE);
    const item = videos.find((video) => video.id === id);
    if (!item) return notFound('Видео не найдено');

    const videoError = validateVideo({
      title: req.body.title !== undefined ? req.body.title : item.title,
      videoId: req.body.videoId !== undefined ? req.body.videoId : item.videoId,
      date: req.body.date !== undefined ? req.body.date : item.date,
    });
    if (videoError) return invalid(videoError);

    const news = await readJson(NEWS_FILE);
    const previousVideoId = item.videoId;
    const newsId = req.body.newsId === undefined ? item.newsId : parseOptionalInt(req.body.newsId);
    if (newsId !== null && !news.some((entry) => entry.id === newsId)) {
      return invalid('Новость, к которой привязывается видео, не найдена');
    }
    item.newsId = newsId;
    item.date = parseText(req.body.date !== undefined ? req.body.date : item.date);
    item.videoId = parseText(req.body.videoId !== undefined ? req.body.videoId : item.videoId);
    item.title = parseText(req.body.title !== undefined ? req.body.title : item.title);

    await writeJson(VIDEO_FILE, videos);
    // Обложка старая больше не нужна, если ролик заменили на другой
    if (previousVideoId !== item.videoId) {
      removeThumbnail(previousVideoId);
    }
    saveThumbnailInBackground(item.videoId);
    return ok(item);
  }));

router.delete('/video/:id', mutationLimiter, (req, res) =>
  respond(req, res, async () => {
    const id = parseInt(req.params.id, 10);
    const videos = await readJson(VIDEO_FILE);
    const item = videos.find((video) => video.id === id);
    if (!item) return notFound('Видео не найдено');
    await writeJson(VIDEO_FILE, videos.filter((video) => video.id !== id));
    // Обложку удаляем, только если этот ролик больше не используется
    if (item.videoId && !videos.some((video) => video.videoId === item.videoId)) {
      removeThumbnail(item.videoId);
    }
    return { status: 200, body: { success: true } };
  }));

/* VIDEOS END */

router.use(async (error, req, res, next) => {
  if (error.status === 500 && error.message === 'Не удалось обработать фото') {
    return res.status(500).json({ success: false, message: error.message })
  }
  if (error.status === 400 && error.message === 'Можно загружать только изображения') {
    await discardUploads(req);
    return res.status(400).json({ success: false, message: error.message })
  }
  if (!(error instanceof multer.MulterError)) return next(error)
  await discardUploads(req);
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ success: false, message: 'Размер фото не должен превышать 10 МБ' })
  }
  if (error.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({ success: false, message: `В альбоме можно загрузить не более ${MAX_ALBUM_PHOTOS} фотографий за раз` })
  }
  return res.status(400).json({ success: false, message: 'Не удалось загрузить файл' })
})

export default router