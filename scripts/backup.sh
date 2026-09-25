#!/usr/bin/env bash
# Кладёт копию контента в архив с датой в папку за пределами репозитория.
# Если папка с бэкапами окажется на сервере, её содержимое переживёт
# переустановку или удаление машины. Запускай перед обновлением кода.
set -euo pipefail

cd "$(dirname "$0")/.."

BACKUP_DIR="${BACKUP_DIR:-$HOME/backups/taekwondo-kuban}"
STAMP=$(date +%Y-%m-%d_%H%M)
ARCHIVE="$BACKUP_DIR/content-$STAMP.tar.gz"

if [ ! -d backend/data ] && [ ! -d backend/uploads ]; then
  echo "Не найдены папки с контентом: backend/data и backend/uploads" >&2
  exit 1
fi

mkdir -p "$BACKUP_DIR"

# Права на файлы игнорируем, метки времени сохраняем
tar --exclude='.DS_Store' -czf "$ARCHIVE" backend/data backend/uploads

SIZE=$(du -h "$ARCHIVE" | cut -f1)
NEWS=$(node -e "const fs=require('fs');try{const d=JSON.parse(fs.readFileSync('backend/data/news.json','utf8'));console.log(Array.isArray(d)?d.length:0)}catch{console.log(0)}")
ALBUMS=$(node -e "const fs=require('fs');try{const d=JSON.parse(fs.readFileSync('backend/data/albums.json','utf8'));console.log(Array.isArray(d)?d.length:0)}catch{console.log(0)}")
PHOTOS=$(find backend/uploads -type f ! -name '.DS_Store' | wc -l | tr -d ' ')

echo "Бэкап готов: $ARCHIVE ($SIZE)"
echo "  новостей: $NEWS, альбомов: $ALBUMS, файлов: $PHOTOS"
echo "Скопируй архив на свой компьютер: scp <сервер>:$ARCHIVE ~/Downloads/"
