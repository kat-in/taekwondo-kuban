import PageSection from "./PageSection"
import newsData from "../data/newsData"

const LastNewsSection = () => {
    const sortedNews = [...newsData].sort((a, b) => b.date.localeCompare(a.date))
    const last = sortedNews.slice(0, 1).map((item) => {
        const cover = item.cover && <div className='lastnews_card_cover'><img src={item.cover} /></div>
        return (
            <article className="lastnews_card" id={item.id} key={item.id}>
                {cover}
                 <div className="lastnews_info">
                    <div>{item.category} </div>
                    <div>{item.displayDate}</div>
                </div>
                <div className="lastnews_card_text">{item.content}</div>
                <div className="read_more">
                    <a href={`/news/${item.id}`}>Читать полностью</a>
                </div>
            </article>
        )
    })
    const lastNews = sortedNews.slice(1, 4).map((item) => {

        return (
            <article id={item.id} key={item.id}>
                  <div className="lastnews_info">
                    <div>{item.category} </div>
                    <div>{item.displayDate}</div>
                </div>
                <div className="news_content">
                    <div className="lastnews_card_text">{item.content}</div>
                     <div className="read_more">
                    <a href={`/news/${item.id}`}>Читать полностью</a>
                </div>
                </div>
            </article>
        )
    })

    return (
        <PageSection title='Последние новости' theme='light'>
            <div className="lastnews_container">
                {last}
                <div className="lastnews_short">{lastNews}</div>
            </div>
        </PageSection>
    )
}

export default LastNewsSection