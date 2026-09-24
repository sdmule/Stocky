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

This is currently a fresh scaffold (no app-specific business logic yet beyond the default Vite/Vue starter components). See `spec.md` at the repo root for the full product spec.

## Coding standards

- Use `<script setup>` SFCs. Favor small, single-responsibility components — if UI or logic is reused or complex, extract it rather than growing one file.
- Folder layout under `src/`: `views/` for route-level pages, `components/common|<domain>/` for reusable UI (generic vs. domain-specific), `composables/` for reusable reactive logic (`useX.js`), `stores/` for Pinia if/when needed, `services/` for the Firebase access layer, `router/`, `utils/` for pure helpers.
- Never call the Firebase SDK directly from a component — go through `services/`. Views stay thin (layout/orchestration); business logic lives in composables/services/utils.
- Component files: `PascalCase.vue`. Composables: `useX.js`. Use `defineProps`/`defineEmits` with explicit types — no untyped/implicit props.
- Before adding new UI, check `components/common/` for something reusable first; if a piece of UI will appear in 2+ places, build it as its own component from the start.
- Run `npm run format` before committing.

Full detail (component hierarchy, state management approach, reuse checklist) is in `spec.md` §7.
