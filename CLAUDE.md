# CLAUDE.md — Nattandiya Drainage Map

Civic-tech SPA: residents of Nattandiya, Sri Lanka anonymously report blocked drains, canal
issues and illegal constructions on a map. Trilingual UI — **Sinhala (default)**, English, Tamil.
Read `DECISIONS.md` (why things are the way they are) and `PROGRESS.md` (status / next steps)
before larger changes, and update both as you work.

## Commands

Node ≥ 20.19 (Vite 8). Install with `npm install`.

| Command             | What it does                                                       |
| ------------------- | ------------------------------------------------------------------ |
| `npm run dev`       | Dev server → **http://localhost:5173/nattandiya/** (note the base path) |
| `npm run build`     | `tsc -b` type-check + production build into `dist/nattandiya/`    |
| `npm run typecheck` | Type-check only                                                    |
| `npm run lint`      | Oxlint (react, react-hooks, jsx-a11y, typescript rules)           |
| `npm run preview`   | Serve the build → http://localhost:4173/nattandiya/               |

Before finishing any change: `npm run typecheck && npm run lint && npm run build` must be clean
(zero warnings). There is no automated test suite yet — see PROGRESS.md for how the app was verified.
Add `-- --host` to `npm run dev` to test on a phone over the LAN.

## Environment variables

Copy `.env.example` → `.env.local` (git-ignored). Everything prefixed `VITE_` is bundled into the
**public** client.

| Variable                  | Required | Purpose                                                                 |
| ------------------------- | -------- | ----------------------------------------------------------------------- |
| `VITE_SUPABASE_URL`       | yes*     | Supabase project URL                                                    |
| `VITE_SUPABASE_ANON_KEY`  | yes*     | Public anon (legacy JWT) or publishable (`sb_publishable_…`) key — never the service-role/secret key |
| `VITE_TURNSTILE_SITE_KEY` | no       | Placeholder only for now (`data-sitekey` on the Turnstile slot)         |
| `BASE_PATH`               | no       | Build-time URL sub-path, default `/nattandiya/`; `BASE_PATH=/` for root  |

\* Without them the app runs in a read-only "not configured" mode: map, legend and language
switching work, the report form opens but submitting is disabled, and a notice is shown.

## Architecture

```
src/
  main.tsx                 Providers: I18nProvider → ToastProvider → App; imports Leaflet CSS first
  App.tsx                  Layout + report flow state (draft location, submit → add pin + toast)
  index.css                Tailwind layers, Leaflet overrides, marker CSS
  config/map.ts            Centre, zoom limits, MAP_BOUNDS, tile URL/attribution
  config/categories.ts     Category colour + lucide icon
  types/report.ts          Category/status keys, length limits, DrainageReport type, guards
  types/database.ts        Hand-written Supabase `Database` type (keep in sync with migrations)
  lib/supabase.ts          Client from env, or `null` when not configured (isSupabaseConfigured)
  lib/reports.ts           fetchAllReports() (paged), createReport(), row validation (toReport)
  lib/geo.ts | format.ts | storage.ts | motion.ts   Small pure helpers
  hooks/useReports.ts      Loads reports once (+ retry), merges new ones by id
  i18n/                    languages.ts, context.ts, I18nProvider.tsx, useI18n.ts, labels.ts,
                           locales/{en,si,ta}.ts (en.ts defines the Dictionary type)
  components/              Header, LanguageSwitcher, InstructionBanner, ConfigNotice,
                           ReportsStatus, Legend, ReportModal, TurnstilePlaceholder
  components/map/          DrainageMap (MapContainer), MapInteractions (events/a11y/resize),
                           ReportMarker + ReportPopup, OutsideAreaMask, markerIcons (divIcons)
  components/toast/        ToastProvider, Toaster, contexts + hooks
supabase/migrations/       Schema, constraints, RLS + grants (source of truth for the DB)
supabase/seed.sql          Sample rows for LOCAL development only
vercel.json                Vercel: / → /nattandiya/ redirect, SPA fallback, asset caching (ADR-021)
```

