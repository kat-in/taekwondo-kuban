import poomsaeData from "../../data/materialsData/poomsaeData";
import Markdown from "react-markdown";

const MaterialsPoomsae = () => {
    const poomsae = poomsaeData.map(({ name, translation, description }, index) => {
        return (
            <dl className="poomsae__block" key={index}>
                <dt className="poomsae__title"><h2>{`${name} (${translation})`}</h2></dt>
                <dd className="poomsae__description"><Markdown>{description}</Markdown></dd>
            </dl>
        )
    })

    return (
        <>
            <h1>Значение каждого пумсэ</h1>
            <div className="materials__line"></div>
            <div className="poomsae">{poomsae}</div>

        </>
    );
}

export default MaterialsPoomsae