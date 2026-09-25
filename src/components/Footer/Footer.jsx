import { Link } from "react-router-dom"
import { getToken } from "../../utils/api"
import SocialButtons from "./Socialbuttons";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 1990;
    return (
        <div className='footer' >
            <div className='footer__section'>
                <div className="footer__navigation">
                    <ul className="footer__menu">
                        <li><a href="/">Главная</a></li>
                        <li><a href="/beginners">Новичкам</a></li>
                        <li><a href="/news">Новости</a></li>
                        <li><a href="/materials">Знания</a></li>
                        <li><a href="/about">О нас</a></li>
                        <li><a href="/president">Президент</a></li>
                        <li><a href="/addresses">Где заниматься</a></li>
                        <li><a href="/gallery">Фото и видео</a></li>
                    </ul>
                    <div className="footer__social">
                        <SocialButtons />
                    </div>
                </div>
                <p className="copyright">© {startYear} - {currentYear} Краснодарская городская ассоциация тхэквондо Му Дук Кван</p>
                <div className="footer__admin">
                    <Link to={getToken() ? "/admin" : "/login"}>Для сотрудников</Link>
                </div>

            </div>
        </div>
    )
}

export default Footer