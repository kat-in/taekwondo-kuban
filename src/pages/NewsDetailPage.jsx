import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import Markdown from 'react-markdown';
import RutubeVideo from "../components/RutubeVideo";
import Breadcrumbs from "../components/Breadcrumbs";
import NotFound from "./NotFound";
import { BELTS, humanCount } from "../utils/belts";
import { formatDate } from "../utils/date";

const NewsDetailPage = () => {
    const navigate = useNavigate()
    const [currentNews, setCurrentNews] = useState(null)
    const [currentAlbum, setCurrentAlbum] = useState(null)
    const [currentVideo, setCurrentVideo] = useState([])
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [error, setError] = useState('')
    const newsId = Number(useParams().id);

    useEffect(() => {
        let cancelled = false

        const getCurrentNews = async () => {
            try {
                const resNews = await fetch(`/api/news/${newsId}`)
                if (resNews.status === 404) {
                    if (!cancelled) setNotFound(true)
                    return
                }
                if (!resNews.ok) throw new Error('Ошибка загрузки новости')
                const currentNewsData = await resNews.json()
                if (!cancelled) setCurrentNews(currentNewsData)
            } catch (err) {
                if (!cancelled) setError(err.message)
            }
        }

        const getCurrentAlbum = async () => {
            try {
                const resAlbum = await fetch(`/api/albums/by-news/${newsId}`)
                if (resAlbum.ok) {
                    const currentAlbumData = await resAlbum.json()
                    if (!cancelled) setCurrentAlbum(currentAlbumData)
                }
            } catch (err) {
                if (!cancelled) setError(err.message)
            }
        }

        const getCurrentVideos = async () => {
            try {
                const resVideo = await fetch(`/api/video/${newsId}`)
                if (!resVideo.ok) throw new Error('Ошибка загрузки видео')
                const currentVideoData = await resVideo.json()
                if (!cancelled) setCurrentVideo(currentVideoData)
            } catch (err) {
                if (!cancelled) setError(err.message)
            }
        }

        const load = async () => {
            setLoading(true)
            setNotFound(false)
            setError('')
            setCurrentNews(null)
            setCurrentAlbum(null)
            setCurrentVideo([])
            await Promise.all([getCurrentNews(), getCurrentAlbum(), getCurrentVideos()])
            if (!cancelled) setLoading(false)
        }

        load()

        return () => { cancelled = true }
    }, [newsId])

    const image = currentNews?.image && <div className="news__detail__img_container"><img src={currentNews.image.url} alt={currentNews.image.description || currentNews.title} /><div>{currentNews.image.description}</div></div>
    const images = currentAlbum?.photos?.map((photo) => <div key={photo}><img src={photo} alt={currentAlbum.title} /></div>)
    const video = currentVideo.length > 0 && currentVideo.map((item) => <div className='video_container' key={item.id}><RutubeVideo videoId={item.videoId} /></div>)

    const attestationRows = (currentNews?.attestation && BELTS.filter((belt) => currentNews.attestation[belt] != null).reverse()) || []
    const attestation = attestationRows.length > 0 && (
        <section className="news__detail__attestation">
            <p className="news__detail__attestation-title">Результаты аттестации:</p>
            <ul>
                {attestationRows.map((belt) => (
                    <li key={belt}>{belt} - {humanCount(currentNews.attestation[belt])}</li>
                ))}
            </ul>
        </section>
    )

    if (loading) return <main><div className="news__detail__section">Загрузка...</div></main>
    if (notFound) return <NotFound />
    if (error || !currentNews) return <main><div className="news__detail__section">Не удалось загрузить новость</div></main>

    return (
        <main>
            <div className="news__detail__section">
                <Breadcrumbs name={currentNews.title} />
                <div><h2>{currentNews.title}</h2></div>
                <h3>{currentNews.displayDate || formatDate(currentNews.date)}</h3>
                <Markdown>{currentNews.content}</Markdown>
                {attestation}
                {image}
                {video}
                <div className="news__detail__images">{images}</div>
                <button className="news__back" onClick={() => navigate(-1)}>Назад</button>
            </div>
        </main>
    )

}
export default NewsDetailPage
