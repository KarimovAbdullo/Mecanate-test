# Mecenate — Feed

## Demo

https://github.com/user-attachments/assets/ea0fc6f5-45b7-4662-9eef-8e93a95f31a3

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

## Используемые библиотеки

| Пакет                        | Назначение                                               |
| ---------------------------- | -------------------------------------------------------- |
| `expo` / `expo-router`       | Runtime и файловая навигация                             |
| `react-native`               | UI-слой (iOS + Android)                                  |
| `@tanstack/react-query`      | Серверное состояние, курсорная пагинация, кэш, refetch   |
| `mobx` / `mobx-react-lite`   | Локальный UI-стейт (фильтр tier, auth-токен)             |
| `react-native-reanimated`    | Entering-анимация карточек ленты                         |
| `react-native-safe-area-context` | Safe-area на iOS/Android                             |
| `expo-image`                 | Быстрая загрузка и кэш изображений                       |
| `@expo/vector-icons`         | Иконки (Ionicons)                                        |
| `typescript`                 | Strict-типизация                                         |
