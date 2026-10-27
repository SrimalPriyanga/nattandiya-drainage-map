# Progress

_Last updated: 2026-10-27_

## Status

The MVP is feature-complete and verified locally, and a Vercel deployment config is in place.
A live deployment against a real Supabase project has not been verified yet.

## Done

- [x] Vite 8 + React 19 + TypeScript 7 scaffold; Tailwind 3.4 (PostCSS/Autoprefixer); Oxlint
- [x] Dependencies: leaflet, react-leaflet, @types/leaflet, @supabase/supabase-js, lucide-react
- [x] Supabase client from env (`src/lib/supabase.ts`) + `.env.example`; graceful "not configured" mode
- [x] Migration: `drainage_reports` table, constraints, RLS, column-level grants; local seed data
- [x] Map: centre [7.4167, 79.8667], zoom 14, locked to the Nattandiya bounds, outside area dimmed
- [x] Trilingual UI (සිංහල default / English / தமிழ்), persisted, `<html lang>` + title follow it
- [x] Click to report → temporary pin → modal form (auto lat/long, category, description,
      Turnstile placeholder) → insert → localized toast → pin appears immediately
- [x] Existing reports fetched (paged) and shown as category-coloured pins with localized popups
- [x] Legend with per-category counts; loading/error states with retry
- [x] Mobile-first layout (bottom-sheet form, safe areas, 16 px inputs) and keyboard/screen-reader support
- [x] `base: '/nattandiya/'` (overridable with `BASE_PATH`); build output mirrors it (`dist/nattandiya/`)
- [x] `vercel.json`: `/` → `/nattandiya/` redirect, SPA fallback, immutable caching for hashed assets
      (verified with `@vercel/routing-utils` + simulated requests, 10/10 checks)
- [x] Docs: CLAUDE.md, DECISIONS.md, README.md, this file

## Verification performed (2026-10-27)

- `npm run typecheck`, `npm run lint` (0 warnings, 41 files) and `npm run build` are clean.
- **SQL**: the migration was applied to PGlite (Postgres in WASM) with Supabase-like roles and default
  grants. All 24 checks passed: anon can select and insert the four columns; cannot set
  status/id/created_at; cannot update/delete/truncate; out-of-area, NaN, unknown-category and
  too-short/too-long rows are rejected; service_role can change status; seed applies.
- **End-to-end**: Playwright (system Chrome) against the dev server at `/nattandiya/`, using a mock
  PostgREST endpoint, a production preview without env vars, and phone (390×844, touch) and desktop
  viewports. **59/59 checks passed**, covering: markers and colours, localized names and popups, the
  popup-dismiss tap, the form and validation, submit → new pin + toast, language switching
  (including a live toast), persistence, out-of-area taps, double-click zoom, keyboard flows with
  focus return, load error → retry, the not-configured mode, and the exact insert/fetch requests.
- The harnesses lived in a temporary directory and are **not** in the repo (see Next).

## Known gaps / limitations

- Turnstile is a visual placeholder only; anonymous inserts are protected by constraints, not by
  a bot check or rate limit (ADR-011).
- Translations were written by the developer. Automated native-language reviews were interrupted
  by an API limit before reporting; only the place names were independently verified against official
  sites. **Have a native Sinhala and Tamil speaker review `si.ts` / `ta.ts`.**
- Standard OSM tiles are fine for light use only (ADR-003).
- No marker clustering; all reports render as individual markers.
- With Supabase configured the JS bundle is ~638 kB (~185 kB gzip), because `@supabase/supabase-js`
  is included; Vite prints its "chunk larger than 500 kB" warning (not an error).
- No moderation UI; status changes require the Supabase dashboard / service role.

## Next

1. Commit Vitest (unit: `toReport`, geo helpers, validation) and Playwright (the e2e flows above,
   with a mock Supabase) to the repo, and add a CI workflow.
2. Turnstile + Supabase Edge Function for verified, rate-limited inserts; then revoke anon insert.
3. Native-speaker translation review.
4. Apply the migration to the real Supabase project, deploy to Vercel (`vercel.json` is ready) and
   check the live routes: `/` → `/nattandiya/`, deep links, assets.
5. Shrink the bundle: lazy-load the Supabase client (the map can render before it arrives) and/or
   split vendor chunks.
6. Nice-to-haves: "use my location" button, photo uploads (Storage), Supabase Realtime for live
   pins, marker clustering, category filter, moderator status updates, PWA/offline.
