# SnapSell Workshop Starter (Idea to Production)

This repo is a **2-hour React Native workshop starter** for mixed-skill developers.

## Workshop Goal
Build confidence moving from “it works” to “production-grade” by fixing intentional flaws in:

1. Design system consistency (`@shopify/restyle`)
2. Animation performance (`react-native-reanimated`)
3. Feed rendering performance (`@shopify/flashlist`)
4. Resilience & crash handling (Error Boundaries)

---

## App Concept
**SnapSell** is a hyper-local Newfoundland marketplace.

Core feature:
- User selects or captures an item photo
- AI utility (`src/services/llmService.ts`) generates:
  - title
  - description
  - category
  - price

The `llmService.ts` intentionally fails 20% of the time in `main` to simulate real-world network/model issues.

---

## Expo Go Compatibility
This repository is designed for **Expo Managed Workflow** and is intended to run in **Expo Go**.

```bash
npm install
npm run start
```

Then scan the QR code from Expo CLI.

---

## Preinstalled Dependencies
- `@shopify/restyle`
- `react-native-reanimated` (v3)
- `@shopify/flashlist`
- `expo-camera`
- `expo-image-picker`

---

## Branch Plan
- `main` → flawed starter
- `step-1-restyle` → design system migration
- `step-2-reanimated` → scanning laser animation
- `step-3-flashlist` → feed performance optimization
- `step-4-resilience` → error boundary fallback flow
- `final-production` → all improvements complete

---

## Project Structure
- `App.tsx` → lightweight tab shell
- `src/screens/HomeScreen.tsx` → feed (intentionally FlatList + heavy cards in `main`)
- `src/screens/CreateListingScreen.tsx` → photo + AI draft workflow
- `src/screens/ProfileScreen.tsx` → profile + hardware placeholder button
- `src/components/ItemCard.tsx` / `CategoryPill.tsx` → intentionally hardcoded styling in `main`
- `src/services/llmService.ts` → mock AI response + failure simulation
- `src/data/mockItems.ts` → ~100 localized Newfoundland marketplace items
