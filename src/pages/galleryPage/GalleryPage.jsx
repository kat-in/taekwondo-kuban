import { useEffect, useRef, useState } from "react"
import cn from 'classnames'
import Breadcrumbs from "../../components/Breadcrumbs"
import RutubeVideo from "../../components/RutubeVideo"

const tabs = [
    { id: 'photo', title: 'Фото' },
    { id: 'video', title: 'Видео' },
]

const ALL_YEARS_LABEL = 'Все годы'

const YearDropdown = ({ years, value, onChange }) => {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (year) => {
        onChange(year)
        setOpen(false)
    }

    const options = [
        { value: 'all', label: ALL_YEARS_LABEL },
        ...years.map((year) => ({ value: year, label: year })),
    ]

    return (
        <div className="photo__year-dropdown" ref={ref}>
            <button
                className={cn('photo__year-select', { 'photo__year-select_open': open })}
                onClick={() => setOpen((o) => !o)}
                aria-label="Год"
                aria-expanded={open}
            >
                {value === 'all' ? ALL_YEARS_LABEL : value}
            </button>
            {open && (
                <ul className="photo__year-options" role="listbox" aria-label="Год">
                    {options.map((option) => (
                        <li key={option.value}>
                            <button
                                className={cn('photo__year-option', { 'photo__year-option_active': value === option.value })}
                                onClick={() => handleSelect(option.value)}
                                role="option"
                                aria-selected={value === option.value}
                            >
                                {option.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

const GalleryPage = () => {
    const CARDS_PER_PAGE = 12
    const [activeTab, setActiveTab] = useState('photo')
    const [albums, setAlbums] = useState([])
    const [videos, setVideos] = useState([])
    const [activeVideo, setActiveVideo] = useState(null)
    const [albumsVisibleCount, setAlbumsVisibleCount] = useState(CARDS_PER_PAGE)
    const [videosVisibleCount, setVideosVisibleCount] = useState(CARDS_PER_PAGE)
    const [albumsYear, setAlbumsYear] = useState('all')
    const [videosYear, setVideosYear] = useState('all')

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

    const getYears = (items) => {
        const years = [...new Set(items.map((item) => item.date.slice(0, 4)))]
        return years.sort((a, b) => b.localeCompare(a)).map(String)
    }

    const albumsYears = getYears(sortedAlbums)
    const videosYears = getYears(sortedVideos)

    const filteredAlbums = albumsYear === 'all' ? sortedAlbums : sortedAlbums.filter((album) => album.date.slice(0, 4) === albumsYear)
    const filteredVideos = videosYear === 'all' ? sortedVideos : sortedVideos.filter((video) => video.date.slice(0, 4) === videosYear)

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
        <a key={album.id} className="photo__album-card" href={`/gallery/${album.id}`}>
            <div className="photo__album-cover">
                <img src={album.photos[0]} alt={album.title} loading="lazy" />
            </div>
            <div className="photo__album-title">{album.title}</div>
            <div className="photo__album-date">{new Date(album.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
        </a>
    ))

    const videoCards = visibleVideos.map((video) => {
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
                            <RutubeVideo videoId={activeVideo.videoId} />
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}

export default GalleryPage