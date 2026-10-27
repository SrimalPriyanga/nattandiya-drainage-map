import { createContext } from 'react'
import type { Language } from './languages'
import type { Dictionary } from './locales'

export interface I18nContextValue {
  language: Language
  setLanguage: (language: Language) => void
  /** Dictionary for the active language — read strings as `t.section.key`. */
  t: Dictionary
  /** Intl locales for the active language (dates, numbers). */
  locales: readonly string[]
}

export const I18nContext = createContext<I18nContextValue | null>(null)
