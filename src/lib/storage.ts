export const STORAGE_KEYS = {
  language: 'ndm.language',
  instructionsDismissed: 'ndm.instructions-dismissed',
} as const

type StorageArea = 'local' | 'session'

// Web Storage can throw (Safari private mode, disabled cookies, quota). Preferences are a
// nicety, so failures are swallowed and the app keeps working without persistence.

export function readStored(key: string, area: StorageArea = 'local'): string | null {
  try {
    return (area === 'local' ? window.localStorage : window.sessionStorage).getItem(key)
  } catch {
    return null
  }
}

export function writeStored(key: string, value: string, area: StorageArea = 'local'): void {
  try {
    ;(area === 'local' ? window.localStorage : window.sessionStorage).setItem(key, value)
  } catch {
    // Not persisted — acceptable.
  }
}
