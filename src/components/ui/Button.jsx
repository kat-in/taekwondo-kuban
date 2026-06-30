import { useState } from 'react'

const Button = ({children, handleClick}) => {
   return (
    <button className="hero__button" onClick={handleClick}>{children}</button>
)
}

export default Button