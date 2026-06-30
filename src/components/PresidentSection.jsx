import presidentData from "../data/presidentData"
import Markdown from "react-markdown"

const PresidentSection = () => {
    const { name, description, info } = presidentData


    return (
        <section className="president">
            <div className="president__section">
                <div className="president__info">
                    <h2>{description}</h2>
                    <div>стаж тренерской работы - 31 год</div>
                </div>

                <div className="president__img-block">
                    <div className="president__img"></div>
                </div>

                <div className="president__text">
                    <Markdown>{info}</Markdown>
                </div>



            </div>
        </section>
    )
}

export default PresidentSection