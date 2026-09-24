# taekwondo-kuban

## Запуск

Нужны два процесса:

```bash
npm run dev
npm run dev:api
```

Frontend откроется на `http://localhost:5173`, API — на `http://localhost:5001`.

Проверка backend:

```bash
curl http://localhost:5001/api/health
```

Перед запуском backend должны быть установлены зависимости в `backend` и создан `backend/.env` с переменными `PORT`, `ADMIN_PASSWORD` и `JWT_SECRET`. Не добавляйте `.env` и пароли в Git.

## Сборка

```bash
npm run lint
npm run build
```

Данные хранятся в `backend/data`, загруженные файлы — в `backend/uploads`. Для production настройте reverse proxy для `/api` и `/uploads` на порт backend.
