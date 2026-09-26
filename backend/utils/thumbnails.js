import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const THUMBNAILS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'uploads', 'video-thumbs');
const THUMBNAIL_TIMEOUT_MS = 20000;
const USER_AGENT = 'Mozilla/5.0 (compatible; taekwondo-site/1.0)';

export const thumbnailsDir = THUMBNAILS_DIR;

const thumbnailPath = (videoId) => path.join(THUMBNAILS_DIR, `${videoId}.jpg`);

export const hasThumbnail = async (videoId) => {
  if (!videoId) return false;
  return fs.access(thumbnailPath(videoId)).then(() => true, () => false);
};

// Обложка лежит рядом с остальным контентом, поэтому подхватывается
// бэкапом и сохраняется в git вместе с видео.
export const saveThumbnail = async (videoId) => {
  if (!videoId || !/^[A-Za-z0-9_-]+$/.test(videoId)) {
    return { saved: false, reason: 'некорректный videoId' };
  }

  if (await hasThumbnail(videoId)) {
    return { saved: false, reason: 'уже есть' };
  }

  try {
    const response = await fetch(`https://rutube.ru/api/video/${videoId}/thumbnail/?redirect=1`, {
      redirect: 'follow',
      signal: AbortSignal.timeout(THUMBNAIL_TIMEOUT_MS),
      headers: { 'User-Agent': USER_AGENT },
    });

    if (!response.ok) {
      return { saved: false, reason: `Rutube ответил ${response.status}` };
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) {
      return { saved: false, reason: `не картинка (${contentType})` };
    }

    await fs.mkdir(THUMBNAILS_DIR, { recursive: true });
    await fs.writeFile(thumbnailPath(videoId), Buffer.from(await response.arrayBuffer()));
    return { saved: true };
  } catch (error) {
    return { saved: false, reason: error.message };
  }
};

// Обложка не критична для работы сайта: если Rutube недоступен,
// видео всё равно добавится, а картинка подтянется с Rutube в браузере.
export const saveThumbnailInBackground = (videoId) => {
  if (!videoId) return;
  saveThumbnail(videoId)
    .then((result) => {
      if (result.saved) {
        console.log(`Обложка для видео ${videoId} сохранена`);
      } else if (result.reason && result.reason !== 'уже есть') {
        console.warn(`Обложка для видео ${videoId} не сохранена: ${result.reason}`);
      }
    })
    .catch((error) => console.warn('Не удалось сохранить обложку:', error.message));
};

export const removeThumbnail = (videoId) => {
  if (!videoId || !/^[A-Za-z0-9_-]+$/.test(videoId)) return;
  fs.unlink(thumbnailPath(videoId)).catch(() => undefined);
};
