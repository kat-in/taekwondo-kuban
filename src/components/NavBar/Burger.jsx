import { useState } from "react"

import SideMenu from "./SideMenu"

const Burger = () => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => {
        setIsOpen((prev) => !prev)
    }

    return (
        <>
            <div
                onClick={toggleMenu}
                className={`burger${isOpen ? " burger--open" : ""}`}
            >
                <div className="burger__line"></div>
                <div className="burger__line"></div>
                <div className="burger__line"></div>
            </div>
            {isOpen && (
                <div className="burger-menu">
                    <div
                        className="burger-menu__overlay"
                        onClick={toggleMenu}
                    ></div>
                    <SideMenu isOpen={isOpen} onClose={toggleMenu} />
                </div>
            )}
        </>
    )
}

export default Burger