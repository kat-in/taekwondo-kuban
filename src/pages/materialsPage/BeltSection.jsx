
const BeltSection = ({ data }) => {
    const { id, title, description, table, kibon, selfDefenseTechniques, phumee, kyorugi, demonstration } = data

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
        <div className="attestation__section">
            <h2>
                <div className={`${id}_belt attestation__section-title`}>
                    <div>{title}</div>
                    <div>({description})</div>
                </div>
            </h2>
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

    )
}

export default BeltSection