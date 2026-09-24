import Markdown from "react-markdown"
import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import Breadcrumbs from "../components/Breadcrumbs"
import SEO from "../components/SEO/SEO"
import { formatDate, sortByDateDesc } from "../utils/date"

const NEWS_PER_PAGE = 10

const NewsPage = () => {
    const [newsData, setNews] = useState([])
    const [albumsData, setAlbums] = useState([])
    const [videoData, setVideo] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [searchParams, setSearchParams] = useSearchParams()
    const page = Math.max(1, parseInt(searchParams.get("page"), 10) || 1)

    useEffect(() => {

        const getNews = async () => {
            setLoading(true)
            setError('')
            try {
                const [resNews, resAlbums, resVideo] = await Promise.all([
                    fetch('/api/news'),
                    fetch('/api/albums'),
                    fetch('/api/video'),
                ])

                if (!resNews.ok || !resAlbums.ok || !resVideo.ok) throw new Error('Ошибка загрузки')

                const allNewsData = await resNews.json()
                const allAlbumsData = await resAlbums.json()
                const allVideoData = await resVideo.json()

                setNews(allNewsData)
                setAlbums(allAlbumsData)
                setVideo(allVideoData)
            }
            catch (er) {
                setError(er.message)
            } finally {
                setLoading(false)
            }
        }
        getNews()

    }, [])


    const sortedNews = sortByDateDesc(newsData)
    const visibleNews = sortedNews.slice(0, page * NEWS_PER_PAGE)
    const hasMore = page * NEWS_PER_PAGE < sortedNews.length
    const news = visibleNews.map((item) => {
        const hasAlbum = albumsData.find((album) => album.newsId === item.id)
        const albumCover = hasAlbum && <div className='news_card_cover'><img src={hasAlbum.photos[0]} /></div>

        const newsImgCover = item.image?.url && <div className='news_card_cover'><img src={item.image.url} /></div>
        const hasVideo = videoData.find((video) => item.id === video.newsId)
        const thumbnailUrl = hasVideo && `https://rutube.ru/api/video/${hasVideo.videoId}/thumbnail/?redirect=1`
        const videoCover = hasVideo && <div className='news_card_cover'><img src={thumbnailUrl} alt={hasVideo.title} /></div>

        const cover = newsImgCover || albumCover || videoCover || null

        const newsContentWidth = cover ? "news_content" : 'news_short_content'

        return (
            <Link className="news_card" to={`/news/${item.id}`} key={item.id}>
                {cover}

                <div className={newsContentWidth}>
                    <div><h3>{item.title}</h3></div>
                    <div className="news_date">{item.displayDate || formatDate(item.date)} </div>
                    <div className="news_card_text">
                        <Markdown>{item.content}</Markdown>
                    </div>
                </div>
            </Link>
        )
    })

    if (loading) return <main>Загрузка...</main>
    if (error) return <main>Не удалось загрузить новости <button type="button" onClick={() => window.location.reload()}>Повторить</button></main>

    return (
        <main>
            <SEO title="Новости — Тхэквондо Му Дук Кван" description="Новости Краснодарской городской ассоциации тхэквондо Му Дук Кван: соревнования, аттестация и события." />
            <div className="news__container">
            <Breadcrumbs />
            <h1>Новости</h1>
            <div className="divider"></div>
            <div className="news__section">
                {news}
            </div>
            {hasMore && (
                <div className="news__show-more">
                    <button onClick={() => setSearchParams({ page: String(page + 1) })}>
                        Показать ещё
                    </button>
                </div>
            )}
            </div>
        </main>
    )
}

export default NewsPage