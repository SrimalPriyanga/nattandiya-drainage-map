import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { readStored, STORAGE_KEYS, writeStored } from '../lib/storage'
import { I18nContext, type I18nContextValue } from './context'
import { DEFAULT_LANGUAGE, getLanguageOption, isLanguage, type Language } from './languages'
import { dictionaries } from './locales'

function getInitialLanguage(): Language {
  const stored = readStored(STORAGE_KEYS.language)
  return isLanguage(stored) ? stored : DEFAULT_LANGUAGE
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage)

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next)
    writeStored(STORAGE_KEYS.language, next)
  }, [])

  const t = dictionaries[language]

  // `lang` drives screen-reader pronunciation and font selection; the title shows in tabs.
  useEffect(() => {
    document.documentElement.lang = language
    document.title = t.meta.title
  }, [language, t])

  const value = useMemo<I18nContextValue>(
    () => ({ language, setLanguage, t, locales: getLanguageOption(language).locales }),
    [language, setLanguage, t],
  )

  return <I18nContext value={value}>{children}</I18nContext>
}
