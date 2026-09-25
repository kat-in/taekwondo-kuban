import { Link } from "react-router-dom"
import instructorsData from "../../data/instructorsData"

const InstructorsSection = () => {
    return (
        <section className="places">
            <div className="places__section">
                <div className="places__header">
                    <h2 className="places__title">Наши инструкторы</h2>
                    <Link className="places__link" to="/addresses">Где заниматься</Link>
                </div>
                <div className="places__instructors">
                    {instructorsData.map(({ id, name, role, belt, photo }) => (
                        <figure key={id} className="places__instructor">
                            <img src={photo} alt={name} loading="lazy" />
                            <figcaption>
                                <div className="places__name">{name}</div>
                                <div className="places__role">{role}</div>
                                <div className="places__belt">{belt}</div>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default InstructorsSection
