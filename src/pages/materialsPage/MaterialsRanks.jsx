import Markdown from "react-markdown"
import ranksData from "../../data/materialsData/ranksData"

const {
    general,
    children,
    experience,
    table,
    highDans,
    computerization,
    trainingAbroad,
    kupSystem,
    otherDirections
} = ranksData


const MaterialsRanks = () => {

    const tableBlock = table.rows.map(({ rank, experience }, index) => {
        return (
            <div className="ranks__row" key={index}>
                <div className={`ranks__cell cell_left`}>{rank}</div>
                <div className={`ranks__cell cell_right`}>{experience}</div>
            </div>
        )
    })

    return (
        <>
            <h1>Степени мастерства в Тхэквондо</h1>
            <div className="materials__line"></div>
            <Markdown>{general}</Markdown>
            <Markdown>{children}</Markdown>
            <Markdown>{experience}</Markdown>
            <h2>{table.caption}</h2>
            <div className="ranks__grid">{tableBlock}</div>
            <Markdown>{highDans}</Markdown>
            <Markdown>{computerization}</Markdown>
            <Markdown>{trainingAbroad}</Markdown>
            <Markdown>{kupSystem}</Markdown>
            <h2>{otherDirections.title}</h2>
            <Markdown>{otherDirections.criticism}</Markdown>
            <Markdown>{otherDirections.weapons}</Markdown>
            <Markdown>{otherDirections.politics}</Markdown>
        </>
    )
}

export default MaterialsRanks