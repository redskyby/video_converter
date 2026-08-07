# AGENTS — Быстрый старт для AI‑агентов в проекте video_converter

Коротко и практически — что нужно знать агенту, чтобы быть продуктивным сразу.

1. Большая картина

- Next.js (app router) + React + TypeScript фронтенд, весь транскодинг выполняется в браузере с помощью FFmpeg (WASM).
- Клиентская логика: загрузка файла → запись в виртуальную FS FFmpeg → запуск команды → чтение `output.mp4` → создание Blob/File → обновление глобального стора (`useVideoStore`). Смотрите: `widgets/VideoManager.tsx`.

2. Важные модули (быстрый индекс)

- `widgets/VideoManager.tsx` — главный оркестратор: сборка всех фич (FileUploader, ConvertButton, DownloadVideoButton), вызов `handleVideoProcessing`, отображение прогресс-бара и video-элемента.
- `widgets/FFmpegStatus.tsx` — отображение состояния загрузки FFmpeg (спиннер/ошибка).
- `hooks/useFFmpeg.ts` — инициализация FFmpeg, лог прогресса, флаг `isLoading`, обработка ошибок через `error`.
- `hooks/useVideoPreview.ts` — управление video-элементом: создание/освобождение ObjectURL, сброс фильтров при смене файла.
- `utils/buildFFmpegArgs.ts` — **чистая функция**, принимает конфиг (flip, preset, crf, removeMetadata) — больше не читает стор напрямую.
- `utils/handleVideoProcessing.ts` — вынесенная логика транскодинга: `fetchFile` → `ffmpeg.writeFile` → `ffmpeg.exec` → `ffmpeg.readFile` → Blob → `setFile`; работает через `useVideoDetailsStore.getState()`.
- `utils/extractFrames.ts` + `features/TimeLines.tsx` — извлечение миниатюр и аккуратная очистка URL (revokeObjectURL).
- `store/detailsStore.ts` — `useVideoDetailsStore` (опции: flip, preset, crf, removeMetadata) + `resetFilters`.
- `store/videoStore.ts` — `useVideoStore` (текущий File).
- `interfaces/*.ts` — типизированные пропсы для всех компонентов и утилит.

3. Проектные конвенции и паттерны, которые агент должен знать

- Клиентская логика помечена `"use client"` — эти файлы рендерятся только на клиенте (VideoManager, все features).
- Псевдо‑алиас путей: `@/...` используется в импортах (tsconfig/next настроен).
- FFmpeg загружается с CDN; `getFFmpegBaseURL` переключает `core` ↔ `core-mt` по `detectPlatform()` (mobile/desktop).
- Память: проект явно вызывает `URL.revokeObjectURL` при замене/очистке — повторять этот паттерн при создании временных URL.
- `handleVideoProcessing` использует zustand напрямую (`.getState()`) — это допустимо для утилиты, вызываемой из UI.

4. Поворотные точки и слабые места (тех, что полезно знать при изменениях)

- `useFFmpeg` использует `isLoading` (ранее был `isLoaded` с инвертированной логикой — исправлено).
- Логи FFmpeg отключены (`ffmpeg.on('log', ...)` закомментирован) — прогресс получается через `ffmpeg.on('progress', ...)`.
- Детект платформы: `utils/detectPlatform.ts` возвращает `'desktop'` на SSR — агенты не должны выполнять FFmpeg‑операции на сервере.
- `buildFFmpegArgs` теперь чистая функция — принимает пропсы, не зависит от стора.
- `useVideoPreview` при монтировании/смене файла чистит старые ObjectURL и сбрасывает фильтры.

5. Типичные команды разработчика

- dev: `npm run dev` (в package.json: `next dev --webpack`)
- build: `npm run build` ; start: `npm run start`
- lint/format: `npm run lint`, `npm run format`

6. Быстрые примеры (копировать/использовать)

- Транскодинг (поток): смотреть `VideoManager.handleConversion()` → `handleVideoProcessing({ ffmpegRef, setTranscoding, videoRef, videoUrlRef, setFile })`.
- Сборка аргументов: `buildFFmpegArgs({ fileName, flipHorizontal, flipVertical, preset, crf, removeMetadata })` использует флаги: flips → `-vf hflip,vflip`, removeMetadata → `-map 0 -map_metadata -1 -map_chapters -1`, `-preset <preset> -crf <crf> -threads 0`.
- Извлечение кадров: `extractFrames(file, count)` создаёт video+canvas, ставит `currentTime`, делает `canvas.toBlob(...)` и возвращает массив {url,time}. Всегда вызывать `URL.revokeObjectURL` для очищаемых URL.
- Прогресс: `ffmpeg.on('progress', ({ progress: ratio }) => setProgress(Math.round(ratio * 100)))`.

7. Integration / external dependencies заметки

- Основные зависимости: `@ffmpeg/ffmpeg`, `@ffmpeg/core(-mt)`, `@ffmpeg/util` (см. `package.json`). Версии core/core-mt синхронизированы (0.12.10), `@ffmpeg/ffmpeg` — 0.12.15.
- UI lib: `@heroui/react` + Tailwind. State: `zustand`.
- Линтинг: ESLint + Prettier + lint-staged (проверка при коммите через husky).

8. Примеры задач, которые агент может сразу выполнить

- Добавить timelapse/trim: расширить `store/detailsStore.ts` и `interfaces/`, обновить `buildFFmpegArgs`, добавить UI-контролы.
- Добавить явный `ffmpeg` teardown/terminate при размонтировании хука (если API доступно).
- Добавить очистку виртуальной FS FFmpeg (`ffmpeg.deleteFile`) после завершения транскодинга.

9. Где читать дальше (ключевые файлы)

- `hooks/useFFmpeg.ts`, `hooks/useVideoPreview.ts`, `utils/buildFFmpegArgs.ts`, `utils/handleVideoProcessing.ts`, `widgets/VideoManager.tsx`, `widgets/FFmpegStatus.tsx`, `utils/extractFrames.ts`, `features/TimeLines.tsx`, `features/CheckBoxes.tsx`, `features/ConvertButton.tsx`, `features/DownloadVideoButton.tsx`, `features/FileUploader.tsx`, `features/VideoPreview.tsx`, `store/*.ts`, `interfaces/*`.
