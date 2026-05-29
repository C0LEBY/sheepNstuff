# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Android APK build

This project now includes a Capacitor Android wrapper. Use the same Supabase backend configuration from `.env` for both the web app and the APK.

Commands:

- `npm run android:copy`
  - Builds the web app and copies the generated assets into the Android project.
- `npm run android:open`
  - Opens the Android project in Android Studio.
- `npm run android:build`
  - Builds the web app, syncs the Android wrapper, and assembles a release APK.

After `npm run android:open`, in Android Studio choose `Build > Build Bundle(s) / APK(s) > Build APK(s)`.

Make sure your `.env` file contains the correct Supabase values so the APK and web app share the same database.
