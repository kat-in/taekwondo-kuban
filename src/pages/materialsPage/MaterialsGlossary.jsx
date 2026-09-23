import glossaryData from '../../data/materialsData/glossaryData.js'

const TITLE = 'Словарик для запоминания'

const formatDate = () => new Date().toLocaleDateString('ru-RU')

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
            <div className="glossary__print-area">
                <h1>{TITLE}</h1>
                <div className='divider'></div>
                <div className='glossary'>{glossary}</div>
                <div className="glossary__print-footer">
                    <span>{TITLE}</span>
                    <span>{formatDate()}</span>
                </div>
            </div>

        </>
    )
}

export default MaterialsGlossary