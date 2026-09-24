import { useState } from 'react'

const OPEN_BELTS_STORAGE_KEY = 'taekwondo-open-belts'

const getOpenBelts = () => {
    if (typeof window === 'undefined') {
        return []
    }

    try {
        const openBelts = JSON.parse(window.localStorage.getItem(OPEN_BELTS_STORAGE_KEY) || '[]')
        return Array.isArray(openBelts) ? openBelts : []
    } catch {
        return []
    }
}

const BeltSection = ({ data }) => {
    const { id, title, description, table, kibon, selfDefenseTechniques, phumee, kyorugi, demonstration } = data
    const [isOpen, setIsOpen] = useState(() => getOpenBelts().includes(id))

    const handleToggle = () => {
        setIsOpen((previousState) => {
            const nextState = !previousState
            const openBelts = new Set(getOpenBelts())

            if (nextState) {
                openBelts.add(id)
            } else {
                openBelts.delete(id)
            }

            try {
                window.localStorage.setItem(OPEN_BELTS_STORAGE_KEY, JSON.stringify([...openBelts]))
            } catch {
                return nextState
            }

            return nextState
        })
    }

    const tableContent = table.map((row, i) => {
        return (
            <tr key={i}>
                <td className="attestation__td">{row.standart}</td>
                <td className="attestation__td">{row.over14}</td>
                <td className="attestation__td">{row.under14}</td>
            </tr>
        )
    })



    const demonstartionContent = demonstration?.map((item, i) => <div key={i}>{item}</div>)

    const demonstrationBlock = demonstration ? <div className="attestation__block"><h3>Демонстрация силы ударов</h3>{demonstartionContent}</div> : null

    const kibonContent = kibon?.map(({ title, text }, i) => {
        return (
            <div className="attestation__row" key={i}>
                <div className="attestation__row-type">{title}:</div>
                <div className="attestation__row-content">{text}</div>
            </div>
        )
    })

    const kibonBlock = kibon ? <div className="attestation__block"><h3>Кибон</h3>{kibonContent}</div> : <h4>Демонстрация ранее изученных техник в безупречном исполнении</h4>

    const selfDefenseContent = selfDefenseTechniques.map(({ title, text }, i) => {
        return (
            <div className="attestation__row" key={i}>
                <div className="attestation__row-type">{title}</div>
                <div className="attestation__row-content">{text}</div>
            </div>
        )
    })

    return (
        <div className={`attestation__section ${isOpen ? 'attestation__section_open' : ''}`}>
            <h2 className="attestation__summary">
                <button
                    type="button"
                    className="attestation__summary-button"
                    aria-expanded={isOpen}
                    aria-controls={`attestation-${id}`}
                    onClick={handleToggle}
                >
                    <span className={`${id}_belt attestation__section-title`}>
                        <span>{title}</span>
                        <span>({description})</span>
                    </span>
                </button>
            </h2>
            <div id={`attestation-${id}`} className="attestation__content-wrapper" aria-hidden={!isOpen}>
                <div className="attestation__content">
                    <table className="attestation__table">
                        <thead>
                            <tr className="attestation__tr">
                                <th className="attestation__tr">Нормативы</th>
                                <th className="attestation__tr">старше 14 лет</th>
                                <th className="attestation__tr">до 14 лет</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableContent}
                        </tbody>
                    </table>

                    {kibonBlock}

                    <div className="attestation__block">
                        <h3>Техника самообороны</h3>
                        {selfDefenseContent}
                    </div>

                    <div className="attestation__block">
                        <h3>Пхумеэ</h3>
                        {phumee.map((item, i) => <div key={i}>{item}</div>)}
                    </div>

                    <div className="attestation__block">
                        <h3>Кёруги</h3>
                        {kyorugi}
                    </div>

                    {demonstrationBlock}
                </div>
            </div>
        </div>

    )
}

export default BeltSection