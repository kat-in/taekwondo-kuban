import PageSection from "./PageSection"
import newsData from "../data/newsData"
import albumsData from "../data/albumsData"
import videoData from "../data/videoData"

const LastNewsSection = () => {
    const sortedNews = [...newsData].sort((a, b) => b.date.localeCompare(a.date))
    const lastNews = sortedNews.slice(0, 4).map((item) => {

        const hasAlbum = albumsData.find((album) => album.newsId === item.id)
        const albumCover = hasAlbum && <div className='lastnews__cover'><img src={hasAlbum.photos[0]} /></div>

        const newsImgCover = item.image && <div className='lastnews__cover'><img src={item.image.url} /></div>
        const hasVideo = videoData.find((video) => item.id === video.newsId)
        const thumbnailUrl = hasVideo && `https://rutube.ru/api/video/${hasVideo.videoId}/thumbnail/?redirect=1`
        const videoCover = hasVideo && <div className='lastnews__cover'><img src={thumbnailUrl} alt={hasVideo.title} /></div>

        const cover = newsImgCover || albumCover || videoCover || null

        return (
            <div className="lastnews__card" id={item.id} key={item.id}>
                <div className="lastnews__title">
                    <div>{item.title} </div>

                </div>
                <div className="lastnews__content">
                    {cover}
                    <div className="lastnews__text">{item.content}</div>
                    <div className="lastnews__more">
                        <a href={`/news/${item.id}`}>Читать полностью</a>
                        {item.displayDate}
                    </div>
                </div>
            </div>
        )
    })

    return (
        <section className="lastnews">
            <div className="lastnews__section">
                <h2>Последние новости</h2>
                <div className="lastnews__container">{lastNews}</div>
            </div>
        </section>
    )
}

export default LastNewsSection