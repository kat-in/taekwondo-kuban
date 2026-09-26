#!/usr/bin/env node
// Докачивает обложки видео, которых ещё нет локально.
// Обычно это не нужно: бэкенд сам сохраняет обложку при добавлении видео
// через админку. Скрипт нужен после ручной правки video.json или
// если обложки были удалены из uploads.
//
//   npm run thumbnails
//
// Уже скачанные обложки не перезаписываются, для принудительного обновления
// добавь --force.
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const DATA_FILE = path.join(ROOT, 'backend', 'data', 'video.json')
const OUT_DIR = path.join(ROOT, 'backend', 'uploads', 'video-thumbs')

const force = process.argv.includes('--force')
const videos = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'))
const unique = [...new Set(videos.map((v) => v.videoId).filter(Boolean))]

await fs.mkdir(OUT_DIR, { recursive: true })

let downloaded = 0
let skipped = 0
let failed = 0

for (const videoId of unique) {
  const target = path.join(OUT_DIR, `${videoId}.jpg`)

  if (!force) {
    const exists = await fs.access(target).then(() => true, () => false)
    if (exists) {
      skipped += 1
      continue
    }
  }

  try {
    const response = await fetch(`https://rutube.ru/api/video/${videoId}/thumbnail/?redirect=1`, {
      redirect: 'follow',
      signal: AbortSignal.timeout(20000),
    })
    if (!response.ok) {
      console.warn(`  ${videoId} — Rutube ответил ${response.status}`)
      failed += 1
      continue
    }
    const type = response.headers.get('content-type') || ''
    if (!type.startsWith('image/')) {
      console.warn(`  ${videoId} — не картинка (${type})`)
      failed += 1
      continue
    }
    await fs.writeFile(target, Buffer.from(await response.arrayBuffer()))
    console.log(`  ${videoId} — сохранена`)
    downloaded += 1
  } catch (error) {
    console.warn(`  ${videoId} — ${error.message}`)
    failed += 1
  }
}

console.log(`\nГотово: скачано ${downloaded}, уже было ${skipped}, с ошибкой ${failed}`)
console.log(`Папка: ${path.relative(ROOT, OUT_DIR)}`)
