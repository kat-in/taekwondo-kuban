import Navigation from "./NavBar/Navigation"
import Burger from "./NavBar/Burger"

const Header = () => {
    return (
        <div className='header' >
            <div className='header__container'>
            <div className='header__logo'>
                <div className='logo1'></div>
                <div className='logo2'></div>
            </div>
            <Navigation />
            <Burger />
            </div>
        </div>
    )
}

export default Header