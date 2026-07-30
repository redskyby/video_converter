# Agent.md — Технический отчёт по проекту video_converter

## Overview

Это технический отчёт по проекту "video_converter" (Next.js + TypeScript) — небольшому фронтенд‑приложению, использующему FFmpeg (wasm) для конвертации видео в браузере. Отчёт отражает текущее состояние реализации, качество кода, корректность интеграции FFmpeg.wasm, а также готовность к добавлению функций timelapse и обрезки (trimming).

## Architecture

- Фреймворк: Next.js (app router), React 19, TypeScript.
- State management: zustand (два стора: `useVideoDetailsStore` в `store/detailsStore.ts` и `useVideoStore` в `store/videoStore.ts`).
- UI: компоненты из `@heroui/react` + Tailwind CSS.
- FFmpeg: используется wasm‑сборка (`@ffmpeg/ffmpeg`, `@ffmpeg/core-mt`, `@ffmpeg/util`) — инициализация в хуке `useFFmpeg` и дальнейшая работа в `utils/videoProcessing.ts`.
- Структура файлов (ключевые модули):
    - `hooks/useFFmpeg.ts` — загрузка FFmpeg с обработкой ошибок и прогрессом.
    - `hooks/useVideoPreview.ts` — управление video-элементом и ObjectURL.
    - `widgets/VideoManager.tsx` — главный оркестратор приложения.
    - `widgets/FFmpegStatus.tsx` — отображение загрузки/ошибок FFmpeg.
    - `utils/buildFFmpegArgs.ts` — чистая функция сборки аргументов ffmpeg.
    - `utils/videoProcessing.ts` — вынесенная логика транскодинга.
    - `utils/extractFrames.ts` + `features/TimeLines.tsx` — извлечение кадров и визуализация.
    - `features/CheckBoxes.tsx`, `ConvertButton.tsx`, `DownloadVideoButton.tsx`, `FileUploader.tsx`, `VideoPreview.tsx` — UI-компоненты.
    - `store/*.ts` и `interfaces/*` — модели состояния и типы.

## Code Quality

Положительные стороны:

- Чёткая модульность: хуки, утилиты, компоненты и сторы разделены логично.
- Использование TypeScript и типов для всех пропсов (`interfaces/*`).
- Хорошая забота об освобождении URL (URL.revokeObjectURL) в большинстве мест.
- `buildFFmpegArgs` теперь чистая функция — принимает конфиг вместо чтения стора.
- `isLoaded` переименован в `isLoading` — семантика исправлена.
- Добавлена обработка ошибок загрузки FFmpeg через `error` state.

Замеченные проблемы и улучшения:

- `handleVideoProcessing` использует `useVideoDetailsStore.getState()` внутри — это допустимо для утилиты, но усложняет тестирование.
- `logs` в `useFFmpeg` закомментированы (прогресс идёт через `progress` событие) — при необходимости логирования стоит добавить с ограничением буфера.
- Нет тестов (unit/e2e).
- Нет явного teardown/terminate FFmpeg при размонтировании.
- Прогресс-бар есть, но нет парсинга для более точного отображения (сейчас используется встроенное событие `progress`).

## FFmpeg Integration

Что реализовано:

- В `useFFmpeg` создаётся экземпляр FFmpeg (`new FFmpeg()`), подписываются события `progress`, загружаются ресурсы core/wasm/worker из CDN (через `toBlobURL` и `getFFmpegBaseURL`).
- В `videoProcessing.ts` используется `fetchFile` (из `@ffmpeg/util`) и методы: `writeFile`, `exec`, `readFile`.
- Результат записывается в Blob/File и отображается в `<video>`.

Особенности:

- Используется API `new FFmpeg()` (не `createFFmpeg`), методы `writeFile/exec/readFile` — это корректно для `@ffmpeg/ffmpeg@^0.12.x`.
- Версии core/core-mt (0.12.10) и ffmpeg (0.12.15) синхронизированы в `package.json`.
- `getFFmpegBaseURL` использует ту же версию (0.12.10) — несоответствие версий устранено.
- Прогресс конвертации отображается через встроенное событие `progress`.

## Current Feature Status

Реализовано (полностью/рабоче):

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

Реализовано частично / требует доработки:

- Параметры кодека и качества (preset, crf) есть в сторе, но UI для управления ими отсутствует.
- Управление ресурсами FFmpeg: нет явного teardown/terminate.

Отсутствует / не реализовано:

- Timelapse (ускорение видео) — нет параметра в сторе/UI и сборки аргументов.
- Trimming (обрезка) — нет UI/хранения времени и генерации аргументов.
- Поддержка больших файлов: нет разбивки, предупреждений по памяти.
- Тесты, CI.
- Ограничение буфера логов (логи отключены).

## Missing or Weak Parts

1. Управление ресурсами / утечки
    - Нет teardown/terminate для экземпляра FFmpeg.
    - Виртуальная FS FFmpeg не очищается после транскодинга.

2. UX и контроль выполнения
    - Отсутствие UI для настройки `preset`, `crf`, timelapse speed, trim start/end.

3. Тестируемость и чистота кода
    - `handleVideoProcessing` обращается к сторам напрямую.
    - Нет модульных тестов.

## Readiness for Timelapse

Проект готов к внедрению timelapse:

- Что нужно добавить:
    1. Параметры в `store/detailsStore.ts`: `timelapseFactor` (number).
    2. Правки в `buildFFmpegArgs`: добавить `setpts=PTS/<factor>` для видео, `atempo` для аудио (с цепочкой при factor > 2).
    3. UI-элемент для выбора множителя скорости.

Оценка готовности: 80% — требуется расширение стора, builder'а и UI.

## Readiness for Video Trimming

- Что нужно добавить:
    1. Параметры в сторе: `trimStart`, `trimEnd`.
    2. UI: контролы для выбора диапазона.
    3. В `buildFFmpegArgs`: `-ss` и `-to`/`-t`.

Оценка готовности: 85% — механизмы на месте, требуется UI + аргументы.

## Recommendations

1. Добавить teardown FFmpeg при размонтировании хука (если API позволяет terminate).
2. Добавить очистку виртуальной FS FFmpeg после транскодинга.
3. Добавить UI для `preset` и `crf`.
4. Реализовать timelapse и trimming (store → buildFFmpegArgs → UI).
5. Добавить unit-тесты для `buildFFmpegArgs`.
6. Добавить e2e-тесты для ключевых сценариев.
