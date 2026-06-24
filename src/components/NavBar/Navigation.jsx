import styles from './Navigation.module.css'


const Navigation = () => {
    return (
      <ul className={`${styles.navigation}`}>
        <li><a href="/">Главная</a></li>
        <li><a href="/materials">Учебные материалы</a></li>
        <li><a href="/about">История Ассоциации</a></li>
        <li><a href="/photo">Фото</a></li>
        <li><a href="/video">Видео</a></li>
        <li><a href="/beginners">Новичкам</a></li>
        <li><a href="/news">Новости</a></li>
        <li><a href="/news/18">Приезд мастера</a></li>
      </ul>
    )
}

export default Navigation