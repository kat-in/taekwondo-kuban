import Navigation from "./NavBar/Navigation"
import Burger from "./NavBar/Burger"
import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <div className='header' >
            <div className='header__container'>
            <Link to='/'> <div className='header__logo'>
                <div className='logo1'></div>
                <div className='logo2'></div>
            </div>
            </Link>
            <Navigation />
            <Burger />
            </div>
        </div>
    )
}

export default Header