# නාත්තන්ඩිය ජලාපවහන සිතියම · Nattandiya Drainage Map · நாத்தாண்டி வடிகால் வரைபடம்

A community map where residents of Nattandiya, Sri Lanka can **anonymously** report blocked
drains, canal issues and illegal constructions that cause flooding — and see what others have
reported. Mobile-first, in Sinhala (default), English and Tamil.

Built with Vite + React + TypeScript, Tailwind CSS, Leaflet/react-leaflet (OpenStreetMap) and Supabase.

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase URL and anon/publishable key
npm run dev                  # → http://localhost:5173/nattandiya/
```

Without Supabase credentials the app still runs, in read-only mode: map, legend and languages
work, and a notice explains that reporting is unavailable.

## Setting up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Create the table and its security rules: open **SQL Editor**, paste
   `supabase/migrations/20261027000000_create_drainage_reports.sql` and run it
   (or, with the Supabase CLI: `supabase link` then `supabase db push`).
3. Copy the **Project URL** and the **anon** / **publishable** key from the project's API settings
   into `.env.local` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Never use the
   service-role/secret key in this app.
4. Optional, local development only: `supabase/seed.sql` inserts a few sample reports.

Anyone can read reports and submit new ones. Visitors can never edit or delete reports or set
their status; moderators change `status` (`pending` → `in_progress` → `resolved`) in the Supabase dashboard.

## Scripts

| Command             | Description                                   |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Development server with hot reload            |
| `npm run build`     | Type-check and build for production (`dist/`) |
| `npm run preview`   | Serve the production build locally            |
| `npm run typecheck` | TypeScript only                               |
| `npm run lint`      | Oxlint                                        |

## Deployment

`npm run build` produces a static site in `dist/` that expects to be served from **`/nattandiya/`**
(e.g. `https://example.org/nattandiya/`). To serve from a domain root instead, build with
`BASE_PATH=/ npm run build`. Set the `VITE_*` variables in your host's build environment.
For heavy traffic, switch to a tile provider instead of the public OpenStreetMap tile servers.

## Project docs

- [`CLAUDE.md`](CLAUDE.md) — architecture, conventions, gotchas
- [`DECISIONS.md`](DECISIONS.md) — why things are built the way they are
- [`PROGRESS.md`](PROGRESS.md) — status, verification, next steps

## Credits

Map data © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors ·
Icons: [Lucide](https://lucide.dev) (ISC) · Maps: [Leaflet](https://leafletjs.com)
