# Video Converter

Браузерный конвертер видео на FFmpeg WASM. Весь транскодинг выполняется на стороне клиента — файлы никуда не отправляются.

## Возможности

- Загрузка видео через файловый инпут
- Настройки: отзеркаливание (горизонтальное/вертикальное), удаление метаданных
- Выбор пресета и качества (CRF)
- Извлечение миниатюр (таймлайн)
- Скачивание результата
- Индикация прогресса конвертации
- Автовыбор версии FFmpeg: многопоточный (`core-mt`) на ПК, однопоточный (`core`) на Android из-за ограничений платформы (SharedArrayBuffer)

## Установка и запуск

```bash
npm install
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000).

## Стек

- **Next.js** (App Router)
- **React 19**
- **FFmpeg WASM** (`@ffmpeg/ffmpeg`, `@ffmpeg/core`, `@ffmpeg/core-mt`)
- **Zustand** — управление состоянием
- **HeroUI** — UI-компоненты
- **Tailwind CSS 4** — стили
- **TypeScript**

## Команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск dev-сервера |
| `npm run build` | Сборка |
| `npm run start` | Запуск собранного приложения |
| `npm run lint` | Проверка линтером |
| `npm run format` | Форматирование кода |

## Структура

```
app/          — страницы и layout
features/     — фичи: загрузка, конвертация, таймлайн, настройки
hooks/        — кастомные хуки (useFFmpeg, useVideoPreview)
store/        — Zustand-сторы
utils/        — утилиты (buildFFmpegArgs, extractFrames и др.)
interfaces/   — TypeScript-интерфейсы
widgets/      — композиционные компоненты (VideoManager, FFmpegStatus)
```
