import styles from './Button.module.css'
import { useState } from 'react'

const Button = ({children, handleClick}) => {
   return (
    <button className={styles.heroButton} onClick={handleClick}>{children}</button>
)
}

export default Button