import instructorsData from '../../data/instructorsData'

function InstructorsSection() {
    return (
        <div className="instructors">
            <h2 className="instructors__title">Наши инструкторы</h2>
            <div className="instructors__grid">
                {instructorsData.map(({ id, name, photo }) => (
                    <figure key={id} className="instructors__item">
                        <img src={photo} alt={name} loading="lazy" />
                        <figcaption>
                            <div className="instructors__name">{name}</div>
                            <div className="instructors__role">Инструктор Ассоциации</div>
                            <div className="instructors__belt">чёрный пояс, I дан</div>
                        </figcaption>
                    </figure>
                ))}
            </div>
        </div>
    )
}

export default InstructorsSection
