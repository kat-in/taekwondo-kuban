import { useState } from 'react'
import { getVideoThumbnail, handleThumbnailError } from '../utils/videoThumbnail'

// Плеер Rutube подгружается только по клику. Показываем обложку с кнопкой
// play, а iframe создаём уже в момент нажатия: до этого запросов к Rutube
// нет вообще. Это снимает лишнюю нагрузку на их плеер и убирает блокировки
// по IP при частом открытии страниц с видео.
const RutubeVideo = ({ videoId, title = 'Видео' }) => {
  const [isPlaying, setIsPlaying] = useState(false)

  if (isPlaying) {
    return (
      <iframe
        className="rutube-video__player"
        src={`https://rutube.ru/play/embed/${videoId}/`}
        allow="autoplay; fullscreen; playsinline; encrypted-media; picture-in-picture"
        allowFullScreen
        title={title}
      />
    )
  }

  return (
    <button
      type="button"
      className="rutube-video__preview"
      onClick={() => setIsPlaying(true)}
      aria-label={`Смотреть видео: ${title}`}
    >
      <img
        className="rutube-video__poster"
        src={getVideoThumbnail(videoId)}
        alt={title}
        loading="lazy"
        data-video-id={videoId}
        onError={handleThumbnailError}
      />
      <span className="rutube-video__play" aria-hidden="true" />
    </button>
  )
}

export default RutubeVideo
