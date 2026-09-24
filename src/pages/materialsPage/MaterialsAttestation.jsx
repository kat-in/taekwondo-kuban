import BeltSection from "./BeltSection"
import SEO from "../../components/SEO/SEO"
import beltData from "../../data/materialsData/beltData"




const MaterialsAttestation = () => {

    const standarts = beltData.map((belt) => {
        return (
            <BeltSection key={belt.id} data={belt} />
        )
    })

    return (
        <>
            <SEO title="Аттестационная программа — Тхэквондо Му Дук Кван" description="Аттестационная программа сдачи на пояса по тхэквондо Му Дук Кван." />
            <h1>Аттестационная программа сдачи на пояса</h1>
            <div className="divider"></div>
            <div className="attestation">{standarts}</div>
        </>
    );
}

export default MaterialsAttestation;