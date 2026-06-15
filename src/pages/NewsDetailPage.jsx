import { useParams, useNavigate } from "react-router";
import Markdown from 'react-markdown';
import RutubeVideo from "../components/RutubeVideo";
import { useState, useEffect } from "react";


const NewsDetailPage = () => {

    const navigate = useNavigate()
    const [currentNews, setCurrentNews] = useState(null)
    const [currentAlbum, setCurrentAlbum] = useState(null)
    const [currentVideo, setCurrentVideo] = useState(null)
    const newsId = Number(useParams().id);

    useEffect(() => {
        const getCurrentNews = async () => {
            try {
                const resNews = await fetch(`/api/news/${newsId}`)
                if (!resNews.ok) throw new Error('Ошибка загрузки новостей')
                const currentNewsData = await resNews.json()
                setCurrentNews(currentNewsData)
            }
            catch (er) {
                console.log(er.message)
            }
        }

        const getCurrentAlbums = async () => {

            try {
                const resAlbum = await fetch(`/api/albums/${newsId}`)
                if (!resAlbum.ok) {
                    setCurrentAlbum(null)
                }
                else {
                const currentAlbumData = await resAlbum.json()
                setCurrentAlbum(currentAlbumData)
            }
            }
            catch (er) {
                console.log(er.message)
            }
        }

        const getCurrentVideo = async () => {

            try {
                const resVideo = await fetch(`/api/video/${newsId}`)
                if (!resVideo.ok) throw new Error('Ошибка загрузки видео')
                const currentVideoData = await resVideo.json()
                setCurrentVideo(currentVideoData)
            }

            catch (er) {
                console.log(er.message)
            }
        }
        getCurrentNews()
        getCurrentAlbums()
        getCurrentVideo()

    }, [newsId])

    const image = currentNews?.image && <div className="news__detail__img_container"><img src={currentNews.image.url} /><div>{currentNews.image.description}</div></div>
    const details = currentNews?.details && <Markdown>{currentNews.details}</Markdown>
    const images = currentAlbum?.photos && currentAlbum?.photos.map((photo) => <div key={photo}><img src={photo} /></div>)
    const video = currentVideo && currentVideo.map((item) => <div className='video_container' key={item.id} ><RutubeVideo videoId={item.videoId} /></div>)


    return (
        <>
            <div className="news__detail__section">
                <div>{currentNews?.displayDate}</div>
                <div><h2>{currentNews?.title}</h2></div>
                <Markdown>{currentNews?.content}</Markdown>
                {details}
                {image}
                {video}
                <div className="news__detail__images">{images}</div>
                <button onClick={() => navigate(-1)}>Назад</button>
            </div>


        </>
    )

}
export default NewsDetailPage