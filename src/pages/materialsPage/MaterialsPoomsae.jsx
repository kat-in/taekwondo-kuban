import poomsaeData from "../../data/materialsData/poomsaeData";
import Markdown from "react-markdown";
import SEO from "../../components/SEO/SEO";

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
            <SEO title="Значение пумсэ — Тхэквондо Му Дук Кван" description="Значение и описание базовых форм пумсэ в тхэквондо Му Дук Кван." />
            <h1>Значение каждого пумсэ</h1>
            <div className='divider'></div>
            <div className="poomsae">{poomsae}</div>

        </>
    );
}

export default MaterialsPoomsae