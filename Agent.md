# Agent.md — Технический отчёт по проекту video_converter

## Overview

Это технический отчёт по проекту "video_converter" (Next.js + TypeScript, архитектура FSD) — фронтенд‑приложению для транскодинга видео в браузере с помощью FFmpeg (WASM). Отчёт отражает текущее состояние реализации, качество кода, интеграцию FFmpeg и готовность к добавлению новых фич.

## Architecture

- Фреймворк: Next.js (app router), React 19, TypeScript.
- Архитектура: Feature-Sliced Design (FSD): `entities/`, `features/`, `shared/`, `widgets/`, `app/`.
- State management: zustand (сторы вынесены в `entities/video/detailsStore.ts` и `entities/video/videoStore.ts`).
- UI: компоненты из `@heroui/react` + Tailwind CSS.
- FFmpeg: используется wasm‑сборка (`@ffmpeg/ffmpeg`, `@ffmpeg/core-mt`, `@ffmpeg/util`) — инициализация в хуке `useFFmpeg` и дальнейшая работа в `utils/handleVideoProcessing.ts`.
- i18n: реализована через `next-i18next` / `react-i18next`, локали в `app/i18n/locales/{en,ru}`.

### Структура файлов (ключевые модули)

- `entities/video/detailsStore.ts` — `detailsStore` (зуstadn): опции и сброс фильтров.
- `entities/video/videoStore.ts` — `videoStore` (зуstadn): текущий File.
- `entities/video/`: видеоресурсы.
- `features/`: UI-фичи (CheckBoxes, TimeLines, ConvertButton, FileUploader, VideoPlayer, DownloadVideoButton, ClearFileButton, SelectOutputFormat).
- `shared/lib/hooks/`: useFFmpeg, useVideoPreview, useFramesExtraction.
- `shared/lib/utils/`: buildFFmpegArgs, extractFrames, handleVideoProcessing.
- `shared/interfaces/*.ts` и `shared/types/*.ts` — модели состояния и типы.
- `widgets/`: Header, LanguageSwitcherButton, VideoManager.
- `app/`: страницы и маршруты.

## Code Quality

Положительные стороны:

- Чёткая модульность по FSD: entities, features, shared, widgets разделены логично.
- Использование TypeScript и типов для всех пропсов (`interfaces/*`, `types/*`).
- Хорошая забота об освобождении URL (URL.revokeObjectURL) в большинстве мест.
- `buildFFmpegArgs` теперь чистая функция — принимает пропсы, не зависит от стора.
- `isLoaded` переименован в `isLoading` — семантика исправлена.
- Добавлена обработка ошибок загрузки FFmpeg через `error` state.
- `useFFmpeg` теперь делает teardown (вызов `ffmpeg.terminate()` в cleanup) — утечки памяти eliminated.
- `useFramesExtraction` — новый хук с AbortController для безопасного извлечения кадров.

Замеченные проблемы и улучшения:

- `handleVideoProcessing` использует `detailsStore.getState()` внутри — это допустимо для утилиты, но усложняет тестирование.
- `logs` в `useFFmpeg` закомментированы (прогресс идёт через `progress` событие) — при необходимости логирования стоит добавить с ограничением буфера.
- Нет тестов (unit/e2e).
- Нет явного teardown/terminate FFmpeg при размонтировании (хотя `useFFmpeg` теперь делает terminate в cleanup).
- Прогресс‑бар есть, но нет парсинга для более точного отображения (сейчас используется встроенное событие `progress`).

## FFmpeg Integration

Что реализовано:

- В `useFFmpeg` создаётся экземпляр FFmpeg (`new FFmpeg()`), подписываются события `progress`, загружаются ресурсы core/wasm/worker из CDN (через `toBlobURL` и `getFFmpegBaseURL`).
- В `handleVideoProcessing.ts` используется `fetchFile` (из `@ffmpeg/util`) и методы: `writeFile`, `exec`, `readFile`.
- Результат записывается в Blob/File и отображается в `<video>`.

