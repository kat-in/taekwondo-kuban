// Обложка видео: сначала локальный файл, который бэкенд сам скачивает
// с Rutube при добавлении видео, иначе — напрямую с Rutube.
// Локальный файл надёжнее: не зависит от внешнего сервиса и не грузит его
// CDN при каждом показе. Обложки лежат в backend/uploads/video-thumbs и
// попадают в бэкап вместе с остальным контентом.
const LOCAL_THUMBNAIL_BASE = '/uploads/video-thumbs'

export const getVideoThumbnail = (videoId) => {
  if (!videoId) return ''
  return `${LOCAL_THUMBNAIL_BASE}/${videoId}.jpg`
}

export const getVideoThumbnailFallback = (videoId) => {
  if (!videoId) return ''
  return `https://rutube.ru/api/video/${videoId}/thumbnail/?redirect=1`
}

// На случай если локальной обложки нет: сначала пробуем локальную,
// при ошибке переключаемся на Rutube
export const handleThumbnailError = (event) => {
  const image = event.target
  if (!image || image.dataset.fallbackApplied) return
  const videoId = image.dataset.videoId
  if (!videoId) return
  image.dataset.fallbackApplied = 'true'
  image.src = getVideoThumbnailFallback(videoId)
}
