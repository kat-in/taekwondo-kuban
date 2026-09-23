import { useParams, useNavigate } from "react-router"
import { useState, useEffect, useCallback } from "react"
import Breadcrumbs from "../../components/Breadcrumbs"

const AlbumGalleryPage = () => {
    const navigate = useNavigate()
    const { albumId } = useParams()
    const [album, setAlbum] = useState(null)
    const [activePhoto, setActivePhoto] = useState(null)

    useEffect(() => {
        const getAlbum = async () => {
            try {
                const resAlbum = await fetch(`/api/albums/${albumId}`)
                if (!resAlbum.ok) throw new Error('Альбом не найден')
                const albumData = await resAlbum.json()
                setAlbum(albumData)
            }
            catch (er) {
                console.log(er.message)
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

    const albumDate = album?.date && new Date(album.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

    const photos = album?.photos?.map((photo, index) => (
        <button key={photo} className="photo-album__item" onClick={() => setActivePhoto(index)}>
            <img src={photo} alt={album.title} loading="lazy" />
        </button>
    ))

    return (
        <main>
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