## Conventions

- **No hard-coded UI text.** Add a key to `src/i18n/locales/en.ts` first — its shape is the
  `Dictionary` type, so `si.ts`/`ta.ts` fail to compile until translated. Use functions for
  interpolation (`descriptionTooShort: (min: number) => …`). Read strings via `const { t } = useI18n()`.
- Toasts take dictionary selectors, not strings: `showToast({ message: (t) => t.toast.submitted })`,
  so a visible toast re-renders when the language changes. Pass `key` to dedupe.
- Official place-name spellings (from nattandiya.ds.gov.lk / nattandiyaps.lk): **නාත්තන්ඩිය**,
  **நாத்தாண்டி**. Text that is deliberately trilingual (language-switcher label, `<noscript>`) is the
  only exception to "everything comes from the dictionary".
- Values shared with the database must change together:
  categories/statuses (`types/report.ts`) ↔ check constraints; `MAP_BOUNDS` (`config/map.ts`) ↔
  latitude/longitude constraints; `DESCRIPTION_MIN/MAX_LENGTH` ↔ `char_length` constraint (code points).
  Schema changes = a **new** migration file + update `types/database.ts`.
- New category: `REPORT_CATEGORIES` + `CATEGORY_STYLES` (colour ≥ 3:1 with white) + glyph in
  `markerIcons.ts` (copy the Lucide icon's paths) + all three dictionaries + a migration.
- TypeScript 7 with `erasableSyntaxOnly` (no enums/namespaces/parameter properties) and
  `verbatimModuleSyntax` (`import type` for types). React 19: `use(Context)`, `<Context value>`,
  `useEffectEvent` for handlers that effects subscribe.
- Tailwind **v3.4** (not v4). Form controls use `text-base` (16 px) to stop iOS zoom-on-focus.
  Mobile-first: base classes for phones, `sm:` and up for larger screens.
- Accessibility is a requirement: keep keyboard paths working (Enter on the focused map reports
  at the centre; Enter/Escape on markers/popups), localized `aria-label`s, visible focus.

## Gotchas (learned the hard way)

- react-leaflet `MapContainer` props are read **once**. Things that must react to language
  changes are re-created (`ZoomControl key={language}`) or patched in effects (marker `aria-label`,
  popup close-button label, map container `aria-label`).
- react-leaflet keeps `<Popup>` children mounted after the first open — `ReportMarker` renders
  `ReportPopup` only while open so its focus effects map to open/close.
- `ReportModal` opens/closes the native `<dialog>` in a **layout** effect; a passive-effect
  cleanup runs after the element is detached and the browser then doesn't restore focus.
- Leaflet closes popups on `preclick`; `MapInteractions` ignores the click that dismissed a popup
  and waits 300 ms so double-click/double-tap zooms instead of reporting.
- App overlays (legend, toasts, status pill) are siblings of the map, not children, so their
  clicks never reach Leaflet; the map has `isolate` so Leaflet's z-indexes stay inside it.
- A native modal `<dialog>` sits in the top layer above everything, including toasts — show
  errors that happen while the form is open inline in the form.
- Leaflet only watches window resizes; a `ResizeObserver` calls `invalidateSize()` for layout changes.
- The build output mirrors the URL (`dist/nattandiya/…`, from `outDir = dist + base`), and
  `vercel.json` hard-codes `/nattandiya/`. Changing `BASE_PATH` means updating `vercel.json` too.
- `import.meta.env.VITE_*` is inlined at build time: without Supabase env vars the bundler drops
  `@supabase/supabase-js` entirely (~423 kB bundle); with them it is ~638 kB (Vite's > 500 kB warning).
- zsh: never name a shell variable `path` (it is tied to `$PATH`).
