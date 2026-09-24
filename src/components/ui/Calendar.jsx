import { useEffect, useMemo, useRef, useState } from "react"
import { formatDate, getTodayDate } from "../../utils/date"

const MIN_YEAR = 2000
const MAX_YEAR = 2040
const pad = (value) => String(value).padStart(2, '0')
const toDateKey = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
const parseDateKey = (value) => {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  if (![year, month, day].every(Number.isFinite)) return null
  const date = new Date(year, month - 1, day)
  return toDateKey(date) === value ? date : null
}

const Calendar = ({ value, onChange }) => {
  const [open, setOpen] = useState(false)
  const [viewMonth, setViewMonth] = useState(() => {
    const selected = parseDateKey(value)
    return selected || new Date()
  })
  const [yearInput, setYearInput] = useState(() => String(parseDateKey(value)?.getFullYear() || new Date().getFullYear()))
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false)
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const days = useMemo(() => {
    const year = viewMonth.getFullYear()
    const month = viewMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const leadingDays = (firstDay.getDay() + 6) % 7
    const totalDays = new Date(year, month + 1, 0).getDate()
    return [
      ...Array.from({ length: leadingDays }, () => null),
      ...Array.from({ length: totalDays }, (_, index) => new Date(year, month, index + 1)),
    ]
  }, [viewMonth])

  const monthLabel = viewMonth.toLocaleDateString('ru-RU', { month: 'long' })
  const selectedDateKey = value || getTodayDate()
  const selectDate = (date) => {
    onChange(toDateKey(date))
    setOpen(false)
  }
  const changeMonth = (offset) => {
    const nextMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + offset, 1)
    setViewMonth(nextMonth)
    setYearInput(String(nextMonth.getFullYear()))
  }
  const handleYearChange = (event) => {
    const nextYear = event.target.value
    setYearInput(nextYear)
    if (/^\d{4}$/.test(nextYear) && Number(nextYear) >= MIN_YEAR && Number(nextYear) <= MAX_YEAR) {
      setViewMonth((current) => new Date(Number(nextYear), current.getMonth(), 1))
    }
  }
  const handleYearBlur = () => {
    const parsedYear = Number.parseInt(yearInput, 10)
    const year = Number.isFinite(parsedYear) ? Math.min(MAX_YEAR, Math.max(MIN_YEAR, parsedYear)) : viewMonth.getFullYear()
    setYearInput(String(year))
    setViewMonth((current) => new Date(year, current.getMonth(), 1))
  }
  const handleToggle = () => {
    if (!open) {
      const selected = parseDateKey(value) || new Date()
      setViewMonth(selected)
      setYearInput(String(selected.getFullYear()))
    }
    setOpen((current) => !current)
  }

  return (
    <div className="admin-calendar" ref={ref}>
      <button type="button" className="admin-calendar__trigger" onClick={handleToggle} aria-expanded={open} aria-haspopup="dialog">
        <span>{formatDate(value) || 'Выберите дату'}</span>
        <span className="admin-calendar__chevron" aria-hidden="true">▾</span>
      </button>
      {open && (
        <div className="admin-calendar__popup" role="dialog" aria-label="Календарь">
          <div className="admin-calendar__header">
            <button type="button" className="admin-calendar__nav" onClick={() => changeMonth(-1)} aria-label="Предыдущий месяц">‹</button>
            <strong>{monthLabel}</strong>
            <input
              className="admin-calendar__year"
              type="number"
              inputMode="numeric"
              min={MIN_YEAR}
              max={MAX_YEAR}
              value={yearInput}
              onChange={handleYearChange}
              onBlur={handleYearBlur}
              onKeyDown={(event) => { if (event.key === 'Enter') event.currentTarget.blur() }}
              aria-label="Год"
            />
            <button type="button" className="admin-calendar__nav" onClick={() => changeMonth(1)} aria-label="Следующий месяц">›</button>
          </div>
          <div className="admin-calendar__weekdays" aria-hidden="true">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className="admin-calendar__grid">
            {days.map((date, index) => date ? (
              <button
                type="button"
                key={toDateKey(date)}
                className={`admin-calendar__day${toDateKey(date) === selectedDateKey ? ' admin-calendar__day_selected' : ''}`}
                onClick={() => selectDate(date)}
              >
                {date.getDate()}
              </button>
            ) : <span key={`empty-${index}`} className="admin-calendar__day admin-calendar__day_empty" />)}
          </div>
          <button type="button" className="admin-calendar__clear" onClick={() => { onChange(''); setOpen(false) }}>Очистить</button>
        </div>
      )}
    </div>
  )
}

export default Calendar
