import newsData from "../data/newsData"
import videoData from "../data/videoData"
import Markdown from "react-markdown"
import RutubeVideo from "../components/RutubeVideo"

const NewsPage = () => {
    const sortedNews = [...newsData].sort((a, b) => b.date.localeCompare(a.date))
    const news = sortedNews.map((item) => {
        const image = item.image && <img className='news_card_cover' src={item.image.url} />
        const images = item.images && item.images.map((image) => <img className='news_card_images' src={image.url} key={image.url} />)
        const imgCover = item.cover && <div className='news_card_cover'><img src={item.cover} /></div>
        const video = videoData.find((video) => item.id === video.newsId)
        const videoPreview = video && <div className="news_video_preview"><RutubeVideo videoId={video.videoId}/></div>
        const cover = imgCover || videoPreview || null

        const newsContentWidth = cover ? "news_content" : 'news_short_content'

        return (
            <article className="news_card" id={item.id} key={item.id}>
                {cover}

                <div className={newsContentWidth}>
                    <div>{item.category} </div>
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
        <>
            <h1>Новости</h1>
            {/* <ul className="news_filter">
                <li>Аттестация</li>
                <li>Соревнования</li>
                <li>Все новости</li>
            </ul> */}
            <div className="news__section">
                {news}

            </div>
        </>
    )
}

export default NewsPage