import newsData from "../data/newsData"

const NewsPage = () => {
    const sortedNews = [...newsData].sort((a, b) => b.date.localeCompare(a.date))
    const news = sortedNews.map((item) => {
        const image = item.image && <img className='news_card_img' src={item.image.url}/>
        const images = item.images &&  item.images.map((image) => <img className='news_card_images' src={image.url} key={image.url}/>)
        const details = item.details && <div className="news_card_details">{item.details}</div>
        return (
            <article className="news_card" id={item.id} key={item.id}>
                <div className="news_date">{item.displayDate}</div>
                <div className="news_content">
                    <div>{item.content}</div>
                    {image}
                    {details}
                    {images}
                </div>
            </article>
        )
    })

    return (
        <>
            <h1>Новости</h1>
             <ul className="news_filter">
                <li>Аттестация</li>
                <li>Соревнования</li>
                <li>Все новости</li>
            </ul>
            <div className="news__section">
                {news}

            </div>
        </>
    )
}

export default NewsPage