# Decision log

Newest decisions go at the bottom. Format: context → decision → consequences.

### ADR-001 · Scaffold with create-vite defaults (2026-10-27)
`create-vite` 9 `react-ts` was generated in a temp directory and copied in, to keep the repo's
existing `.git` and `.gitignore` (template entries were appended). Kept its defaults: React 19.3,
Vite 8, TypeScript 7, **Oxlint** (not ESLint), with the `react`, `jsx-a11y`, `typescript` and `oxc`
plugins and `react/exhaustive-deps` enabled.

### ADR-002 · Tailwind CSS v3.4 via PostCSS + Autoprefixer (2026-10-27)
The brief specified `tailwindcss`, `postcss`, `autoprefixer` — the v3 integration (v4 replaces it
with `@tailwindcss/vite` or `@tailwindcss/postcss` and makes Autoprefixer redundant). Pinned
`tailwindcss@^3.4` so every listed package is actually used. Upgrade path later:
`npx @tailwindcss/upgrade`.

### ADR-003 · Leaflet 1.9 + react-leaflet 5 with standard OSM tiles (2026-10-27)
react-leaflet 5 is the React 19 line. Tiles come from `tile.openstreetmap.org` (no a/b/c
subdomains, per current OSM guidance) with the required attribution. The OSM tile policy allows
only light use — a busy production deployment should switch `TILE_URL` to a tile provider or a
self-hosted cache. The Leaflet attribution prefix is a plain "Leaflet" link (no flag icon).

### ADR-004 · Locking the map to Nattandiya (2026-10-27)
`maxBounds` = [[7.38, 79.82], [7.46, 79.92]] with `maxBoundsViscosity: 1`, default zoom 14,
`minZoom` 13, `maxZoom` 19. Wide screens can still see past the bounds, so the outside is dimmed
by a polygon-with-hole mask and the area is outlined. Clicks outside the area show a toast
instead of opening the form, and database check constraints reject out-of-area rows anyway.

### ADR-005 · Home-grown, typed i18n (2026-10-27)
No i18n library: three plain TS dictionaries with `en.ts` defining the `Dictionary` type, so a
missing translation is a compile error. Interpolated strings are functions. A context exposes
`{ language, setLanguage, t, locales }`. Sinhala is the default; the choice persists in
`localStorage`; the browser language is deliberately **not** auto-detected (most phones in Sri
Lanka run an English UI, which would override the intended Sinhala default). `<html lang>` and
`document.title` follow the language. Dates use `Intl` in the **Asia/Colombo** time zone;
English uses `['en-LK', 'en-GB']` because browsers lack en-LK data and would show US formats.

### ADR-006 · Language switcher = native `<select>` (2026-10-27)
Gives keyboard, screen-reader and native mobile-picker behaviour for free and fits a 360 px
header. Options show each language's own name with a `lang` attribute; the label/title is
deliberately trilingual ("භාෂාව / Language / மொழி") because the person looking for it may not read
the current language.

### ADR-007 · Official place-name spellings (2026-10-27)
Sinhala **නාත්තන්ඩිය** and Tamil **நாத்தாண்டி**, as used by the Divisional Secretariat
(nattandiya.ds.gov.lk, si/ta pages) and the Pradeshiya Sabha (nattandiyaps.lk). The first draft
used නාත්තණ්ඩිය / நாத்தாண்டிய.

### ADR-008 · System fonts only (2026-10-27)
Android, iOS/macOS and Windows all ship Sinhala and Tamil faces, so the font stack lists them
(Noto Sans Sinhala/Tamil, Nirmala UI, Iskoola Pota, Latha, Sangam MN) instead of downloading web
fonts on metered mobile data. Line heights are kept ≥ 1.5 where Sinhala/Tamil text wraps.

### ADR-009 · Data model details (2026-10-27)
Categories and statuses are stable machine keys (`blocked_drain`, …; `pending | in_progress |
resolved`), translated only in the UI. Unknown values from the DB still render (category → "Other",
status → raw text). `created_at` is `timestamptz`. Description is required, 10–1000 characters
(counted in code points on both sides, matching Postgres `char_length`). Coordinates are rounded to
6 decimals (~0.1 m) when the location is picked, so the form shows exactly what is stored.

### ADR-010 · Security model: RLS + column-level grants (2026-10-27)
The browser talks to Supabase directly with the public key. The migration revokes Supabase's
default `ALL` grants, then grants `anon`/`authenticated` `SELECT` and `INSERT` on **only**
latitude, longitude, category and description. `id`, `created_at` and `status` are always
server-set; nobody without the service role can update, delete or truncate. RLS policies allow
public reads and inserts with `status = 'pending'`. Verified against a real Postgres engine
(PGlite) — see PROGRESS.md.

### ADR-011 · Turnstile is a placeholder; real spam protection needs a server (2026-10-27)
The form reserves a 65 px slot (`#turnstile-container`, `data-sitekey` from
`VITE_TURNSTILE_SITE_KEY`). A client-only Turnstile check protects nothing, because anyone can call
the REST API directly. Production plan: render the widget, send its token to a Supabase Edge
Function that verifies it with Cloudflare's `siteverify` API and inserts with the service role,
then revoke the `anon` insert grant/policy. Add rate limiting there too.

