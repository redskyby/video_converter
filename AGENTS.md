# AGENTS — Быстрый старт для AI‑агентов в проекте video_converter

Проанализировал проект — он существенно изменился с момента, когда были написаны эти инструкции. Оба файла устарели и нуждаются в обновлении. Ключевые расхождения указаны внизу документа.

1. Большая картина
- Next.js (app router, i18n через `[locale]`) + React 19 + TypeScript фронтенд, весь транскодинг выполняется в браузере с помощью FFmpeg (WASM).
- Архитектура — Feature-Sliced Design (FSD): `entities/`, `features/`, `shared/`, `widgets/`, `app/`.
- Клиентская логика: загрузка файла → запись в виртуальную FS FFmpeg → запуск команды → чтение `output.<ext>` → создание Blob/File → обновление глобального стора (`videoStore`). Смотрите: `widgets/VideoManager.tsx`.

2. Важные модули (быстрый индекс)
- `entities/video/detailsStore.ts` — `detailsStore` (zustand): `flipHorizontal`, `flipVertical`, `preset`, `crf`, `removeMetadata` + `resetFilters()`.
- `entities/video/videoStore.ts` — `videoStore` (zustand): текущий `file: File | null` + `setFile`.
- `entities/video/`: видеоресурсы и сторы.
- `features/`: UI-фичи (CheckBoxes, TimeLines, ConvertButton, FileUploader, VideoPlayer, DownloadVideoButton, ClearFileButton, SelectOutputFormat, TimeLines).
- `shared/lib/hooks/`: хуки (useFFmpeg, useVideoPreview, useFramesExtraction).
- `shared/lib/utils/`: утилиты (buildFFmpegArgs, extractFrames, handleVideoProcessing).
- `shared/interfaces/*.ts` — типизированные пропсы для всех компонентов и утилит.
- `shared/types/*.ts` — `FormatSelect` (`'MP4' | 'WebM'`), `Frame`, `Platform`.
- `widgets/`: композиция фич (VideoManager, Header, LanguageSwitcherButton).
- `app/`: маршрутизация, i18n-ресурсы.

3. Проектные конвенции и паттерны, которые агент должен знать
- Клиентская логика помечена `"use client"` — эти файлы рендерятся только на клиенте (`VideoManager`, все `features/*`).
- Псевдо‑алиас путей: `@/...` используется в импортах (`@/entities/...`, `@/features/...`, `@/shared/...`, `@/widgets/...`) — настроено в tsconfig/next.
- FFmpeg загружается с CDN; `getFFmpegBaseURL` переключает `core` ↔ `core-mt` по `detectPlatform()` (mobile/desktop).
- Память: проект явно вызывает `URL.revokeObjectURL` при замене/очистке (video preview, кадры таймлайна) — повторять этот паттерн при создании временных URL.
- `handleVideoProcessing` использует zustand напрямую (`.getState()`) — это допустимо для утилиты, вызываемой из UI, но усложняет unit-тестирование.
- `useFFmpeg` теперь делает teardown (вызов `ffmpeg.terminate()` в cleanup) — проблема с утечками решена.
- `useFramesExtraction` — новый хук, обертка над `extractFrames` с `AbortController`, аккуратно освобождает ObjectURL превьюшек при смене файла/размонтировании.
- `buildFFmpegArgs` теперь поддерживает формат вывода (MP4/WebM) с разными кодеками (`libx264`, `libvpx`/`libvorbis`), а не только набор флагов для трансформаций.

4. Поворотные точки и слабые места (тех, что полезно знать при изменениях)
- `useFFmpeg` использует `isLoading` (ранее был `isLoaded` с инвертированной логикой — исправлено).
- Логи FFmpeg отключены (`ffmpeg.on('log', ...)` закомментирован) — прогресс получается через `ffmpeg.on('progress', ...)`.
- Детект платформы: `utils/detectPlatform.ts` возвращает `'desktop'` на SSR — агенты не должны выполнять FFmpeg‑операции на сервере.
- `buildFFmpegArgs` теперь чистая функция — принимает пропсы, не зависит от стора.
- `useVideoPreview` при монтировании/смене файла чистит старые ObjectURL и сбрасывает фильтры (`detailsStore.getState().resetFilters()`).
- `handleVideoProcessing` использует zustand напрямую (`.getState()`) — это допустимо для утилиты, вызываемой из UI.

5. Типичные команды разработчика
- dev: `npm run dev` (в package.json: `next dev --webpack`)
- build: `npm run build` ; start: `npm run start`
- lint/format: `npm run lint`, `npm run format`

6. Быстрые примеры (копировать/использовать)
- Транскодинг (поток): смотреть `VideoManager.handleConversion()` → `handleVideoProcessing({ ffmpegRef, setTranscoding, videoRef, videoUrlRef, setFile })`.
- Сборка аргументов: `buildFFmpegArgs({ fileName, flipHorizontal, flipVertical, preset, crf, removeMetadata, format })` — теперь поддерживаетformat: `'MP4'` (libx264) или `'WebM'` (libvpx/libvorbis).
- Извлечение кадров: `extractFrames(file, count)` создаёт video+canvas, ставит `currentTime`, делает `canvas.toBlob(...)` и возвращает массив {url,time}. Всегда вызывать `URL.revokeObjectURL` для очищаемых URL.
- Прогресс: `ffmpeg.on('progress', ({ progress: ratio }) => setProgress(Math.round(ratio * 100))`.
- Языки: использовать `LanguageSwitcherButton` для смены locale (`/en`, `/ru`). Переводы в `app/i18n/locales/{en,ru}`.

7. Integration / external dependencies заметки
- Основные зависимости: `@ffmpeg/ffmpeg`, `@ffmpeg/core(-mt)`, `@ffmpeg/util` (см. `package.json`). Версии core/core-mt синхронизированы (0.12.10), `@ffmpeg/ffmpeg` — 0.12.15.
- UI lib: `@heroui/react` + Tailwind. State: `zustand`.
- Линтинг: ESLint + Prettier + lint-staged (проверка при коммите через husky).

8. Примеры задач, которые агент может сразу выполнить
- Добавить timelapse/trim: расширить `entities/video/detailsStore.ts` и `interfaces/`, обновить `buildFFmpegArgs`, добавить UI-контролы.
- Добавить явный `ffmpeg` teardown/terminate при размонтировании хука (если API доступно).
- Добавить очистку виртуальной FS FFmpeg (`ffmpeg.deleteFile`) после завершения транскодинга.
- Интеграция i18n: добавить маршруты `/[locale]` и компонент `LanguageSwitcherButton`.

9. Где читать дальше (ключевые файлы)
- `entities/video/detailsStore.ts`, `entities/video/videoStore.ts`, `hooks/useFFmpeg.ts`, `hooks/useVideoPreview.ts`, `hooks/useFramesExtraction.ts`, `utils/buildFFmpegArgs.ts`, `utils/handleVideoProcessing.ts`, `utils/extractFrames.ts`, `widgets/VideoManager.tsx`, `widgets/FFmpegStatus.tsx`, `features/TimeLines.tsx`, `features/CheckBoxes.tsx`, `features/ConvertButton.tsx`, `features/FileUploader.tsx`, `features/SelectOutputFormat.tsx`, `features/DownloadVideoButton.tsx`, `features/ClearFileButton.tsx`, `widgets/Header.tsx`, `app/i18n/locales/{en,ru}/*.json`, `shared/interfaces/*.ts`, `shared/types/*.ts`.