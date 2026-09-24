# Stocky — Calorie Tracker Spec

## 1. Overview

Stocky is a mobile-first website for tracking daily calorie intake across four meals: **Breakfast, Lunch, Dinner, Snacks** — similar in spirit to MyFitnessPal, scoped down to calories only (no macro tracking).

**Stack**
- Frontend: Vue 3 + Vite (existing `StockyApp/` scaffold)
- Auth: Firebase Authentication — email/password
- Database: Firestore
- Hosting: Firebase Hosting
- Design: mobile-first responsive layout

## 2. User Flows

### 2.1 Sign up / Login / Logout
- New user signs up with email + password (Firebase Auth).
- Returning user logs in with email + password.
- Logout available from a settings/profile menu.
- Unauthenticated users are redirected to the login screen; authenticated users skip straight to the dashboard.

### 2.2 Onboarding — Profile Setup (first login only)
Two-step flow shown after first sign-up:
1. **Profile details**: gender, age, height (cm), weight (kg), activity level (Sedentary / Light / Active / Very Active).
2. **Goal rate**: a toggle list of weekly weight-change rates (e.g. Lose 2/1.5/1/0.5 lb/week, Maintain, Gain 0.5/1 lb/week), each showing the resulting daily calorie target live as the user taps between them (see §4). Selecting one and confirming saves the **daily calorie goal**.
- User can edit both steps later from Profile/Settings (goal rate via the "Adjust goal" side panel — see §2.9).

### 2.3 Dashboard (Today)
- Shows current date, daily calorie goal, total consumed, and remaining calories.
- Log broken into 4 read-only sections: Breakfast, Lunch, Dinner, Snacks — each listing its logged entries and a subtotal. Entries can still be edited/deleted here (§2.6), but there is no per-meal "Add food" button — all new logging goes through the global **Log Food** flow (§2.4).

### 2.4 Log Food (global "+" action)
- The bottom nav's **+** button (see §2.10) opens a dedicated **Log Food** page — not a modal — with three steps:
  1. **Search**: an autocomplete-style live search over the user's own **personal food library** only (never other users' items — enforced both by the Firestore data model, which scopes `foodItems` under `users/{userId}`, and by security rules). If the desired item doesn't exist, the user can create a new one inline (see §2.5), which continues into step 3 once saved.
  2. **Details**: pick the **meal** (Breakfast/Lunch/Dinner/Snacks) and a **quantity** (e.g. 1, 0.5, 2.5) for the selected food's serving size.
  3. Confirming logs the entry for **today** and returns to the Dashboard. Calories logged = `caloriesPerServing × quantity`.

### 2.5 Create / Edit Food Item
- Fields: **name**, **serving unit** (e.g. "1 cup", "1/2 cup", "1 count"), **calories per serving**.
- Saved to the user's personal Firestore-backed library — reusable across any future day.
- Editing an existing food item updates the library entry; it does not retroactively change calories on already-logged entries (which store a computed snapshot).

### 2.6 Edit / Delete a Log Entry
- From the dashboard (today or a past day), user can edit the quantity or delete a logged entry.

### 2.7 Past Days / History Navigation
- Date picker or prev/next-day controls let the user view and edit any past day's log using the same dashboard layout.

### 2.8 Trends View
- Simple view (chart or list) of total daily calories over the **last 7 / 30 days**, compared against the daily goal.

### 2.9 Settings
- Single **Settings** screen (bottom nav) holds all profile/account controls: view/edit gender, age, height, weight, and activity level → base maintenance calories (TDEE) recalculates.
- **Adjust goal** button opens a slide-in side panel (`SideSheet`) showing the same weekly-rate toggle list as onboarding step 2; tapping a rate immediately previews its calorie target and, on selection, saves it as the new daily calorie goal.
- Logout.

### 2.10 Bottom Navigation
- Sticky bottom nav: the left **80%** holds four tabs — Today (Dashboard), Foods (library), Trends, Settings.
- The right **20%** is a distinct accent-colored **+** button that opens the global Log Food flow (§2.4) from anywhere in the app.

## 3. Data Model (Firestore)

```
users/{userId}
  gender: string                   // "male" | "female" | "other"
  age: number
  heightCm: number
  weightKg: number
  activityLevel: string            // e.g. "sedentary" | "light" | "active" | "very_active"
  goalRateLbPerWeek: number        // negative = lose, positive = gain, 0 = maintain
  dailyCalorieGoal: number         // computed, cached
  createdAt: timestamp

users/{userId}/foodItems/{foodItemId}
  name: string
  servingUnit: string              // e.g. "1 cup", "1/2 cup", "1 count"
  caloriesPerServing: number
  createdAt: timestamp

users/{userId}/logs/{date}/entries/{entryId}   // date as "YYYY-MM-DD"
  foodItemId: string
  foodName: string                 // snapshot at log time
  servingUnit: string               // snapshot at log time
  meal: string                     // "breakfast" | "lunch" | "dinner" | "snacks"
  quantity: number
  calories: number                 // computed at log time = caloriesPerServing * quantity
  createdAt: timestamp
```

