import React from 'react';

const RutubeVideo = ({ videoId }) => {
  return (
      <iframe
        width={`100%`}
        height={`100%`}
        src={`https://rutube.ru/play/embed/${videoId}`}
        allow="clipboard-write; autoplay"
        allowFullScreen
        title="Rutube video player"
      />
  )
}

export default RutubeVideo



