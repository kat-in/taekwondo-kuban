import { useParams, useNavigate } from "react-router"
import { useState, useEffect, useCallback } from "react"
import Breadcrumbs from "../../components/Breadcrumbs"
import SEO from "../../components/SEO/SEO"
import NotFound from "../NotFound"
import { formatDate } from "../../utils/date"

const AlbumGalleryPage = () => {
    const navigate = useNavigate()
    const { albumId } = useParams()
    const [album, setAlbum] = useState(null)
    const [activePhoto, setActivePhoto] = useState(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const getAlbum = async () => {
            setLoading(true)
            setNotFound(false)
            setError('')
            setAlbum(null)
            try {
                const resAlbum = await fetch(`/api/albums/${albumId}`)
                if (resAlbum.status === 404) {
                    setNotFound(true)
                    return
                }
                if (!resAlbum.ok) throw new Error('Ошибка загрузки альбома')
                const albumData = await resAlbum.json()
                setAlbum(albumData)
            }
            catch (er) {
                setError(er.message)
            } finally {
                setLoading(false)
            }
        }
        getAlbum()
    }, [albumId])

    const prevPhoto = useCallback(() => {
        setActivePhoto((current) => (current === 0 ? album.photos.length - 1 : current - 1))
    }, [album])

    const nextPhoto = useCallback(() => {
        setActivePhoto((current) => (current === album.photos.length - 1 ? 0 : current + 1))
    }, [album])

    useEffect(() => {
        if (activePhoto === null) return

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setActivePhoto(null)
            if (e.key === 'ArrowLeft') prevPhoto()
            if (e.key === 'ArrowRight') nextPhoto()
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [activePhoto, album, prevPhoto, nextPhoto])

    const albumDate = formatDate(album?.date)

    const photos = album?.photos?.length ? album.photos.map((photo, index) => (
        <button key={photo} className="photo-album__item" onClick={() => setActivePhoto(index)}>
            <img src={photo} alt={album.title} loading="lazy" />
        </button>
    )) : <p className="photo-album__empty">В альбоме пока нет фотографий</p>

    if (loading) return <main><div className="photo-album__section">Загрузка...</div></main>
    if (notFound) return <NotFound />
    if (error) return <main><div className="photo-album__section">Не удалось загрузить альбом <button type="button" onClick={() => window.location.reload()}>Повторить</button></div></main>

    return (
        <main>
            <SEO title={album?.title || 'Фотоальбом'} description={`Фотографии альбома «${album?.title || 'Тхэквондо Му Дук Кван'}» на сайте Краснодарской ассоциации.`} image={album?.photos?.[0]} />
            <div className="photo-album__section">
                <Breadcrumbs name={album?.title} />
                <div className="photo-album__header">
                    <h1>{album?.title}</h1>
                    <div className="photo-album__date">{albumDate}</div>
                </div>
                <div className="divider"></div>
                <div className="photo-album__grid">{photos}</div>
                <button className="news__back" onClick={() => navigate(-1)}>Назад</button>
            </div>

            {album && activePhoto !== null && (
                <div className="photo-album__lightbox" onClick={() => setActivePhoto(null)}>
                    <button className="photo-album__lightbox-close" onClick={() => setActivePhoto(null)}>×</button>
                    <button className="photo-album__lightbox-prev" onClick={(e) => { e.stopPropagation(); prevPhoto() }}>‹</button>
                    <div className="photo-album__lightbox-image" onClick={(e) => e.stopPropagation()}>
                        <img src={album.photos[activePhoto]} alt={album.title} />
                    </div>
                    <button className="photo-album__lightbox-next" onClick={(e) => { e.stopPropagation(); nextPhoto() }}>›</button>
                </div>
            )}
        </main>
    )
}

export default AlbumGalleryPage