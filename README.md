# Снаружи

Мобильное приложение для короткой повседневной практики переключения внимания. Сейчас в приложении реализован только стартовый экран.

## Требования

- Node.js 22.16.0 (версия указана в `.nvmrc`).
- npm.
- Android SDK и эмулятор для запуска на Android.

## Установка и запуск

```sh
nvm install
nvm use
npm install
```

Для первой сборки, установки и запуска Android development build:

```sh
npm run android
```

Для последующих запусков на эмуляторе с установленной development build:

```sh
npx expo start --dev-client --android
```

Skia требует нативный development build, поэтому для предпросмотра в Expo Go приложение не подходит.

## Проверки

```sh
npm run test:ci
npm run typecheck
npx expo export --platform android
```
