import { Droplets } from 'lucide-react'
import { useI18n } from '../i18n/useI18n'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Header() {
  const { t } = useI18n()

  return (
    <header className="relative z-20 bg-sky-800 text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 pb-2.5 pt-[max(0.625rem,env(safe-area-inset-top))] sm:px-5">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15"
          aria-hidden="true"
        >
          <Droplets className="size-6" />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-base font-bold leading-snug sm:text-xl">{t.header.title}</h1>
          {/* Clamped on phones to keep the map large; screen readers still get the full text. */}
          <p className="line-clamp-2 text-xs leading-snug text-sky-100 sm:line-clamp-none sm:text-sm">
            {t.header.subtitle}
          </p>
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  )
}
