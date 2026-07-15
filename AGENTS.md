# AGENTS — Быстрый старт для AI‑агентов в проекте video_converter

Коротко и практически — что нужно знать агенту, чтобы быть продуктивным сразу.

1. Большая картина

- Next.js (app router) + React + TypeScript фронтенд, весь транскодинг выполняется в браузере с помощью FFmpeg (WASM).
- Клиентская логика: загрузка файла → запись в виртуальную FS FFmpeg → запуск команды → чтение `output.mp4` → создание Blob/File → обновление глобального стора (`useVideoStore`). Смотрите: `widgets/Header1.tsx`.

2. Важные модули (быстрый индекс)

- `hooks/useFFmpeg.ts` — инициализация FFmpeg, логи, флаг загрузки; использует `toBlobURL` и `getFFmpegBaseURL`.
- `utils/getFFmpegBaseURL.ts` — выбор core/core-mt CDN по платформе (версия захардкожена здесь).
- `utils/buildFFmpegArgs.ts` — собирает аргументы ffmpeg; напрямую читает состояние из zustand через `useVideoDetailsStore.getState()` (важно для тестов/рефактора).
- `widgets/Header1.tsx` — транскодинг: `fetchFile` → `ffmpeg.writeFile` → `ffmpeg.exec` → `ffmpeg.readFile` → Blob → `setFile`.
- `utils/extractFrames.ts` + `features/TimeLines.tsx` — извлечение миниатюр и аккуратная очистка URL (revokeObjectURL).
- `store/*.ts` и `interfaces/*` — zustand‑сторы: `useVideoDetailsStore` (опции: flip, preset, crf, removeMetadata) и `useVideoStore` (текущий File).

3. Проектные конвенции и паттерны, которые агент должен знать

- Клиентская логика помечена `"use client"` — эти файлы рендерятся только на клиенте (Header, TimeLines, CheckBoxes).
- Псевдо‑алиас путей: '@/...' используется в импортах (tsconfig/next настроен).
- FFmpeg загружается с CDN; `getFFmpegBaseURL` переключает `core` ↔ `core-mt` по `detectPlatform()` (mobile/desktop).
- Память: проект явно вызывает `URL.revokeObjectURL` при замене/очистке — повторять этот паттерн при создании временных URL.
- Утилиты иногда используют zustand напрямую (`.getState()`); ожидайте непуристичных чистых функций (обычно — рефактор нужен).

4. Поворотные точки и слабые места (тех, что полезно знать при изменениях)

- `useFFmpeg` использует флаг `isLoaded` который инициализируется как true и ставится в false после загрузки — семантически это "isLoading". UI проверяет `if (isLoaded)` для отображения спиннера.
- `buildFFmpegArgs` — мутирует логику сборки аргументов, читая глобальный стор; при тестировании лучше передавать конфиг в функцию.
- Логи FFmpeg в хуке аккумулируются без ограничений — при долгих сессиях стоит ограничить буфер.
- Детект платформы: `utils/detectPlatform.ts` возвращает `'desktop'` на SSR — агенты не должны выполнять FFmpeg‑операции на сервере.

5. Типичные команды разработчика

- dev: `npm run dev` (в package.json: `next dev --webpack`)
- build: `npm run build` ; start: `npm run start`
- lint/format: `npm run lint`, `npm run format`

6. Быстрые примеры (копировать/использовать)

- Транскодинг (поток): смотреть `Header.transcode()` — вызовы: `fetchFile(file)`, `ffmpeg.writeFile(name, data)`, `ffmpeg.exec(args)`, `ffmpeg.readFile('output.mp4')`, затем Blob→File→`useVideoStore.setFile`.
- Сборка аргументов: `buildFFmpegArgs(fileName)` использует флаги: flips → `-vf hflip,vflip`, removeMetadata → `-map 0 -map_metadata -1 -map_chapters -1`, `-preset <preset> -crf <crf> -threads 0`.
- Извлечение кадров: `extractFrames(file, count)` создаёт video+canvas, ставит `currentTime`, делает `canvas.toBlob(...)` и возвращает массив {url,time}. Всегда вызывать `URL.revokeObjectURL` для очищаемых URL.

7. Integration / external dependencies заметки

- Основные зависимости: `@ffmpeg/ffmpeg`, `@ffmpeg/core(-mt)`, `@ffmpeg/util` (см. `package.json`). Версии core загружаются из CDN в `getFFmpegBaseURL` — держать версии синхронизированными.
- UI lib: `@heroui/react` + Tailwind. State: `zustand`.

8. Примеры задач, которые агент может сразу выполнить

- Рефактор: превратить `buildFFmpegArgs` в чистую функцию (принимает конфиг) — изменения касаются `utils/buildFFmpegArgs.ts` и тестов.
- Малое улучшение: переименовать `isLoaded` → `isLoading`/`isReady` в `hooks/useFFmpeg.ts` и унифицировать поведение.
- Добавить явный `ffmpeg` teardown/terminate при размонтировании хука (если API доступно).

9. Где читать дальше (ключевые файлы)

- `hooks/useFFmpeg.ts`, `utils/getFFmpegBaseURL.ts`, `utils/buildFFmpegArgs.ts`, `widgets/Header1.tsx`, `utils/extractFrames.ts`, `features/TimeLines.tsx`, `store/*.ts`, `interfaces/*`.

Если нужно, могу преобразовать этот документ в набор check‑листов/PR‑шаблонов или автоматически внести одно из перечисленных улучшений.
