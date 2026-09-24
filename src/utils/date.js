export const getTodayDate = () => {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
}

export const formatDate = (date) => {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return ''
  const parsed = new Date(`${date}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

export const sortByDateDesc = (items) => [...items].sort((a, b) => {
  const dateOrder = (b.date || '').localeCompare(a.date || '')
  return dateOrder || (Number(b.id) || 0) - (Number(a.id) || 0)
})
