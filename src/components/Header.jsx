import { useLocation } from "react-router-dom"
import Navigation from "./NavBar/Navigation"
import Burger from "./NavBar/Burger"
import { Link } from 'react-router-dom'

const Header = () => {
    const location = useLocation()
    const isHome = location.pathname === '/'

    return (
        <div className='header' >
            <div className='header__container'>
            <Link className='header__logo-link' to='/'> <div className='header__logo'>
                <div className='logo1'></div>
                <div className='logo2'></div>
                {!isHome && <div className='header__logo-text'><span className='header__logo-line'>Краснодарская городская</span><span className='header__logo-line'>Ассоциация Тхэквондо</span><span className='header__logo-line'>МУ ДУК КВАН</span></div>}
            </div>
            </Link>
            <Navigation />
            <Burger />
            </div>
        </div>
    )
}

export default Header
