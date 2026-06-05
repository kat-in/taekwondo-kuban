import { useParams } from "react-router";
import newsData from "../data/newsData";
import albumsData from "../data/albumsData";
import { useNavigate } from "react-router";
import Markdown from 'react-markdown';
import videoData from "../data/videoData";
import RutubeVideo from "../components/RutubeVideo";



const NewsDetailPage = () => {
    const navigate = useNavigate()
    const newsId = Number(useParams().id);
    const current = newsData.find(news => news.id === newsId);
    const image = current.image && <img src={current.image.url} />
    const details = current.details && <div >{current.details}</div>
    const album = albumsData.find((album) => album.newsId === Number(newsId))

    const videos = videoData.filter((video) => video.newsId === newsId)
    console.log(videos)

    const images = album && album.photos.map((photo) => <div key={photo}><img src={photo}/></div>)
    const video = videos && videos.map((item) => <div className='video_container' key={item.id} ><h4>{item.title}</h4><RutubeVideo videoId={item.videoId}/></div>)
   

    return (
        <>
            <div className="news__detail__section">
                <div>{current.displayDate}</div>
                <Markdown>{current.content}</Markdown>
                {video}
              <div className="news__detail__images">{images}</div>
                {details}
                 <button onClick={() => navigate(-1)}>Назад</button>
            </div>

           
        </>
    )

}
export default NewsDetailPage