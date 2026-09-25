import Markdown from "react-markdown"
import historyOfAssociationData from "../data/historyOfAssociationData"
import Breadcrumbs from "../components/Breadcrumbs"
import SEO from "../components/SEO/SEO"

const AboutPage = () => {
    const { title, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, firstStudents } = historyOfAssociationData
    const withMasterPhotos = ['master1.jpeg', 'master2.jpeg', 'master3.jpeg'].map(photo => `/images/president/${photo}`)
    return (
        <>
            <main>
                <SEO title="Об ассоциации — Тхэквондо Му Дук Кван" description="История Краснодарской городской ассоциации тхэквондо Му Дук Кван и её достижения." />
                <div className="history__layout">
                    <Breadcrumbs />
                    <h1>{title}</h1>
                    <div className='divider'></div>
                    <div className="history__content">
                        <Markdown>{p1}</Markdown>
                        <div className="history__row">
                            <div className="history__row-figure">
                                <img className="history__row-photo" src="/images/president/K800_master.jpeg" alt="мастер К800" loading="lazy" />
                                <div className="history__row-caption">Мастер О Юн Шин (VIII дан)</div>
                            </div>
                            <div className="history__row-text">{p2}</div>
                            <Markdown>{p3}</Markdown>
                            <ul className="history__students">{firstStudents.map(({ name, description }) => <li key={name}><b>{name}</b>, {description}</li>)}</ul>
                        </div>
                        <Markdown>{p4}</Markdown>
                        <div>{p5}</div>
                        <Markdown>{p6}</Markdown>
                        <div className="history__president"> 
                            <Markdown>{p7}</Markdown>
                            <div>{p8}</div>
                            <div>{p9}</div>
                            <div className="history__master-photos">
                                {withMasterPhotos.map(src => <img key={src} src={src} alt="мастер Пан Мен До" loading="lazy" />)}
                                <div className="history__master-caption">С мастером ПАН МЕН ДО</div>
                            </div>

                            <Markdown>{p10}</Markdown></div>
                    </div>
                </div>

            </main>
        </>
    )
}

export default AboutPage