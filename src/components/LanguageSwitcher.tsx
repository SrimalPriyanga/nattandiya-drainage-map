import { ChevronDown, Languages } from 'lucide-react'
import { useId, type ChangeEvent } from 'react'
import { isLanguage, LANGUAGES } from '../i18n/languages'
import { useI18n } from '../i18n/useI18n'

/** Deliberately trilingual: someone looking for the switcher may not read the current language. */
const SWITCHER_TITLE = 'භාෂාව / Language / மொழி'

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n()
  const id = useId()

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const next = event.target.value
    if (isLanguage(next)) setLanguage(next)
  }

  return (
    <div className="relative shrink-0">
      <label htmlFor={id} className="sr-only">
        <span lang="si">භාෂාව</span> / <span lang="en">Language</span> /{' '}
        <span lang="ta">மொழி</span>
      </label>
      <Languages
        className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-sky-100"
        aria-hidden="true"
      />
      {/* A native <select> gives keyboard, screen-reader and mobile-picker support for free. */}
      <select
        id={id}
        value={language}
        onChange={handleChange}
        title={SWITCHER_TITLE}
        className="h-10 cursor-pointer appearance-none rounded-lg border border-white/30 bg-white/10 pl-8 pr-8 text-sm font-medium text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        {LANGUAGES.map((option) => (
          <option key={option.code} value={option.code} lang={option.code} className="text-slate-900">
            {option.nativeName}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-sky-100"
        aria-hidden="true"
      />
    </div>
  )
}
