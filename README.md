# Mecenate — Feed (Test Assignment)

## Демо

https://github.com/user-attachments/assets/record1.mp4

<video src="./assets/review/record1.mp4" controls width="320"></video>

> Если видео не отображается в GitHub-превью, скачайте его: [assets/review/record1.mp4](assets/review/record1.mp4)

---

Лента публикаций для сервиса поддержки авторов Mecenate.
Мобильное приложение на **React Native + Expo**, TypeScript, MobX + React Query.

## Стек

- **Язык:** TypeScript (strict)
- **Mobile:** React Native 0.81 + Expo SDK 54 (iOS + Android)
- **Навигация:** expo-router
- **Данные:** `@tanstack/react-query` — курсорная пагинация, кэш, pull-to-refresh, оптимистичные лайки
- **State:** MobX (`mobx` + `mobx-react-lite`) — UI-стейт ленты и auth-токен
- **Стилизация:** дизайн-токены ([src/theme/tokens.ts](src/theme/tokens.ts)) — единый источник цветов, отступов, радиусов и типографики

## Структура проекта

```
src/
 ├── api/          # HTTP клиент + endpoint'ы
 ├── store/        # MobX сторы (Auth, FeedUi)
 ├── screens/      # Экраны (FeedScreen)
 ├── components/   # UI компоненты (PostCard, ErrorState, ...)
 ├── hooks/        # React Query хуки (usePostsFeed, useToggleLike)
 ├── providers/    # React провайдеры (QueryProvider)
 ├── theme/        # Дизайн-токены
 ├── types/        # Доменные типы API
 └── utils/        # Утилиты
app/
 ├── _layout.tsx   # expo-router root + провайдеры
 └── index.tsx     # точка входа -> FeedScreen
```

## Что реализовано

- Экран `Feed`: список постов (аватар, имя, превью, обложка, лайки, комментарии)
- Курсорная пагинация (`useInfiniteQuery`, подгрузка при скролле)
- Pull-to-refresh (`RefreshControl`)
- Закрытые посты (`tier: "paid"`) — заглушка вместо тела поста
- Обработка ошибок API: экран ошибки + кнопка «Повторить»
- Оптимистичное переключение лайков с откатом при ошибке
- Фильтр по tier (все / free / paid)
- Skeleton-загрузка

## Запуск

```bash
yarn install
cp .env.example .env    # опционально — есть дефолты
yarn start              # Expo Dev Server -> Expo Go
yarn ios                # iOS симулятор
yarn android            # Android эмулятор
```

## Переменные окружения

| Переменная                 | По умолчанию                             | Описание            |
| -------------------------- | ---------------------------------------- | ------------------- |
| `EXPO_PUBLIC_API_BASE_URL` | `https://k8s.mectest.ru/test-app`        | Базовый URL API     |
| `EXPO_PUBLIC_AUTH_TOKEN`   | `550e8400-e29b-41d4-a716-446655440000`   | UUID-токен (Bearer) |

## API

Swagger: <https://k8s.mectest.ru/test-app/openapi.json>

Используемые эндпоинты:

- `GET /posts?limit&cursor&tier` — лента с курсорной пагинацией
- `POST /posts/{id}/like` — toggle лайка

## Архитектурные заметки

- **React Query** хранит серверное состояние, **MobX** — локальный UI-стейт. Разделение устраняет дублирование и лишние перерисовки.
- HTTP-клиент ([src/api/client.ts](src/api/client.ts)) инжектит Bearer из `AuthStore`, снимает `ApiEnvelope`, бросает типизированный `ApiError`.
- Оптимистичные лайки — `onMutate/onError` в [useToggleLike](src/hooks/useToggleLike.ts) со снапшотами всех feed-кэшей и откатом при ошибке.
- Компоненты мемоизированы (`memo` + `useCallback`) для плавного скролла.
