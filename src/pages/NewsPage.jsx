import Markdown from "react-markdown"
import { useState, useEffect } from "react"


const NewsPage = () => {
    const [newsData, setNews] = useState([])
    const [albumsData, setAlbums] = useState([])
    const [videoData, setVideo] = useState([])

    useEffect(() => {

        const getNews = async () => {
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
                console.log(er.message)
            }
        }
        getNews()

    }, [])


    const sortedNews = [...newsData].sort((a, b) => b.date.localeCompare(a.date))
    const news = sortedNews.map((item) => {
        const hasAlbum = albumsData.find((album) => album.newsId === item.id)
        const albumCover = hasAlbum && <div className='news_card_cover'><img src={hasAlbum.photos[0]} /></div>

        const newsImgCover = item.image && <div className='news_card_cover'><img src={item.image.url} /></div>
        const hasVideo = videoData.find((video) => item.id === video.newsId)
        const thumbnailUrl = hasVideo && `https://rutube.ru/api/video/${hasVideo.videoId}/thumbnail/?redirect=1`
        const videoCover = hasVideo && <div className='news_card_cover'><img src={thumbnailUrl} alt={hasVideo.title} /></div>

        const cover = newsImgCover || albumCover || videoCover || null

        const newsContentWidth = cover ? "news_content" : 'news_short_content'

        return (
            <article className="news_card" id={item.id} key={item.id}>
                {cover}

                <div className={newsContentWidth}>
                    <div><h3>{item.title}</h3></div>
                    <div className="news_date">{item.displayDate} </div>
                    <div className="news_card_text">
                        <Markdown>{item.content}</Markdown>
                    </div>
                    <div className="read_more"><a href={`/news/${item.id}`}>Читать полностью</a></div>
                </div>
            </article>
        )
    })

    return (
        <main>
            <h1>Новости</h1>
            <div className="news__section">
                {news}
            </div>
        </main>
    )
}

export default NewsPage