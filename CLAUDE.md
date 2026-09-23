# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project layout

The repository root contains a single app, `StockyApp/`, a Vue 3 + Vite project. All commands below are run from `StockyApp/`.

## Commands

```sh
npm install       # install dependencies
npm run dev       # start Vite dev server with HMR
npm run build     # production build (outputs to dist/)
npm run preview   # preview the production build locally
npm run format    # format src/ with Prettier
```

There is no test suite or lint script configured yet.

## Architecture

- Entry point: `src/main.js` mounts `src/App.vue` to `#app` in `index.html`.
- Components live in `src/components/`; SFCs use `<script setup>` style Vue 3.
- The `@` import alias resolves to `src/` (configured in both `vite.config.js` and `jsconfig.json`).
- `vite-plugin-vue-devtools` is enabled in dev.
- The project pins Vue to the `rc` (Vue 3 next/vapor-capable) release line via `package.json` `dependencies` and `overrides` — do not downgrade to a stable `^3.x` release without checking why the `rc` pin was chosen.
- Node engine requirement: `^22.18.0 || >=24.12.0`.

This is currently a fresh scaffold (no app-specific business logic yet beyond the default Vite/Vue starter components).
