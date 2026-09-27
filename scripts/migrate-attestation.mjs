#!/usr/bin/env node
// Переносит результаты аттестации из старого поля `details` в структурированные
// поля. Раньше пояса хранились строкой markdown и выводились отдельным
// <Markdown>, поэтому после перехода на `attestation` они пропали из новостей,
// где `attestation` ещё не заполнен.
//
//   node scripts/migrate-attestation.mjs --dry-run   // только показать отчёт
//   node scripts/migrate-attestation.mjs             // записать изменения
//
// Что делает:
//   attestation — пояса до красного включительно, числами (src/utils/belts.js)
//   blackBelts  — чёрный пояс отдельным списком: [{ dan, name }]
//
// Скрипт идемпотентный: поля, которые уже заполнены, не трогаются, исходное
// `details` остаётся в файле как есть. Перед записью сделай бэкап: make backup
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const DATA_FILE = path.join(ROOT, 'backend', 'data', 'news.json')

const dryRun = process.argv.includes('--dry-run')

// Тот же список, что и в src/utils/belts.js: такие ключи понимает страница новости.
const BELTS = [
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
// Чёрный пояс в общий список не входит, см. src/utils/belts.js
const BLACK_BELT = 'Черный пояс'

const HEADER = /^Результаты аттестации/i
// Часть строки после разделителя: сначала число, затем «человек»,
// скобки с фамилией или ничего.
const COUNT = /^(\d+)/
// Запись без числа — это вручную вписанная фамилия: «Черный пояс I дан - Иванов».
// Внутри имени тоже есть заглавные, поэтому класс букв берём по \p{L}.
const PERSON_NAME = /^[\p{Lu}][\p{L}\s-]+$/u
// Фамилия в скобках после числа: «1 человек (Кравцов А. И.)».
const PARENTHESES = /\(([^)]+)\)/u
// Степень в названии: «Черный пояс I дан».
const DAN = /([IVX]+)\s*дан/iu
// В части данных попалось экранирование как обычный текст: «пояс\nСиний».
// Такие новости разбиваем так же, как настоящие переводы строк.
const LINE_BREAK = /\r?\n|\\n/
const ANY_DASH = /[-–—]/
// Тире внутри названия пояса («Бело-желтый») пропускаем: нужно то, после
// которого идёт число. Если числа нет, берём последнее тире.
const COUNT_DASH = /[-–—]\s*(?=\d)/

const splitRow = (text) => {
  const beforeCount = text.match(COUNT_DASH)
  if (beforeCount) {
    const at = beforeCount.index
    return [text.slice(0, at).trim(), text.slice(at + 1).trim()]
  }
  for (let i = text.length - 1; i >= 0; i -= 1) {
    if (ANY_DASH.test(text[i])) return [text.slice(0, i).trim(), text.slice(i + 1).trim()]
  }
  return null
}

// Ключ для сравнения: без markdown, без переносов строк, латинская C,
// ё приводим к е, «пояс» и «I дан» убираем.
const normalizeKey = (value) =>
  value
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/C/g, 'С') // латинская C в «Cине-красный»
    .replace(/ё/g, 'е')
    // Граница слова здесь нужна по буквам, а не по \w: кириллица в \w не входит.
    .replace(/\s+пояс(?![\p{L}])/giu, '')
    .replace(/\s+[IVX]+\s*дан(?![\p{L}])/giu, '')
    .trim()
    .toLowerCase()

const BELT_BY_KEY = new Map([...BELTS, BLACK_BELT].map((belt) => [normalizeKey(belt), belt]))

const toBeltName = (rawName) => {
  const key = normalizeKey(rawName)
  if (BELT_BY_KEY.has(key)) return BELT_BY_KEY.get(key)
  return null
}

const ROMAN = { I: 1, V: 5, X: 10 }

const toDan = (rawName) => {
  const match = rawName.match(DAN)
  if (!match) return null
  const value = [...match[1].toUpperCase()].reduce((sum, char) => sum + (ROMAN[char] || 0), 0)
  return value > 0 ? value : null
}

// Одна запись = один человек. В исходных данных чёрный пояс всегда один,
// либо с фамилией, либо просто «1 человек».
const parseBlackBelt = (rawName, tail) => {
  const dan = toDan(rawName)
  const inParentheses = tail.match(PARENTHESES)
  if (inParentheses) return { dan, name: inParentheses[1].trim() }
  if (PERSON_NAME.test(tail)) return { dan, name: tail.trim() }
  if (tail.match(COUNT)) return { dan, name: '' }
  return null
}

