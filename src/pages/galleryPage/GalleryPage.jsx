import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import cn from 'classnames'
import Breadcrumbs from "../../components/Breadcrumbs"
import SEO from "../../components/SEO/SEO"
import RutubeVideo from "../../components/RutubeVideo"
import YearDropdown from "../../components/ui/YearDropdown"
import { formatDate, sortByDateDesc } from "../../utils/date"
import { getVideoThumbnail, handleThumbnailError } from "../../utils/videoThumbnail"

const tabs = [
    { id: 'photo', title: 'Фото' },
    { id: 'video', title: 'Видео' },
]

const GalleryPage = () => {
    const CARDS_PER_PAGE = 12
    const [activeTab, setActiveTab] = useState('photo')
    const [albums, setAlbums] = useState([])
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [activeVideo, setActiveVideo] = useState(null)
    const [albumsVisibleCount, setAlbumsVisibleCount] = useState(CARDS_PER_PAGE)
    const [videosVisibleCount, setVideosVisibleCount] = useState(CARDS_PER_PAGE)
    const [albumsYear, setAlbumsYear] = useState('')
    const [videosYear, setVideosYear] = useState('')

    useEffect(() => {
        const getData = async () => {
            setLoading(true)
            setError('')
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
                setError(er.message)
            } finally {
                setLoading(false)
            }
        }
        getData()
    }, [])

    const sortedAlbums = sortByDateDesc(albums)
    const sortedVideos = sortByDateDesc(videos)

    const getYear = (item) => {
        return typeof item.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.date) ? item.date.slice(0, 4) : null
    }

    const getYears = (items) => {
        const years = [...new Set(items.map(getYear).filter(Boolean))]
        return years.sort((a, b) => b.localeCompare(a))
    }

    const albumsYears = getYears(sortedAlbums)
    const videosYears = getYears(sortedVideos)

    const filteredAlbums = !albumsYear ? sortedAlbums : sortedAlbums.filter((album) => getYear(album) === albumsYear)
    const filteredVideos = !videosYear ? sortedVideos : sortedVideos.filter((video) => getYear(video) === videosYear)

    const visibleAlbums = filteredAlbums.slice(0, albumsVisibleCount)
    const hasMoreAlbums = albumsVisibleCount < filteredAlbums.length

    const visibleVideos = filteredVideos.slice(0, videosVisibleCount)
    const hasMoreVideos = videosVisibleCount < filteredVideos.length

    const handleAlbumsYearClick = (year) => {
        setAlbumsYear(year)
        setAlbumsVisibleCount(CARDS_PER_PAGE)
    }

    const handleVideosYearClick = (year) => {
        setVideosYear(year)
        setVideosVisibleCount(CARDS_PER_PAGE)
    }

    const photoCards = visibleAlbums.map((album) => (
        <Link key={album.id} className="photo__album-card" to={`/gallery/${album.id}`}>
            <div className="photo__album-cover">
                {album.photos?.[0] ? <img src={album.photos[0]} alt={album.title} loading="lazy" /> : <span className="photo__album-empty">Нет фото</span>}
            </div>
            <div className="photo__album-title">{album.title}</div>
            <div className="photo__album-date">{formatDate(album.date)}</div>
        </Link>
    ))

    const videoCards = visibleVideos.map((video) => {
        const thumbnailUrl = getVideoThumbnail(video.videoId)
        return (
            <button key={video.id} className="photo__video-card" onClick={() => setActiveVideo(video)}>
                <div className="photo__video-cover">
                    <img
                        src={thumbnailUrl}
                        alt={video.title}
                        loading="lazy"
                        data-video-id={video.videoId}
                        onError={handleThumbnailError}
                    />
                    <div className="photo__video-play"></div>
                </div>
                <div className="photo__video-title">{video.title}</div>
                <div className="photo__video-date">{formatDate(video.date)}</div>
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

    if (loading) return <main>Загрузка...</main>
    if (error) return <main>Не удалось загрузить галерею <button type="button" onClick={() => window.location.reload()}>Повторить</button></main>

    return (
        <main>
            <SEO title="Фото и видео — Тхэквондо Му Дук Кван" description="Фотографии и видео с соревнований, аттестаций и тренировок Краснодарской ассоциации тхэквондо Му Дук Кван." />
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
                            <div className="photo__content-header-block">
                                <div className="photo__content-title">
                                    <h1>Фотоальбомы</h1>
                                </div>
                                <div className="photo__year-filter"><YearDropdown years={albumsYears} value={albumsYear} onChange={handleAlbumsYearClick} /></div>
                            </div>
                            <div className="divider"></div>
                            <div className="photo__albums">{photoCards}</div>
                            {hasMoreAlbums && (
                                <div className="news__show-more">
                                    <button onClick={() => setAlbumsVisibleCount((count) => count + CARDS_PER_PAGE)}>
                                        Показать ещё
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="photo__content-header-block">
                                <div className="photo__content-title">
                                    <h1>Видео</h1>
                                </div>
                                <div className="photo__year-filter"><YearDropdown years={videosYears} value={videosYear} onChange={handleVideosYearClick} /></div>
                            </div>
                            <div className="divider"></div>
                            <div className="photo__videos">{videoCards}</div>
                            {hasMoreVideos && (
                                <div className="news__show-more">
                                    <button onClick={() => setVideosVisibleCount((count) => count + CARDS_PER_PAGE)}>
                                        Показать ещё
                                    </button>
                                </div>
                            )}
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
                            <RutubeVideo videoId={activeVideo.videoId} title={activeVideo.title} />
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}

export default GalleryPage