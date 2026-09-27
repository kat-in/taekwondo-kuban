export const BELTS = [
  'Бело-желтый пояс',
  'Желтый пояс',
  'Желто-зеленый пояс',
  'Зеленый пояс',
  'Зелено-синий пояс',
  'Синий пояс',
  'Сине-красный пояс',
  'Красный пояс',
  'Красно-коричневый пояс',
  'Коричневый пояс',
]

// Чёрный пояс не входит в общий список: их мало, и показываются они
// отдельным блоком с фамилиями. Хранятся в news.blackBelts.
export const BLACK_BELT = 'Черный пояс'

export const formatDan = (dan) => {
  const n = Number(dan)
  if (!Number.isFinite(n) || n <= 0) return ''
  return `${n} дан`
}

export const humanCount = (count) => {
  const n = Number(count)
  if (Number.isNaN(n)) return count
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return `${n} человек`
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} человека`
  return `${n} человек`
}