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
                        <li><a href="/photo">Фото и видео</a></li>
                    </ul>
                    <div clasName="footer__social">
                        <SocialButtons />
                    </div>
                </div>
                <p className="copyright">© {startYear} - {currentYear} Краснодарская городская ассоциация тхэквондо Му Дук Кван</p>

            </div>
        </div>
    )
}

export default Footer