Особенности:

- Используется API `new FFmpeg()` (не `createFFmpeg`), методы `writeFile/exec/readFile` — это корректно для `@ffmpeg/ffmpeg@^0.12.x`.
- Версии core/core-mt (0.12.10) и ffmpeg (0.12.15) синхронизированы в `package.json`.
- `getFFmpegBaseURL` использует ту же версию (0.12.10) — несоответствие версий устранено.
- Прогресс конвертации отображается через встроенное событие `progress`.

## Current Feature Status

### Реализовано (полностью/рабоче):

- Загрузка FFmpeg (веб‑сборка) и инициализация с обработкой ошибок.
- Загрузка локального файла пользователем через `FileUploader`.
- Транскодинг в браузере: запись входного файла во внутреннюю FS, выполнение команды, чтение `output.mp4` и отображение результата.
- Простые трансформации: flipHorizontal / flipVertical (через `CheckBoxes`).
- Удаление метаданных (через `CheckBoxes`).
- Извлечение кадров для таймлайна (`TimeLines`).
- Прогресс-бар транскодинга.
- Скачивание готового файла (`DownloadVideoButton`).
- Отображение статуса загрузки FFmpeg (спиннер/ошибка).
- Автоматический сброс фильтров при смене файла.
- Интеграция мультиязычности: маршруты `/[locale]`, компонент `LanguageSwitcherButton`, переводы в `app/i18n/locales`.
- Поддержка форматов вывода: MP4 (libx264) и WebM (libvpx/libvorbis) через `SelectOutputFormat`.

### Реализовано частично / требует доработки:

- Параметры кодека и качества (preset, crf) есть в сторе, но UI для управления ими может потребовать доработки.
- Управление ресурсами FFmpeg: `useFFmpeg` теперь выполняет terminate/cleanup.

### Отсутствует / не реализовано:

- Timelapse (ускорение видео) — нет параметра всторе/UI и сборки аргументов.
- Trimming (обрезка) — нет UI/хранения времени и генерации аргументов.
- Поддержка больших файлов: нет разбивки, предупреждений по памяти.
- Тесты, CI.
- Ограничение буфера логов (логи отключены).

## Missing or Weak Parts

1. Управление ресурсами / утечки
    - Ранее проблема, теперь устранена за счет `ffmpeg.terminate()` в `useFFmpeg`.

2. UX и контроль выполнения
    - Отсутствие UI для настройки `preset`, `crf`, timelapse speed, trim start/end.

3. Тестируемость и чистота кода
    - `handleVideoProcessing` обращается к сторам напрямую.
    - Нет модульных тестов.

## Readiness for Timelapse

Проект готов к внедрению timelapse:

- Что нужно добавить: 1. Параметры в `entities/video/detailsStore.ts`: `timelapseFactor` (number). 2. Правки в `buildFFmpegArgs`: добавить `setpts=PTS/<factor>` для видео, `atempo` для аудио (с цепочкой при factor > 2). 3. UI-элемент для выбора множителя скорости.
  Оценка готовности: 80% — требуется расширение стора, builder'а и UI.

## Readiness for Video Trimming

- Что нужно добавить: 1. Параметры в сторе: `trimStart`, `trimEnd`. 2. UI: контролы для выбора диапазона. 3. В `buildFFmpegArgs`: `-ss` и `-to`/`-t`.
  Оценка готовности: 85% — механизмы на месте (учитывая поддержку форматов), требуется UI + аргументы.

## Recommendations

1. Добавить teardown FFmpeg при размонтировании хука (уже реализовано через `ffmpeg.terminate()` в `useFFmpeg`).
2. Добавить очистку виртуальной FS FFmpeg после транскодинга.
3. Добавить UI для `preset` и `crf`.
4. Реализовать timelapse и trimming (store → buildFFmpegArgs → UI).
5. Добавить unit-тесты для `buildFFmpegArgs`.
6. Добавить e2e-тесты для ключевых сценариев.
