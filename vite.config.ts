import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

/** The app is served from this sub-path unless BASE_PATH says otherwise (e.g. BASE_PATH=/). */
const DEFAULT_BASE_PATH = '/nattandiya/'

/** "nattandiya", "/nattandiya" and "/nattandiya/" all become "/nattandiya/"; "" or "/" become "/". */
function normalizeBasePath(value: string): string {
  const trimmed = value.trim().replace(/^\/+|\/+$/g, '')
  return trimmed ? `/${trimmed}/` : '/'
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // '' prefix: read BASE_PATH from the shell or any .env file (it is never exposed to the client).
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: normalizeBasePath(env.BASE_PATH ?? DEFAULT_BASE_PATH),
    plugins: [react()],
  }
})
