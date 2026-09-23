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
- After first sign-up, user is prompted to enter:
  - **Weight**
  - **Activity level** (simple multiplier, e.g. Sedentary / Light / Active / Very Active)
- App calculates and stores a **daily calorie goal** from these two inputs (see §4).
- User can skip/edit this later from Profile/Settings.

### 2.3 Dashboard (Today)
- Shows current date, daily calorie goal, total consumed, and remaining calories.
- Log broken into 4 sections: Breakfast, Lunch, Dinner, Snacks — each listing its logged entries and a subtotal.
- Each section has an "Add food" action.

### 2.4 Add Food to a Meal
- Tapping "Add food" under a meal opens a search over the user's **personal food library** (by name).
- If the desired item doesn't exist, user can create a new food item inline (see §2.5).
- User selects an item, enters a **quantity** (e.g. 1, 0.5, 2.5), and confirms — this creates a log entry under that meal for the current (or selected) day.
- Calories logged = `caloriesPerServing × quantity`.

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

### 2.9 Profile / Settings
- View/edit weight and activity level → daily calorie goal recalculates automatically.
- Logout.

## 3. Data Model (Firestore)

```
users/{userId}
  weight: number
  activityLevel: string            // e.g. "sedentary" | "light" | "active" | "very_active"
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

Auto-calculated from **weight** and **activity level** only (no age/height/sex inputs, per scope decision):

- A base calorie estimate is derived from weight, then multiplied by an activity multiplier tied to the selected activity level (e.g. Sedentary ×1.2, Light ×1.375, Active ×1.55, Very Active ×1.725 — exact base formula and multiplier values to be finalized during implementation as a simple placeholder, not a full Mifflin-St-Jeor calculation).
- This is intentionally a lightweight estimate, not a medically precise BMR/TDEE calculation.

## 5. Screens / Pages

1. Login
2. Sign Up
3. Onboarding / Profile Setup
4. Dashboard (Today's log)
5. Add / Search Food (per meal)
6. Create / Edit Food Item
7. Day History (past date view — reuses Dashboard layout)
8. Trends (7/30-day view)
9. Profile / Settings

## 6. Non-Functional Notes

- Mobile-first responsive design; desktop is a secondary concern.
- Deployed via Firebase Hosting.
- No test suite currently configured (per `CLAUDE.md`) — to be addressed separately if desired.
- Explicitly **out of scope for this phase**: macro tracking (protein/carbs/fat), external nutrition/food API integration, social login (Google, etc.).

## 7. Open Questions / Future Phases

- Exact base-calorie formula and activity multipliers for §4 (needs a concrete choice before implementation).
- Whether to support weight-over-time tracking (separate from the single "current weight" profile field).
- Whether to eventually add macro tracking or an external food database/API.
- Whether to add social login options (Google, Apple) later.
- Whether trends should be a chart (e.g. line graph) or a simple list — chart is assumed but not yet finalized.
