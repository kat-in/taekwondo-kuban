import newsData from "../data/newsData"
import Markdown from "react-markdown"

const NewsPage = () => {
    const sortedNews = [...newsData].sort((a, b) => b.date.localeCompare(a.date))
    const news = sortedNews.map((item) => {
        const image = item.image && <img className='news_card_cover' src={item.image.url} />
        const images = item.images && item.images.map((image) => <img className='news_card_images' src={image.url} key={image.url} />)
        const cover = item.cover && <div className='news_card_cover'><img src={item.cover} /></div>

        return (
            <article className="news_card" id={item.id} key={item.id}>
                {cover}
               
                <div className="news_content">
                    <div className="news_card_text">
                         <div>{item.category} </div>
                          <div className="news_date">{item.displayDate} </div>
                        <Markdown>{item.content}</Markdown>
                        <a href={`/news/${item.id}`}>Читать полностью</a>
                    </div>
                 
                    
                    
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