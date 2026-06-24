import glossaryData from '../../data/materialsData/glossaryData.js'

const MaterialsGlossary = () => {

    const glossary = glossaryData.map(({ word, translation }, index) => {
        return (
            <dl className='glossary__block' key={index}>
                <dt className='glossary__word'>{word}</dt>
                <dd className='glossary__translation'>{translation}</dd>
            </dl>
        )
    })

    return (
        <>
            <h1>Словарик для запоминания</h1>
              <div className="materials__line"></div>
            <div className='glossary'>{glossary}</div>

        </>
    )
}

export default MaterialsGlossary