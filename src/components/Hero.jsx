import styles from './Hero.module.css'
import Button from './ui/Button'
import { useNavigate } from 'react-router'

const Hero = () => {
  const navigate = useNavigate();
    const goToBeginners = () => {
    navigate('/beginners')
  }

    return (
   <div className={`${styles.hero__section}`}>
    <div className={`${styles.hero__title__section}`}>
      <h1>
        <span className={`${styles.big}`}>Краснодарская городская Ассоциация Тхэквондо МУ ДУК КВАН</span>
       </h1>
      <h2>Мы гордимся званием лучших!</h2>
      <Button handleClick={goToBeginners}>Новичкам</Button>
    </div>
    <div className={styles.hero__img__section}>
    <img src='../../public/hero_img.png' />
    <span className={styles.rotated_text}>35 лет успеха!</span>
     </div>
    </div>
)
}

export default Hero