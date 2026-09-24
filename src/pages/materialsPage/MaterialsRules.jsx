import rulesData from "../../data/materialsData/rulesData";
import SEO from "../../components/SEO/SEO";

const MaterialsRules = () => {
    const { fightArea, handStrikes, legStrikes, illegal, victoryOptions } = rulesData
    const victory = victoryOptions.content.map((item, i) => <li key={i}>{item}</li>)

    return (
        <>
            <SEO title="Правила поединка — Тхэквондо Му Дук Кван" description="Правила проведения поединков спортсменов направления Му Дук Кван." />
            <h1>Правила поединка спортсменов направления МУ ДУК КВАН</h1>
            <div className='divider'></div>
            <div className="rules">
                {fightArea}
                <div className="rules__section">
                    <h3>{handStrikes.title}</h3>
                    {handStrikes.content}
                </div>
                <div className="rules__section">
                    <h3>{legStrikes.title}</h3> {legStrikes.content}
                </div>
                <div className="rules__section">
                    <h3>{illegal.title}</h3> {illegal.content}
                </div>
                <div className="rules__victory">
                    <h3>{victoryOptions.title}</h3>
                    <ol> {victory}</ol>
                   
                </div>
            </div>
        </>
    );
}

export default MaterialsRules;