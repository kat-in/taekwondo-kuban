#!/usr/bin/env node
// Чинит новости, в которых переносы строк попали в текст как обычные символы
// «\n» вместо настоящей строки. На странице такой текст выглядит так:
// «...школы № 11.\nВсе спортсмены были награждены…» — в одну простыню.
//
//   node scripts/fix-escaped-newlines.mjs --dry-run   // только показать отчёт
//   node scripts/fix-escaped-newlines.mjs             // записать изменения
//
// Меняется только «\n» → настоящий перенос. Хвостовые пробелы и отступы не
// трогаются: в Markdown два пробела в конце строки — это жёсткий перенос,
// и его удаление изменило бы вёрстку других строк.
// Скрипт идемпотентный и трогает только текстовые поля новостей.
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const DATA_FILE = path.join(ROOT, 'backend', 'data', 'news.json')

const dryRun = process.argv.includes('--dry-run')

const TEXT_FIELDS = ['title', 'content', 'details', 'displayDate']

// Два слеша в исходнике — это уже «\n», который мы и чиним, но ловим и один.
const ESCAPED_NEWLINE = /\\+n/g

const repair = (value) => {
  if (typeof value !== 'string' || !value.includes('\\')) return value
  return value.replace(ESCAPED_NEWLINE, '\n')
}

const news = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'))
if (!Array.isArray(news)) throw new Error('Ожидался массив новостей в news.json')

let fixedItems = 0
const changed = []

for (const item of news) {
  const fields = []

  for (const field of TEXT_FIELDS) {
    const before = item[field]
    const after = repair(before)
    if (after !== before) {
      fields.push(field)
      if (!dryRun) item[field] = after
    }
  }

  if (typeof item.image?.description === 'string') {
    const before = item.image.description
    const after = repair(before)
    if (after !== before) {
      fields.push('image.description')
      if (!dryRun) item.image.description = after
    }
  }

  if (fields.length) {
    fixedItems += 1
    changed.push(`id ${item.id} (${item.date}) — ${fields.join(', ')}`)
  }
}

if (!dryRun) {
  // Тот же формат, что у jsonStore.writeJson: отступ 2 и перевод строки в конце.
  await fs.writeFile(DATA_FILE, `${JSON.stringify(news, null, 2)}\n`, 'utf8')
}

console.log(`Новостей всего: ${news.length}`)
console.log(dryRun ? '\nПрогон без записи (--dry-run).' : '\nГотово, файл записан.')
console.log(`  исправлено новостей: ${fixedItems}`)

if (changed.length) {
  console.log(`\nИзменённые поля (${changed.length}):`)
  for (const line of changed) console.log(`  - ${line}`)
} else {
  console.log('\nИсправлять нечего.')
}
