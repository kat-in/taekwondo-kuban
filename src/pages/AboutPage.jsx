import Markdown from "react-markdown"
import historyOfAssociationData from "../data/historyOfAssociationData"

const AboutPage = () => {
    const { title, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, firstStudents } = historyOfAssociationData
    return (
        <>
            <main>
                <div className="history__layout">
                    <h1>{title}</h1>
                    <div className='divider'></div>
                    <div className="history__content">
                        <Markdown>{p1}</Markdown>
                        <div>{p2}</div>
                        <Markdown>{p3}</Markdown>
                        <ul className="history__students">{firstStudents.map(({ name, description }) => <li key={name}><b>{name}</b>, {description}</li>)}</ul>
                        <Markdown>{p4}</Markdown>
                        <div>{p5}</div>
                        <Markdown>{p6}</Markdown>
                        <div className="history__president"> 
                            <Markdown>{p7}</Markdown>
                            <div>{p8}</div>
                            <div>{p9}</div>
                            <Markdown>{p10}</Markdown></div>
                    </div>
                </div>

            </main>
        </>
    )
}

export default AboutPage