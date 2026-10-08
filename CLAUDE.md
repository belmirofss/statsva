# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Stats-va is an Expo (SDK 54) / React Native 0.81 mobile app (TypeScript, strict) that shows and shares a user's Strava activity stats. Published on Android as `com.yabcompany.statsva`.

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

- **Entry**: `App.tsx` loads Ubuntu fonts, holds the splash screen, and wraps the app in `QueryClientProvider` (@tanstack/react-query v5, 5-min staleTime) → `PaperProvider` (MD3 theme built from `src/theme.ts`) → `AppProvider` → `NavigationContainer`.
- **Auth** (`src/Context.tsx`, `src/screens/Login/Login.tsx`): Strava OAuth via `expo-auth-session` returns a code; `AppProvider.authenticate` exchanges it through `useStravaOauthToken` (POST `/oauth/token` with the client secret), stores the access + refresh tokens in SecureStore (`src/session.ts`), and sets the access token as the default `Authorization` header on the shared axios instance (`src/api.ts`). A response interceptor logs out on 401. `logout()` runs on mount, so sessions are not persisted across app launches. Every logout (including the one on mount, which catches sessions left over from a previous launch) calls Strava's `/oauth/deauthorize` via `revokeStoredSession`, refreshing first if the access token expired. This keeps the app under Strava's connected-athlete limit, so don't remove it. Deauthorizing revokes all of that athlete's tokens, so `authenticate` waits for any pending revocation before exchanging a new code.
- **Navigation** (`src/Routes.tsx`): unauthenticated stack (Login, About) vs. authenticated stack containing a bottom-tab navigator (Home, Activities, Insights, Account labelled "Profile") plus Activity, YearInReview (modal), the Insights detail screens, Gear, Segment and About. Tab screens and Activity hide the navigator header and draw their own: `LargeHeader` scrolls with the content and `CompactHeader` fades in via `useCollapsingHeader` (`src/components/layout/ScreenHeader.tsx`). Pushed screens use `DetailScreen` (`src/components/layout/DetailScreen.tsx`) for the back button and the same collapsing title. Activity swaps the tab bar for a pinned Share bar. New routes need an entry in `RootParamList` (`src/index.d.ts`).
- **Insights** (`src/screens/Insights/`, logic in `src/insights/`): every Insights screen reads `useActivityHistory`, one shared query for all activities since 1 January last year, so opening several screens costs no extra Strava requests (the rate limit is app-wide). Keep the calculations as pure functions in `src/insights/` and the screens thin. Dates there are UTC moments at local midnight built from `start_date_local` (`src/insights/dates.ts`). Fitness uses Relative Effort (`suffer_score`) with a moving-time estimate when it is missing; sunrise/sunset is computed locally (`src/insights/sun.ts`), no API.
- **Third-party APIs** (free, no keys, called with plain `axios`, never the Strava `API` instance so the token is not sent): Open-Meteo for activity weather (`useActivityWeather`; forecast endpoint for the last ~80 days, archive before that) and BigDataCloud's client reverse geocoder for Explorer countries/cities (`usePlaces`, cached in AsyncStorage by ~10 km cell). Only coordinates and dates leave the device.
- **Gear** (`useGear`): names and lifetime distances come from the latest activity's detail per `gear_id`, which avoids needing the `profile:read_all` scope. Shoe retire-at limits live in AsyncStorage. **Segment** history uses `/segment_efforts`, which Strava only serves to subscribers; `useSegmentEfforts` reports a 402 as `isLocked` and the screen falls back to the segment's own stats.
- **Data hooks** (`src/hooks/`): one react-query hook per Strava endpoint. `useActivities` is an infinite query (30 per page); `useRecentActivities` loads the last `RECENT_WEEKS` (12) of activities for the Home heatmap and latest activity, with `useLatestActivity` as a fallback when that window is empty; `useActivityStreams` loads altitude/heart-rate/power streams for the Activity charts. Access app state via `useAppContext`.
- **Screens** live in `src/screens/` (folder per screen when it has sub-components); shared UI in `src/components/`, primitives in `src/components/layout/` (use `AppText` for text).
- **Sharing**: `ShareSheet` (`src/components/share/`) previews a `ShareCard` inside a `ViewShot` and lets the user pick a style (Light, Dark, Orange, or Clear, which exports a transparent PNG) and toggle route, weather (when `content.weather` is set) and name. `ShareCardContent.routes` draws a grid of routes for posters. The choice persists through `useShareCardPrefs`; `useShare` captures and opens the native share sheet.
- **Drawing**: charts (`ColumnChart`, `LineChart`), the heatmap, the time-of-day clock and route line art (`RouteArt`) are built from plain Views, so there is no SVG dependency. Avoid adding native modules casually: `runtimeVersion` follows the SDK version, so an OTA update that needs a new native module would crash existing installs.
- **Constants** (`src/constants.tsx`): Strava endpoints/client ID/scopes, AdMob unit IDs, `SportType` → label/MaterialCommunityIcons name maps, and sport groupings for filters. When adding a `SportType` in `src/types.ts`, add entries to both `SPORT_TYPE_TO_LABEL` and `SPORT_TYPE_TO_ICON` (they are exhaustively typed).
- **Formatting** helpers in `src/helpers.ts` return `undefined` for falsy input. Use `formatSpeedForSport` so runs/walks/hikes show min/km and swims min/100m, and `formatElevation` (always metres) for elevation. `start_date_local` is wall-clock time tagged as UTC, so read it with `activityLocalMoment`.
- **Styling**: inline styles using tokens from `src/theme.ts` (`Theme.colors`, `Theme.space`, `Theme.radius`, `Theme.gutter`, `Theme.fonts`). Filled buttons use `primaryDark` for contrast; `primary` is for accents, routes and charts.
- Ads via `react-native-google-mobile-ads` (`AdBanner` component); maps via `react-native-maps` with polylines decoded by `@mapbox/polyline`. `Map` uses the standard map type with the "Quiet" style in `src/mapStyle.ts` (custom styles do not apply to satellite imagery), draws the route as an orange line over a white casing, and adds start/finish and optional km markers; Activity offers a Map/Satellite toggle.
