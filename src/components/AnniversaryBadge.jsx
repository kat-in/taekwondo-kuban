// «36 лет успеха!» — надпись с юбилеем ассоциации. На главной висит поверх
// фотографии героя, а на узких экранах переезжает в шапку между логотипами:
// фотография там скрыта, и надпись была бы не видна вовсе.
const pluralYears = (years) => {
    const mod10 = years % 10
    const mod100 = years % 100
    if (mod10 === 1 && mod100 !== 11) return 'год'
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'года'
    return 'лет'
}

const AnniversaryBadge = ({ years = 36, className = '' }) => (
    <span className={`anniversary-badge ${className}`.trim()}>{years} {pluralYears(years)} успеха!</span>
)

export default AnniversaryBadge
