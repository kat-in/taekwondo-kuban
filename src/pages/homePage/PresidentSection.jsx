import { Link } from "react-router-dom"
import presidentData from "../../data/presidentData"
import Markdown from "react-markdown"

const PresidentSection = () => {
    const { description, info, experience } = presidentData


    return (
        <section className="president">
            <div className="president__section">
                <div className="president__info">
                    <h2>
                        <Link to="/president">{description}</Link>
                    </h2>
                    <div>{experience}</div>
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