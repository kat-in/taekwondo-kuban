import codexData from "../../data/materialsData/codexData";

const MaterialsCodex = () => {
    return (
        <>
            <h1> Кодекс чести спортсмена Тхэквондо направления МУ ДУК КВАН</h1>
            <div className="materials__line"></div>
            <ol className="codex">
                {codexData.map((item, i) => <li key={i}>{item}</li>)}
            </ol>
        </>
    );
}

export default MaterialsCodex;