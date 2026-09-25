import { useState, useEffect, useCallback } from "react"
import Markdown from "react-markdown"
import presidentData from "../data/presidentData"
import Breadcrumbs from "../components/Breadcrumbs"
import SEO from "../components/SEO/SEO"
import RutubeVideo from "../components/RutubeVideo"

const PresidentPage = () => {
    const { name, description, info, experience, facts, teachers, years, video } = presidentData
    const [activePhoto, setActivePhoto] = useState(null)

    const gallery = years.flatMap(({ year, photos }) => photos.map(src => ({ src, year })))

    const prevPhoto = useCallback(() => {
        setActivePhoto((current) => (current === 0 ? gallery.length - 1 : current - 1))
    }, [gallery.length])

    const nextPhoto = useCallback(() => {
        setActivePhoto((current) => (current === gallery.length - 1 ? 0 : current + 1))
    }, [gallery.length])

    useEffect(() => {
        if (activePhoto === null) return

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setActivePhoto(null)
            if (e.key === 'ArrowLeft') prevPhoto()
            if (e.key === 'ArrowRight') nextPhoto()
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [activePhoto, prevPhoto, nextPhoto])

    return (
        <main className="page__section president-page">
            <SEO
                title="Президент Ассоциации — Тхэквондо Му Дук Кван"
                description="Герасименко Илья Владимирович — президент Краснодарской городской ассоциации тхэквондо Му Дук Кван."
            />
            <Breadcrumbs />
            <h1>{description}</h1>

            <div className="president-page__facts">
                {facts.map(fact => <div key={fact} className="president-page__fact">{fact}</div>)}
            </div>

            <div className="divider"></div>

            <div className="president-page__card">
                <div className="president-page__figure">
                    <div className="president-page__img"></div>
                </div>

                <div className="president-page__info">
                    <h2>{name}</h2>
                    <div className="president-page__experience">{experience}</div>
                    <div className="divider"></div>
                    <Markdown>{info}</Markdown>
                    <ul className="president-page__teacher-list">
                        {teachers.map(teacher => <li key={teacher}>{teacher}</li>)}
                    </ul>
                </div>
            </div>

            {years.map(({ year, photos }) => (
                <div key={year} className="president-page__year">
                    <div className="president-page__year-title">{year}</div>
                    <div className="president-page__year-photos">
                        {photos.map(src => (
                            <button
                                key={src}
                                type="button"
                                className="president-page__year-item"
                                onClick={() => setActivePhoto(gallery.findIndex(photo => photo.src === src))}
                            >
                                <img src={src} alt={`${name}, ${year}`} loading="lazy" />
                            </button>
                        ))}
                    </div>
                </div>
            ))}

            <div className="president-page__year-title">{video.year}</div>
            <div className="president-page__video">
                <RutubeVideo videoId={video.id} />
            </div>

            {activePhoto !== null && (
                <div className="photo-album__lightbox" onClick={() => setActivePhoto(null)}>
                    <button className="photo-album__lightbox-close" onClick={() => setActivePhoto(null)}>×</button>
                    <button className="photo-album__lightbox-prev" onClick={(e) => { e.stopPropagation(); prevPhoto() }}>‹</button>
                    <div className="photo-album__lightbox-image" onClick={(e) => e.stopPropagation()}>
                        <img src={gallery[activePhoto].src} alt={`${name}, ${gallery[activePhoto].year}`} />
                        <div className="president-page__lightbox-caption">
                            {gallery[activePhoto].year} — {activePhoto + 1} из {gallery.length}
                        </div>
                    </div>
                    <button className="photo-album__lightbox-next" onClick={(e) => { e.stopPropagation(); nextPhoto() }}>›</button>
                </div>
            )}
        </main>
    )
}

export default PresidentPage
