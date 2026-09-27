import { useLocation } from "react-router-dom"
import cn from 'classnames'
import Navigation from "./NavBar/Navigation"
import Burger from "./NavBar/Burger"
import AnniversaryBadge from "./AnniversaryBadge"
import { Link } from 'react-router-dom'

const Header = () => {
    const location = useLocation()
    const isHome = location.pathname === '/'

    return (
        <div className='header' >
            <div className={cn('header__container', { 'header__container_home': isHome })}>
            <div className="header__logos">
                <Link className='header__logo-link' to='/'> <div className='header__logo'>
                    <div className='logo1'></div>
                </div>
                </Link>
                {!isHome && <div className='header__logo-text'><span className='header__logo-line'>Краснодарская городская</span><span className='header__logo-line'>Ассоциация Тхэквондо</span><span className='header__logo-line'>МУ ДУК КВАН</span></div>}
                {isHome && <AnniversaryBadge className="header__anniversary" />}
                <div className='logo2'></div>
            </div>
            <Navigation />
            <Burger />
            </div>
        </div>
    )
}

export default Header
