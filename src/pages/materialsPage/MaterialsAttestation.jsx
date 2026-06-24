import BeltSection from "./BeltSection"
import beltData from "../../data/materialsData/beltData"




const MaterialsAttestation = () => {

    const standarts = beltData.map((belt) => {
        return (
            <BeltSection key={belt.id} data={belt} />
        )
    })

    return (
        <>
            <h1>Аттестационная программа сдачи на пояса</h1>
            <div className="materials__line"></div>
            <div className="attestation">{standarts}</div>
        </>
    );
}

export default MaterialsAttestation;