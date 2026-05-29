# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # start dev server (Vite HMR)
npm run build        # production build to dist/
npm run lint         # ESLint
npm run preview      # preview production build locally

# Android (Capacitor)
npm run android:copy   # build web + copy assets into Android project
npm run android:open   # open Android project in Android Studio
npm run android:build  # full release APK: build → sync → gradlew assembleRelease
```

There are no tests configured.

## Environment

Create a `.env` file at the project root with:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```
The same values are used by both the web app and the Android APK.

## Architecture

**SheepTrack** is a React 19 + Vite PWA for farm management (sheep, areas, births, health, breeding, sales, tasks). It wraps as an Android APK via Capacitor. The backend is entirely Supabase (Postgres + Auth).

### Context provider hierarchy

```
ThemeProvider
  └─ LanguageProvider
       └─ AuthProvider
            └─ BrowserRouter
                 └─ (protected routes only)
                      UserProvider        ← profile, farms list, multi-farm, roles
                        └─ FarmProvider  ← all farm data + CRUD
                             └─ MediaProvider  ← farm videos (IndexedDB, not Supabase)
                                  └─ Layout + pages
```

`AuthContext` wraps Supabase auth (`session`, `signIn`, `signUp`, `signOut`, `resetPassword`, `updatePassword`). `session === undefined` means still loading.

`UserContext` fetches the user's `profiles` row and their farms via the `farm_members` join table. Creating a farm calls the `create_farm_for_user` Supabase RPC. Exposes `activeFarmId`, `myRole`, and `isOwnerOrAdmin`.

`FarmContext` is the main data store — on `activeFarmId` change it bulk-fetches all eight tables (`sheep`, `areas`, `births`, `health_records`, `breeding_records`, `transactions`, `tasks`, `deaths`) in parallel. Every CRUD function optimistically updates local state after a Supabase write and calls `showToast`. The `toast` value is read by `Layout` to display a bottom overlay.

`MediaContext` stores farm videos in the browser's **IndexedDB** (not Supabase). Files are stored as `ArrayBuffer` and re-hydrated into `blob:` URLs on load.

### snake_case ↔ camelCase bridge

Supabase rows use `snake_case`; the frontend uses `camelCase`. Always use the helpers in `src/lib/supabase.js`:
- `mapRow(obj)` / `mapRows(arr)` — DB → JS (reading)
- `toDb(obj)` — JS → DB (writing, also strips `undefined` values)

### Routing

Public routes (`/login`, `/register`, `/forgot-password`, `/reset-password`) are wrapped in `RedirectIfAuthed`. All other routes are inside `RequireAuth`. Route params: sheep detail uses `/sheep/:id`.

### UI conventions

- **Tailwind v4** — configured via `@tailwindcss/vite` plugin, no separate `tailwind.config.js`.
- Custom design tokens include `bg-cream-100`, `border-farm-400`, and `shadow-card-lg`.
- Dark mode is toggled via a `dark` class on `<html>` (stored in `localStorage` as `sheeptrack_theme`).
- Layout: desktop sidebar (fixed, `lg:ml-64`) + mobile bottom nav (`BottomNav`) + `TopBar`. Main content has `pb-24 lg:pb-6` to clear the mobile nav.
- Primitives in `src/components/ui/` are custom wrappers. Components in `src/components/reui/` (alert, badge, timeline) follow a variant pattern using `class-variance-authority`.

### i18n

All user-visible strings should go through `useLanguage()` from `LanguageContext`. Translation keys live in `src/i18n/translations.js`. Supported languages are configured there; currently `en` is the primary locale.
