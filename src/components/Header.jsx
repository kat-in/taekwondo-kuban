import { useNavigate } from 'react-router'

import Navigation from "./NavBar/Navigation"
import Burger from "./NavBar/Burger"
import SideMenu from "./NavBar/SideMenu"
import Button from "./ui/Button"

const Header = () => {
    const navigate = useNavigate();
    const goToBeginners = () => {
        navigate('/beginners')
    }

    return (
        <div className='header' >
            <div className='header__container'>
            <div className='header__logo'>
                <div className='logo1'></div>
                <div className='logo2'></div>
            </div>
            <Navigation />
            <Burger />
            {/* <SideMenu/> */}
            </div>
        </div>
    )
}

export default Header