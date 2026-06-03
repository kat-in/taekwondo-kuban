import PageSection from "./PageSection"
import newsData from "../data/newsData"

const LastNewsSection = () => {
    const sortedNews = [...newsData].sort((a, b) => b.date.localeCompare(a.date))
    const lastNews = sortedNews.slice(0, 4).map((item) => {
        
        return (
            <article className="news_item" id={item.id} key={item.id}>
                <div className="news_date">{item.displayDate}</div>
                <div className="news_content">
                    <div>{item.content}</div>
                </div>
            </article>
        )
    })

    return (
        <PageSection title='Последние новости' theme='light'>
        <div>{lastNews}</div>
        </PageSection>
    )
}

export default LastNewsSection