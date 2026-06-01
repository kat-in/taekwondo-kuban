import styles from './AboutTaekwandoSection.module.css'

const AboutTaekwandoSection = () => {
    return (
        <div className={`${styles.taekwando__section}`}>
            <div className={`${styles.taekwando_title}`}><h2>О тхэквандо</h2></div>
            <div className={`${styles.taekwando_inner_block}`}>
                <div className={`${styles.history_fact}`}>
                    <h3>Исторический факт</h3>
                    <span>МУ ДУК КВАН - одно из самых древних и боевых направлений в тхэквондо.</span>
                    <span>В Корее в средние века личную охрану для императора готовили именно мастера стиля МУ ДУК КВАН.</span>
                </div>
                <div className={`${styles.taekwando_text}`}>
                    <div> Корейское боевое искусство, буквальный перевод - "путь ноги и кулака".</div>
                    <div> Всемирная Федерация Тхэквондо (В.Ф.Т.) была создана в 1955 г. Руководимая Ким Уньемом, со штаб-квартирой в Академии Тхэквондо Куккивоне г. Сеул.</div>
                    <div>С 1994 г. Тхэквондо первое боевое искусство, которое стало Олимпийским видом спорта.
                        Направление - МУ ДУК КВАН известно как самый боевой стиль Тхэквондо. Основатель этого стиля - мастер Хван Ки.</div>
                    <div>В нашей стране существует несколько школ направления МУ ДУК КВАН.
                        Одна из них Краснодарская городская Ассоциация Тхэквондо МУ ДУК КВАН.</div>

                </div>
            </div>
        </div>
    )
}

export default AboutTaekwandoSection