# Ближе — AI-подбор недвижимости

Мини-проект для GitHub и Vercel: чат с AI-консультантом, уточнение пожеланий, подбор и сравнение объектов учебного каталога. Без базы данных, регистрации и постоянной памяти. История исчезает при обновлении вкладки.

## Локальный запуск

Node.js 24. Внешних npm-зависимостей нет.
Скопируйте `.env.example` в `.env` и заполните `VSELLM_API_KEY`. Не добавляйте `.env` в Git.

```sh
npm run dev
```

Сайт: http://127.0.0.1:8005 . Health: http://127.0.0.1:8005/api/health .

## Проверки

```sh
npm run check
```

Проверяются синтаксис JavaScript, JSON-конфигурация и серверные тесты. GitHub Actions запускает job `quality` на push в main и на pull request. Настоящие запросы к LLM в CI не выполняются, ключ для CI не нужен. Vercel запускает те же проверки как Build Command; при ошибке новый deployment не публикуется.

## Vercel

Импортируйте репозиторий. Framework: Other; Root Directory: `.`; Output Directory: `public`; Build Command: `npm run check`; Node.js: 24.x. Значения build/output уже заданы в vercel.json.

В Environment Variables добавьте:
- `VSELLM_API_KEY` — Secret, значение ключа VseLLM; Production и при необходимости Preview.
- `VSELLM_MODEL` — Config, `openai/gpt-6-luna`.

Ключ читается только серверными функциями из окружения. После изменения переменных нужен новый deployment. Для Git-интеграции Vercel token в GitHub Secrets не требуется.

## Структура

- public/ — интерфейс чата, единое семейство Arial.
- api/ — функции Vercel: chat и health.
- lib/agent.js — промпт и шесть вымышленных объектов в Демо-городе.
- server.mjs — локальный сервер для тех же обработчиков.
- scripts/check.mjs, tests/ — проверки.
- .github/workflows/ci.yml — GitHub Actions.

Объекты каталога учебные, не реальные объявления. Веб-поиска нет. Подбор выполняет модель; точность оценивалась на учебных сценариях. Пример: покупка в Демо-городе, 2 комнаты, до 8 млн → D01; снижение бюджета до 6 млн → подходящих вариантов нет.
