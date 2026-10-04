# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Stats-va is an Expo (SDK 52) / React Native 0.76 mobile app (TypeScript, strict) that shows and shares a user's Strava activity stats. Published on Android as `com.yabcompany.statsva`.

## Commands

```bash
npm i                    # install
npm start                # npx expo start --dev-client (requires a dev-client build, not Expo Go)
npm run build-dev        # EAS development build
npm run build-android    # EAS production Android build
npm run build-ios        # EAS iOS build
npx tsc --noEmit         # type-check
```

There is no test suite or linter configured.

## Architecture

- **Entry**: `App.tsx` loads Ubuntu fonts, holds the splash screen, and wraps the app in `QueryClientProvider` (react-query v3, 5-min staleTime) → `PaperProvider` (MD3 theme built from `src/theme.ts`) → `AppProvider` → `NavigationContainer`.
- **Auth** (`src/Context.tsx`, `src/screens/Login.tsx`): Strava OAuth via `expo-auth-session` returns a code; `AppProvider.authenticate` exchanges it through `useStravaOauthToken` (POST `/oauth/token` with the client secret), stores the token in SecureStore, and sets it as the default `Authorization` header on the shared axios instance (`src/api.ts`). A response interceptor logs out on 401. Note: `logout()` runs on mount, so sessions are not persisted across app launches, and refresh tokens are not used.
- **Navigation** (`src/Routes.tsx`): unauthenticated stack (Login, About) vs. authenticated stack containing a bottom-tab navigator (Home, Activities, Account) plus Activity and About screens.
- **Data hooks** (`src/hooks/`): one react-query hook per Strava endpoint (`useActivities`, `useActivity`, `useAthleteStats`), each using `select` to unwrap `response.data`. Access app state via `useAppContext`.
- **Screens** live in `src/screens/` (folder per screen when it has sub-components); shared UI in `src/components/`, primitives in `src/components/layout/`.
- **Sharing**: `useShare` captures a `ViewShot` ref to a JPEG and opens the native share sheet.
- **Constants** (`src/constants.tsx`): Strava endpoints/client ID/scopes, AdMob unit IDs, and `SportType` → label/icon maps. When adding a `SportType` in `src/types.ts`, add entries to both `SPORT_TYPE_TO_LABEL` and `SPORT_TYPE_TO_ICON` (they are exhaustively typed).
- **Formatting** helpers in `src/helpers.ts` return `undefined` for falsy input.
- **Styling**: inline styles using tokens from `src/theme.ts` (`Theme.colors`, `Theme.space`, `Theme.fonts`, `Theme.roundness`) and react-native-paper components.
- Ads via `react-native-google-mobile-ads` (`AdBanner` component); maps via `react-native-maps` with polylines decoded by `@mapbox/polyline`.
