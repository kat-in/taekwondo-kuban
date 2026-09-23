import { useEffect, useState } from "react"
import cn from 'classnames'
import Breadcrumbs from "../../components/Breadcrumbs"
import RutubeVideo from "../../components/RutubeVideo"

const tabs = [
    { id: 'photo', title: 'Фото' },
    { id: 'video', title: 'Видео' },
]

const GalleryPage = () => {
    const [activeTab, setActiveTab] = useState('photo')
    const [albums, setAlbums] = useState([])
    const [videos, setVideos] = useState([])
    const [activeVideo, setActiveVideo] = useState(null)

    useEffect(() => {
        const getData = async () => {
            try {
                const [resAlbums, resVideo] = await Promise.all([
                    fetch('/api/albums'),
                    fetch('/api/video'),
                ])
                if (!resAlbums.ok || !resVideo.ok) throw new Error('Ошибка загрузки')

                const [allAlbums, allVideos] = await Promise.all([
                    resAlbums.json(),
                    resVideo.json(),
                ])

                setAlbums(allAlbums)
                setVideos(allVideos)
            }
            catch (er) {
                console.log(er.message)
            }
        }
        getData()
    }, [])

    const sortedAlbums = [...albums].sort((a, b) => b.date.localeCompare(a.date))
    const sortedVideos = [...videos].sort((a, b) => b.date.localeCompare(a.date))

    const photoCards = sortedAlbums.map((album) => (
        <a key={album.id} className="photo__album-card" href={`/gallery/${album.id}`}>
            <div className="photo__album-cover">
                <img src={album.photos[0]} alt={album.title} loading="lazy" />
            </div>
            <div className="photo__album-title">{album.title}</div>
            <div className="photo__album-date">{new Date(album.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
        </a>
    ))

    const videoCards = sortedVideos.map((video) => {
        const thumbnailUrl = `https://rutube.ru/api/video/${video.videoId}/thumbnail/?redirect=1`
        return (
            <button key={video.videoId} className="photo__video-card" onClick={() => setActiveVideo(video)}>
                <div className="photo__video-cover">
                    <img src={thumbnailUrl} alt={video.title} loading="lazy" />
                    <div className="photo__video-play"></div>
                </div>
                <div className="photo__video-title">{video.title}</div>
                <div className="photo__video-date">{new Date(video.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            </button>
        )
    })

    const navLinks = tabs.map((tab) => {
        const isActive = activeTab === tab.id
        const navLinkStyles = cn('photo__nav-link', { 'photo__nav-link_active': isActive })
        return (
            <button key={tab.id} className={navLinkStyles} onClick={() => setActiveTab(tab.id)}>
                {tab.title}
            </button>
        )
    })

    return (
        <main>
            <div className="photo__layout">
                <div className="photo__sidebar">
                    {navLinks}
                </div>

                <div className="photo__content">
                    <div className="photo__content-header">
                        <Breadcrumbs />
                    </div>

                    {activeTab === 'photo' ? (
                        <>
                            <div className="photo__content-title">
                                <h1>Фотоальбомы</h1>
                                <div className="divider"></div>
                            </div>
                            <div className="photo__albums">{photoCards}</div>
                        </>
                    ) : (
                        <>
                            <div className="photo__content-title">
                                <h1>Видео</h1>
                                <div className="divider"></div>
                            </div>
                            <div className="photo__videos">{videoCards}</div>
                        </>
                    )}
                </div>
            </div>

            {activeVideo && (
                <div className="photo__modal" onClick={() => setActiveVideo(null)}>
                    <div className="photo__modal-window" onClick={(e) => e.stopPropagation()}>
                        <button className="photo__modal-close" onClick={() => setActiveVideo(null)}>×</button>
                        <h2 className="photo__modal-title">{activeVideo.title}</h2>
                        <div className="photo__modal-video">
                            <RutubeVideo videoId={activeVideo.videoId} />
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}

export default GalleryPage