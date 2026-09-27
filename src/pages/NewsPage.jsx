import { useState, useEffect, useMemo } from "react"
import { useSearchParams, Link } from "react-router-dom"
import Breadcrumbs from "../components/Breadcrumbs"
import YearDropdown from "../components/ui/YearDropdown"
import SEO from "../components/SEO/SEO"
import { formatDate, sortByDateDesc } from "../utils/date"
import toPlainText from "../utils/newsText"
import { getVideoThumbnail, handleThumbnailError } from "../utils/videoThumbnail"

const NEWS_PER_PAGE = 10

const NewsPage = () => {
    const [newsData, setNews] = useState([])
    const [albumsData, setAlbums] = useState([])
    const [videoData, setVideo] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [searchParams, setSearchParams] = useSearchParams()
    const page = Math.max(1, parseInt(searchParams.get("page"), 10) || 1)
    const year = searchParams.get("year") || ''

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


    // Годы берём из самих новостей: новые годы появятся в фильтре сами,
    // без правок кода. Год может прийти из адреса страницы, и если такого
    // года в новостях нет, добавляем его в список — иначе кнопка молча
    // показывала бы «Все годы» при непустом фильтре.
    const newsYears = useMemo(() => {
        const years = [...new Set(newsData.map((item) => item.date?.slice(0, 4)).filter(Boolean))]
        years.sort((a, b) => b - a)
        return year && !years.includes(year) ? [year, ...years] : years
    }, [newsData, year])

    const sortedNews = sortByDateDesc(newsData)
    const filteredNews = year ? sortedNews.filter((item) => item.date?.slice(0, 4) === year) : sortedNews
    const visibleNews = filteredNews.slice(0, page * NEWS_PER_PAGE)
    const hasMore = page * NEWS_PER_PAGE < filteredNews.length

    // Смена фильтра возвращает список на первую страницу, иначе после
    // переключения пользователь окажется на пустом экране.
    const buildParams = (nextYear, nextPage) => {
        const params = {}
        if (nextYear) params.year = nextYear
        if (nextPage > 1) params.page = String(nextPage)
        return params
    }

    const handleFilterChange = (nextYear) => setSearchParams(buildParams(nextYear, 1))
    const handleShowMore = () => setSearchParams(buildParams(year, page + 1))

    const news = visibleNews.map((item) => {
        const hasAlbum = albumsData.find((album) => album.newsId === item.id)
        const albumCover = hasAlbum && <div className='news_card_cover'><img src={hasAlbum.photos[0]} /></div>

        const newsImgCover = item.image?.url && <div className='news_card_cover'><img src={item.image.url} /></div>
        const hasVideo = videoData.find((video) => item.id === video.newsId)
        const thumbnailUrl = hasVideo && getVideoThumbnail(hasVideo.videoId)
        const videoCover = hasVideo && <div className='news_card_cover'><img src={thumbnailUrl} alt={hasVideo.title} data-video-id={hasVideo.videoId} onError={handleThumbnailError} /></div>

        const cover = newsImgCover || albumCover || videoCover || null

        const newsContentWidth = cover ? "news_content" : 'news_short_content'

        return (
            <Link className="news_card" to={`/news/${item.id}`} key={item.id}>
                {cover}

                <div className={newsContentWidth}>
                    <div><h3>{item.title}</h3></div>
                    <div className="news_date">{item.displayDate || formatDate(item.date)} </div>
                    <div className="news_card_text">{toPlainText(item.content)}</div>
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
            <div className="news__heading">
                <div className="news__heading-title">
                    <h1>Новости</h1>
                </div>
                <div className="news__year-filter">
                    <YearDropdown years={newsYears} value={year} onChange={handleFilterChange} />
                </div>
            </div>
            <div className="divider"></div>
            <div className="news__section">
                {news.length > 0 ? news : (
                    <p className="news__empty">За {year} год новостей нет. Выберите другой год.</p>
                )}
            </div>
            {hasMore && (
                <div className="news__show-more">
                    <button onClick={handleShowMore}>
                        Показать ещё
                    </button>
                </div>
            )}
            </div>
        </main>
    )
}

export default NewsPage