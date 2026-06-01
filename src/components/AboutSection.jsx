import styles from './AboutSection.module.css'

const AboutSection = () => {
    return (
      <div className={`${styles.about__section}`}>
      <div className={`${styles.history_fact}`}> 
        <span>МУ ДУК КВАН - одно из самых древних и боевых направлений в тхэквондо.</span>
        <span>В Корее в средние века личную охрану для императора готовили именно мастера стиля МУ ДУК КВАН.</span>
        </div>
      <div> </div>
      
      </div>
    )
}

export default AboutSection