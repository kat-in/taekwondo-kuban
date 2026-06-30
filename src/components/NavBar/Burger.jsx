import { useState } from "react"

const Burger = () => {
    const [isOpen, setIsOpen] = useState(false)

    const handleClick = () => {
      setIsOpen(true)
    }

    return (
        <div onClick={handleClick} className="burger">
            <div className="burger__line"></div>
            <div className="burger__line"></div>
            <div className="burger__line"></div>
        </div>
    )
}

export default Burger