### ADR-012 · Supabase is optional at runtime (2026-10-27)
`lib/supabase.ts` returns `null` (and logs a warning) when env vars are missing or the URL is
malformed, instead of crashing on import. The UI shows a notice and disables submitting. Auth
sessions are disabled (`persistSession: false`) — reporting is anonymous and nothing is stored
locally. The `Database` type is hand-written; replace it with `supabase gen types` output once a
project is linked.

### ADR-013 · Fetch every report, paged (2026-10-27)
Supabase caps responses at 1000 rows by default, so `fetchAllReports()` pages with `.range()`
ordered by `(created_at, id)` ascending (new rows append rather than shift pages), asks for
`count: 'exact'` on the first page, and advances by the number of rows actually returned in case
the server cap is lower. Results merge with locally added reports by id, so a report submitted
during the initial load is never lost. Marker clustering will be needed in the thousands.

### ADR-014 · Markers are SVG divIcons with Lucide glyph paths (2026-10-27)
Leaflet icons take HTML strings, not React elements. Rather than bundling `react-dom/server` to
render lucide-react icons, the four glyphs' SVG paths are copied from Lucide (ISC) into
`markerIcons.ts`; the legend and popups use the matching lucide-react components. Each category
has its own colour **and** glyph, so colour is never the only cue (WCAG 1.4.1). The temporary
"new report" pin is emerald with a pulse that respects `prefers-reduced-motion`.

### ADR-015 · Report form = native `<dialog>` (2026-10-27)
`showModal()` gives focus trapping, Escape handling, an inert background and top-layer stacking
above Leaflet. It is a bottom sheet on phones and centred on ≥ 640 px. It is mounted only while a
location is selected (keyed per location, so the form always starts fresh) and opened/closed in
a layout effect so the browser restores focus to the map. Tapping the backdrop closes it only
while the form is untouched (so typed text is never lost to a mis-tap). Validation is custom
(`noValidate`), because native messages would be in the browser's language. Errors while the
dialog is open are shown inline, since toasts would render underneath the top layer.

### ADR-016 · Lightweight custom toasts (2026-10-27)
No library. Messages are dictionary selectors, so they re-render on language change. A
`key` dedupes repeats (e.g. several out-of-area taps). Actions and the toast list live in
separate contexts, so components that only *show* toasts don't re-render. The stack is rendered
inside the map area under an always-mounted `aria-live="polite"` region.

### ADR-017 · Map interaction and accessibility details (2026-10-27)
- A click waits 300 ms before opening the form, so double-click/double-tap zoom still works.
- The click that dismisses an open popup does not also start a report.
- Keyboard: Enter on the focused map reports at the centre (a crosshair appears while it has
  keyboard focus); clicks with `detail === 0` (assistive tech) also use the centre.
- Markers expose localized `aria-label`/`title` ("category · status"). Opening a popup from the
  keyboard moves focus into it, and Escape returns focus to the marker.
- The map container gets `role="region"` and a localized label with instructions.
- On phones the map pans so the new pin stays visible above the bottom sheet.

### ADR-018 · Served from `/nattandiya/` by default (2026-10-27)
`vite.config.ts` sets `base` from `BASE_PATH` (read from the shell or `.env*`, normalised to
`/x/`), defaulting to `/nattandiya/` for sub-path hosting. Dev and preview also use it, so local
URLs match production. Use `BASE_PATH=/` to serve from a domain root.

### ADR-019 · Instruction banner dismissal is per session (2026-10-27)
Stored in `sessionStorage`: it is one line and helps first-time visitors, so it reappears on
the next visit instead of disappearing forever.

### ADR-020 · No test framework committed yet (2026-10-27)
Dictionary completeness is enforced by the type system. Behaviour was verified with throwaway
harnesses (SQL checks on PGlite; Playwright against a mock PostgREST — see PROGRESS.md). Adding
Vitest and Playwright to the repo is the top item in "Next".

### ADR-021 · Vercel routing; build output mirrors the URL path (2026-10-27)
The build writes to `dist/nattandiya/` (`outDir = dist + base`), so with `dist/` as the web root
every file already lives at its public URL. That means no prefix-stripping rewrites, and any static
host behaves the same way. `vercel.json` then needs only:
- a **temporary** (307) redirect `/` → `/nattandiya/`, so the app could later move to the root
  without browsers having cached the redirect;
- a permanent `/nattandiya` → `/nattandiya/`;
- an SPA fallback `/nattandiya/((?!assets/).*)` → `/nattandiya/index.html`.

Vercel checks the filesystem before applying rewrites, so real files are served directly.
`assets/` is excluded from the fallback so a stale hashed chunk returns 404 instead of HTML, which
would otherwise fail with a MIME-type error. Hashed assets get
`Cache-Control: public, max-age=31536000, immutable`. Verified by compiling the file with
`@vercel/routing-utils` and simulating requests against `dist/`. `vercel.json` hard-codes
`/nattandiya/`, so change it together with `BASE_PATH`.
