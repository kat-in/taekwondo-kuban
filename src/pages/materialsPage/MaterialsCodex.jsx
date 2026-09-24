import codexData from "../../data/materialsData/codexData";
import SEO from "../../components/SEO/SEO";

const MaterialsCodex = () => {
    return (
        <>
            <SEO title="Кодекс чести — Тхэквондо Му Дук Кван" description="Кодекс чести спортсмена тхэквондо направления Му Дук Кван." />
            <h1> Кодекс чести спортсмена Тхэквондо направления МУ ДУК КВАН</h1>
             <div className="divider"></div>
            <ol className="codex">
                {codexData.map((item, i) => <li key={i}>{item}</li>)}
            </ol>
        </>
    );
}

export default MaterialsCodex;