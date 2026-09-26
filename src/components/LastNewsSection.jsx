import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { formatDate, sortByDateDesc } from "../utils/date"
import { getVideoThumbnail, handleThumbnailError } from "../utils/videoThumbnail"

const LastNewsSection = () => {
    const [newsData, setNewsData] = useState([])
    const [albumsData, setAlbumsData] = useState([])
    const [videoData, setVideoData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const getData = async () => {
            setLoading(true)
            setError('')
            try {
                const [newsResponse, albumsResponse, videoResponse] = await Promise.all([
                    fetch('/api/news'),
                    fetch('/api/albums'),
                    fetch('/api/video'),
                ])
                if (!newsResponse.ok || !albumsResponse.ok || !videoResponse.ok) throw new Error('Ошибка загрузки')

                const [news, albums, videos] = await Promise.all([
                    newsResponse.json(),
                    albumsResponse.json(),
                    videoResponse.json(),
                ])
                setNewsData(news)
                setAlbumsData(albums)
                setVideoData(videos)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        getData()
    }, [])

    const lastNews = sortByDateDesc(newsData).slice(0, 4).map((item) => {
        const hasAlbum = albumsData.find((album) => album.newsId === item.id && album.photos?.[0])
        const albumCover = hasAlbum && <div className='lastnews__cover'><img src={hasAlbum.photos[0]} alt={item.title} /></div>

        const newsImgCover = item.image?.url && <div className='lastnews__cover'><img src={item.image.url} alt={item.title} /></div>
        const hasVideo = videoData.find((video) => item.id === video.newsId)
        const thumbnailUrl = hasVideo && getVideoThumbnail(hasVideo.videoId)
        const videoCover = hasVideo && <div className='lastnews__cover'><img src={thumbnailUrl} alt={hasVideo.title || item.title} data-video-id={hasVideo.videoId} onError={handleThumbnailError} /></div>

        const cover = newsImgCover || albumCover || videoCover || null

        return (
            <Link className="lastnews__card" to={`/news/${item.id}`} key={item.id}>
                <div className="lastnews__title">
                    <div>{item.title} </div>
                </div>
                <div className="lastnews__content">
                    {cover}
                    <div className="lastnews__text">{item.content}</div>
                    <div className="lastnews__more">
                        <span>{item.displayDate || formatDate(item.date)}</span>
                    </div>
                </div>
            </Link>
        )
    })

    if (loading) return <section className="lastnews"><div className="lastnews__section">Загрузка...</div></section>
    if (error) return <section className="lastnews"><div className="lastnews__section">Не удалось загрузить новости <button type="button" onClick={() => window.location.reload()}>Повторить</button></div></section>

    return (
        <section className="lastnews">
            <div className="lastnews__section">
                <div className="lastnews__header">
                    <h2>Последние новости</h2>
                    <Link className="lastnews__all lastnews__all_header" to="/news">Все новости</Link>
                </div>
                <div className="lastnews__container">{lastNews}</div>
                <Link className="lastnews__all lastnews__all_bottom" to="/news">Все новости</Link>
            </div>
        </section>
    )
}

export default LastNewsSection