**Security rules**: all reads/writes under `users/{userId}/**` require `request.auth.uid == userId`.

## 4. Daily Calorie Goal Calculation

Uses the standard **Mifflin-St Jeor** BMR formula, then adjusts for activity level and the user's weekly weight-change goal:

1. **BMR** from gender, age, height (cm), weight (kg):
   - Male: `10 × weightKg + 6.25 × heightCm − 5 × age + 5`
   - Female: `10 × weightKg + 6.25 × heightCm − 5 × age − 161`
   - Other: midpoint of the two constants (`10 × weightKg + 6.25 × heightCm − 5 × age − 78`)
2. **TDEE (maintenance calories)** = `BMR × activity multiplier` (Sedentary ×1.2, Light ×1.375, Active ×1.55, Very Active ×1.725).
3. **Daily calorie goal** = `TDEE + (goalRateLbPerWeek × 3500 ÷ 7)` — the standard ~3500 kcal-per-pound assumption, applied as a daily deficit (negative rate) or surplus (positive rate).

Preset weekly rates offered in onboarding and the goal-rate side panel: Lose 2 / 1.5 / 1 / 0.5 lb/week, Maintain, Gain 0.5 / 1 lb/week. Selecting a different rate recalculates and previews the resulting daily calories instantly, without needing to re-enter profile details.

## 5. Screens / Pages

1. Login
2. Sign Up
3. Onboarding / Profile Setup (details step + goal-rate step)
4. Dashboard (Today's log)
5. Log Food (global search / create / meal+quantity flow, opened via bottom-nav "+")
6. Food Library (manage saved food items directly — separate from the Log Food flow)
7. Day History (past date view — reuses Dashboard layout)
8. Trends (7/30-day view)
9. Settings

## 6. Non-Functional Notes

- Mobile-first responsive design; desktop is a secondary concern.
- Deployed via Firebase Hosting.
- No test suite currently configured (per `CLAUDE.md`) — to be addressed separately if desired.
- Explicitly **out of scope for this phase**: macro tracking (protein/carbs/fat), external nutrition/food API integration, social login (Google, etc.).

## 7. Coding Standards & Component Hierarchy

### 7.1 Component structure
- Use `<script setup>` SFCs throughout (matches existing scaffold).
- Favor small, single-responsibility components over large ones. If a piece of UI or logic is used more than once — or is complex enough to obscure the parent — pull it into its own component.
- Suggested folder layout under `src/`:
  ```
  src/
    views/            # route-level "page" components (Login, Dashboard, Trends, ...)
    components/
      common/          # generic reusable UI: Button, Modal, Input, DatePicker, ProgressBar
      food/            # food-domain components: FoodSearch, FoodListItem, FoodItemForm
      log/             # log-domain components: MealSection, LogEntryRow, QuantityInput
    composables/        # reusable reactive logic (useAuth, useCalorieGoal, useFoodLibrary)
    stores/             # Pinia stores (auth, foodLibrary, dailyLog) if/when state grows beyond composables
    services/           # Firebase access layer (auth.js, firestore.js) — no Firebase calls directly in components
    router/             # vue-router route definitions
    utils/              # pure helper functions (date formatting, calorie math)
  ```
- Views compose components; they should stay thin — orchestration and layout only, not business logic.
- Firestore/Firebase calls live in `services/`, never directly inside a component — components call composables or services, not the SDK.

### 7.2 Naming & style
- Component filenames: `PascalCase.vue` (e.g. `MealSection.vue`, `FoodItemForm.vue`).
- Composables: `useX.js` camelCase, one concern per composable (e.g. `useCalorieGoal.js`, `useFoodLibrary.js`).
- Props: define with `defineProps` and explicit types/defaults; avoid untyped/implicit props.
- Emits: declare with `defineEmits`; prefer explicit event names (`update:quantity`, not generic `change`).
- Keep template logic minimal — computed properties and methods over inline expressions beyond simple property access.
- Run `npm run format` (Prettier) before committing; follow existing `.prettierrc` config.

### 7.3 State management
- Local/UI state: component-local `ref`/`reactive`.
- Cross-cutting state (current user, food library, today's log): composables first; introduce Pinia only if prop-drilling/composable duplication becomes a real problem.
- Derived values (e.g. remaining calories, daily totals) should be `computed`, not manually kept in sync.

### 7.4 Reuse checklist (apply before writing new UI)
- Is there an existing `common/` component that already does this (button, modal, input, list row)? Reuse or extend it rather than duplicating markup/styles.
- If a new piece of UI will appear in ≥2 places (e.g. a food list row used in both search and history), build it as a component from the start.
- Is there existing calorie/date/formatting logic in `utils/` or a composable? Reuse it instead of re-deriving inline.

## 8. Open Questions / Future Phases

- Whether to support weight-over-time tracking (separate from the single "current weight" profile field).
- Whether to eventually add macro tracking or an external food database/API.
- Whether to add social login options (Google, Apple) later.
- Whether trends should be a chart (e.g. line graph) or a simple list — chart is assumed but not yet finalized.
