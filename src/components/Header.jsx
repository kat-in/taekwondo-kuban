import Navigation from "./NavBar/Navigation"
import styles from './Header.module.css'

const Header = () => {
    return (
    <div className={`${styles.header}`} > 
    <div className={`${styles.logo}`}>
        <div className={`${styles.logo1}`}></div>
        <div className={`${styles.logo2}`}></div>
    </div>
        <Navigation/>
    </div>
)
}

export default Header