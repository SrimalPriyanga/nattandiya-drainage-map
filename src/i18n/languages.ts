export interface LanguageOption {
  code: string
  /** The language's own name — shown in the switcher whatever the current UI language is. */
  nativeName: string
  /** BCP 47 locales for Intl formatting, most specific first (Intl picks the first it supports). */
  locales: readonly string[]
}

export const LANGUAGES = [
  { code: 'si', nativeName: 'සිංහල', locales: ['si-LK'] },
  // Most browsers lack en-LK data and would fall back to US formats; en-GB matches local usage.
  { code: 'en', nativeName: 'English', locales: ['en-LK', 'en-GB'] },
  { code: 'ta', nativeName: 'தமிழ்', locales: ['ta-LK'] },
] as const satisfies readonly LanguageOption[]

export type Language = (typeof LANGUAGES)[number]['code']

/** Sinhala is the primary language of Nattandiya and the app's default. */
export const DEFAULT_LANGUAGE: Language = 'si'

export function isLanguage(value: unknown): value is Language {
  return LANGUAGES.some((language) => language.code === value)
}

export function getLanguageOption(code: Language): LanguageOption {
  return LANGUAGES.find((language) => language.code === code) ?? LANGUAGES[0]
}