// Возвращает { пояса, черныеПояса, неизвестныеСтроки }.
const parseDetails = (details) => {
  const attestation = {}
  const blackBelts = []
  const unknown = []

  for (const line of String(details).split(LINE_BREAK)) {
    const text = line.replace(/[*_`]/g, '').trim()
    if (!text || HEADER.test(text)) continue

    const row = splitRow(text)
    if (!row) {
      unknown.push(text)
      continue
    }

    const [rawName, tail] = row
    const belt = toBeltName(rawName)
    if (!belt) {
      unknown.push(text)
      continue
    }

    if (belt === BLACK_BELT) {
      const entry = parseBlackBelt(rawName, tail)
      if (entry) blackBelts.push(entry)
      else unknown.push(text)
      continue
    }

    const count = tail.match(COUNT)
    if (count) {
      const value = Number(count[1])
      if (value > 0) attestation[belt] = (attestation[belt] || 0) + value
      continue
    }

    unknown.push(text)
  }

  // Ключи в порядке таймлайна поясов, от низшего к высшему.
  const ordered = {}
  for (const belt of BELTS) {
    if (attestation[belt] !== undefined) ordered[belt] = attestation[belt]
  }

  return { attestation: ordered, blackBelts, unknown }
}

const news = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'))
if (!Array.isArray(news)) throw new Error('Ожидался массив новостей в news.json')

let beltsMigrated = 0
let blackBeltsMigrated = 0
let skippedFilled = 0
let skippedEmpty = 0
let blackBeltKeysDropped = 0
const warnings = []
const notes = []

for (const item of news) {
  const hasDetails = Boolean(item?.details)
  const beltsFilled = item.attestation && Object.keys(item.attestation).length > 0
  const blackBeltsFilled = Array.isArray(item.blackBelts) && item.blackBelts.length > 0
  if (!hasDetails || (beltsFilled && blackBeltsFilled)) {
    if (hasDetails) skippedFilled += 1
    continue
  }

  const { attestation, blackBelts, unknown } = parseDetails(item.details)

  if (unknown.length) {
    warnings.push(`id ${item.id} (${item.date}) — пропущены строки: ${unknown.join(' | ')}`)
  }

  if (!beltsFilled) {
    if (Object.keys(attestation).length === 0) {
      skippedEmpty += 1
    } else {
      beltsMigrated += 1
      if (!dryRun) item.attestation = attestation
    }
  }

  if (!blackBeltsFilled && blackBelts.length > 0) {
    blackBeltsMigrated += blackBelts.length
    if (!dryRun) item.blackBelts = blackBelts
    const nameless = blackBelts.filter((entry) => !entry.name).length
    if (nameless) {
      notes.push(`id ${item.id} (${item.date}) — без фамилии, показано как «1 человек»: ${blackBelts.length - nameless} с фамилией, ${nameless} без`)
    }
  }

  // Чёрный пояс больше не хранится среди обычных: убираем ключ, если он остался
  // в attestation от прошлых запусков или вручную.
  if (item.attestation && BLACK_BELT in item.attestation) {
    blackBeltKeysDropped += 1
    if (!dryRun) delete item.attestation[BLACK_BELT]
  }
}

if (!dryRun) {
  // Тот же формат, что у jsonStore.writeJson: отступ 2 и перевод строки в конце.
  await fs.writeFile(DATA_FILE, `${JSON.stringify(news, null, 2)}\n`, 'utf8')
}

const total = news.length
const withAttestation = news.filter((item) => item.attestation && Object.keys(item.attestation).length).length
const withBlackBelts = news.filter((item) => Array.isArray(item.blackBelts) && item.blackBelts.length).length
const attestationCategory = news.filter((item) => String(item.category || '').includes('ттестац'))

console.log(`Новостей всего: ${total}`)
console.log(`С поясами: ${withAttestation} из ${attestationCategory.length} с категорией «Аттестация»`)
console.log(`С чёрными поясами по фамилиям: ${withBlackBelts}`)
console.log(dryRun ? '\nПрогон без записи (--dry-run).' : '\nГотово, файл записан.')
console.log(`  перенесено поясов из details: ${beltsMigrated}`)
console.log(`  перенесено чёрных поясов: ${blackBeltsMigrated}`)
console.log(`  уже было заполнено: ${skippedFilled}`)
console.log(`  без распознанных поясов: ${skippedEmpty}`)
console.log(`  ключей «Черный пояс» убрано из attestation: ${blackBeltKeysDropped}`)

if (warnings.length) {
  console.log(`\nТребует внимания (${warnings.length}):`)
  for (const warning of warnings) console.log(`  - ${warning}`)
} else {
  console.log('\nНераспознанных строк нет.')
}

if (notes.length) {
  console.log(`\nЗамечания (${notes.length}):`)
  for (const note of notes) console.log(`  - ${note}`)
}
