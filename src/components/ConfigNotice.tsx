import { TriangleAlert } from 'lucide-react'
import { useI18n } from '../i18n/useI18n'

/** Shown when Supabase environment variables are missing (see .env.example). */
export function ConfigNotice() {
  const { t } = useI18n()

  return (
    <div className="relative z-10 border-b border-amber-200 bg-amber-50 text-amber-950">
      <div className="mx-auto flex max-w-7xl items-start gap-2.5 px-3 py-2 text-sm sm:px-5">
        <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden="true" />
        <p className="leading-relaxed">{t.config.notConfigured}</p>
      </div>
    </div>
  )
}
