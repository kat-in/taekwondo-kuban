#!/usr/bin/env bash
# Сохраняет контент сайта (новости, альбомы, фото) в git.
# Запускай после загрузки фото или правки новостей в админке —
# тогда следующий git pull не посчитает их чужими изменениями.
set -euo pipefail

cd "$(dirname "$0")/.."

PATHS=(backend/data backend/uploads)

if ! command -v git >/dev/null 2>&1; then
  echo "Не найден git. Пропускаю." >&2
  exit 0
fi

if [ -z "$(git status --porcelain -- "${PATHS[@]}")" ]; then
  echo "В контенте нет изменений — сохранять нечего."
  exit 0
fi

git add -- "${PATHS[@]}"

if git diff --cached --quiet -- "${PATHS[@]}"; then
  echo "В контенте нет изменений — сохранять нечего."
  exit 0
fi

SUMMARY=$(git diff --cached --stat -- "${PATHS[@]}" | tail -1)
git commit -m "chore: сохранение контента из админки" -- "${PATHS[@]}"

echo "Контент сохранён: ${SUMMARY}"
echo "Теперь изменения можно отправлять в репозиторий: git push"
