import { useEffect, useRef, useState } from "react"
import cn from 'classnames'

const ALL_YEARS_LABEL = 'Все годы'

// Выпадающий список с годами. Пустое значение означает «все годы».
// Используется в альбомах и в списке новостей, поэтому живёт отдельно
// от страниц, чтобы выглядел и работал одинаково.
const YearDropdown = ({ years, value, onChange, allLabel = ALL_YEARS_LABEL }) => {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (year) => {
        onChange(year)
        setOpen(false)
    }

    const options = [
        { value: '', label: allLabel },
        ...years.map((year) => ({ value: year, label: year })),
    ]

    return (
        <div className="year-filter" ref={ref}>
            <button
                className={cn('year-filter__select', { 'year-filter__select_open': open })}
                onClick={() => setOpen((o) => !o)}
                aria-label="Год"
                aria-expanded={open}
            >
                {value || allLabel}
            </button>
            {open && (
                <ul className="year-filter__options" role="listbox" aria-label="Год">
                    {options.map((option) => (
                        <li key={option.value || 'all'}>
                            <button
                                className={cn('year-filter__option', { 'year-filter__option_active': value === option.value })}
                                onClick={() => handleSelect(option.value)}
                                role="option"
                                aria-selected={value === option.value}
                            >
                                {option.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default YearDropdown
