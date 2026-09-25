const SideMenu = ({ onClose }) => {
    return (
        <nav className="side-menu">
            <ul className="side-menu__list">
                <li className="side-menu__item">
                    <a href="/" onClick={onClose}>Главная</a>
                </li>
                <li className="side-menu__item">
                    <a href="/beginners" onClick={onClose}>Новичкам</a>
                </li>
                <li className="side-menu__item">
                    <a href="/news" onClick={onClose}>Новости</a>
                </li>
                <li className="side-menu__item">
                    <a href="/materials" onClick={onClose}>Знания</a>
                </li>
                <li className="side-menu__item">
                    <a href="/about" onClick={onClose}>О нас</a>
                </li>
                <li className="side-menu__item">
                    <a href="/addresses" onClick={onClose}>Где заниматься</a>
                </li>
                <li className="side-menu__item">
                    <a href="/gallery" onClick={onClose}>Фото и видео</a>
                </li>
            </ul>
        </nav>
    )
}

export default SideMenu