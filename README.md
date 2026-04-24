# Mecenate — Feed + Post Detail

## Запуск (Expo Go)

```bash
yarn install
yarn start
```

После старта появится QR-код:

- **iOS** — откройте камеру, сканируйте QR → откроется в [Expo Go](https://apps.apple.com/app/expo-go/id982107779)
- **Android** — откройте [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent), сканируйте QR внутри приложения

Также:

```bash
yarn ios        # iOS-симулятор
yarn android    # Android-эмулятор
```

### Переменные окружения (опционально)

```bash
cp .env.example .env
```

| Переменная                 | По умолчанию                           |
| -------------------------- | -------------------------------------- |
| `EXPO_PUBLIC_API_BASE_URL` | `https://k8s.mectest.ru/test-app`      |
| `EXPO_PUBLIC_AUTH_TOKEN`   | `550e8400-e29b-41d4-a716-446655440000` |

WebSocket URL выводится автоматически из `EXPO_PUBLIC_API_BASE_URL` (замена `http`→`ws`).

## Что реализовано

### ТЗ-1 — Лента

- Курсорная пагинация через `useInfiniteQuery`
- Pull-to-refresh
- Заглушка для `tier: "paid"` (размытая обложка + донат)
- Ошибка загрузки → `Не удалось загрузить публикации` + кнопка повтора
- Skeleton-заглушки на первом рендере (Reanimated)
- Таб-фильтр Все / Бесплатные / Платные (сегментный pill)

### ТЗ-2 — Детальный пост

- Навигация на детальный экран при тапе по карточке (`expo-router`)
- Полный текст, обложка, автор
- Кнопка лайка с Reanimated-анимацией (scale + лёгкий rotate) и `expo-haptics`
- Анимированный счётчик лайков (fade при смене числа)
- Lazy-load комментариев (cursor + `useInfiniteQuery`)
- Переключатель сортировки комментариев «Сначала новые / Сначала старые» (клиентская)
- Ввод и отправка комментария с оптимистическим обновлением
- **Real-time через WebSocket** — новые лайки и комментарии появляются без перезагрузки

## Архитектура

### State management

| Слой                   | Ответственность                                                   |
| ---------------------- | ----------------------------------------------------------------- |
| React Query            | Весь серверный кэш: лента, детали, комментарии, мутации           |
| `AuthStore` (MobX)     | Токен, `isAuthenticated`, `authorizationHeader` (computed), logout |
| `FeedUiStore` (MobX)   | Фильтр tier, `isFiltered`, `tierLabel`, `reaction` на изменение   |
| `CommentsUiStore` (MobX) | Сортировка комментариев, локальные лайки (`observable.set`)      |
| `WsStore` (MobX)       | Лайфцикл WS: статус, переподключение, `addListener`               |

### WebSocket

- `src/store/WsStore.ts` — MobX-стор с `status: 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error'`, экспоненциальным бэкоффом и `reaction` на смену `authStore.token`.
- `src/hooks/useWsCacheSync.ts` — подписывается на события и синхронизирует React Query cache:
  - `like_updated` → обновляет `likesCount` в ленте и деталях
  - `comment_added` → добавляет комментарий в начало списка + инкрементит `commentsCount`
- Подключение инициируется при монтировании `FeedScreen` и `PostDetailScreen`, используется общий сокет (одна вкладка = одно соединение).
- Сервер шлёт `ping` каждые 30 секунд — игнорируется на клиенте.

### Design tokens

Единый источник — `src/theme/tokens.ts`. Захардкоженных цветов, размеров иконок, радиусов, отступов в компонентах нет — всё через `colors`, `spacing`, `radius`, `typography`, `iconSize`, `opacity`, `layout`, `skeleton`, `touch`.

### Ограничения API

- Комментарии в API не имеют `likesCount`/`isLiked` → лайк на комментарий реализован как клиентский toggle в `CommentsUiStore.likedIds` (`observable.set`).
- API не поддерживает сортировку комментариев → переключатель «Сначала новые / старые» делает клиентский reverse.

## Скрипты

```bash
yarn start         # Expo dev-сервер + QR
yarn lint          # ESLint
npx tsc --noEmit   # Проверка типов
```

## Стек

| Пакет                            | Назначение                                               |
| -------------------------------- | -------------------------------------------------------- |
| `expo` / `expo-router`           | Runtime и файловая навигация                             |
| `react-native`                   | UI-слой (iOS + Android)                                  |
| `@tanstack/react-query`          | Серверное состояние, кэш, курсорная пагинация            |
| `mobx` / `mobx-react-lite`       | UI-стейт, WS-стор, стор лайков комментариев              |
| `react-native-reanimated`        | Like-анимация, entering-анимация ленты                   |
| `expo-haptics`                   | Haptic feedback на лайк                                  |
| `expo-image`                     | Загрузка и кэш изображений, blurRadius для paid          |
| `react-native-safe-area-context` | Safe-area на iOS/Android                                 |
| `@expo/vector-icons`             | Ionicons                                                 |
| `typescript`                     | Strict-типизация                                         |
