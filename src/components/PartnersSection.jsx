import partnersData from "../data/partnersData"
import Markdown from "react-markdown"

const PartnersSection = () => {
    const { offer, partners, title} = partnersData

    const sponsors = partners.map((sponsor, i) =>{
        return (
           <span key={i}><Markdown>{sponsor}</Markdown></span>
        )
    })

    return (
        <section className="partners">
            <div className="partners__section">
                <h2>{title}</h2>
                <div className="partners__content">
                 {sponsors}
                </div>
                <div className="partners__offer"><Markdown>{offer}</Markdown></div>
            </div>
        </section>
    )
}

export default PartnersSection