import { useParams } from "react-router";
import newsData from "../data/newsData";
import { useNavigate } from "react-router";
import Markdown from 'react-markdown';


const NewsDetailPage = () => {
    const navigate = useNavigate()
    const newsId = Number(useParams().id);
    const current = newsData.find(news => news.id === newsId);
    const image = current.image && <img src={current.image.url} />
    const images = current.images && current.images.map((image) => <img src={image.url} key={image.url} />)
    const details = current.details && <div >{current.details}</div>

    return (
        <>
            <div className="news__detail__section">
                <Markdown>{current.content}</Markdown>
                {images}
                {details}
            </div>

            <button onClick={() => navigate(-1)}>Назад</button>
        </>
    )

}
export default NewsDetailPage