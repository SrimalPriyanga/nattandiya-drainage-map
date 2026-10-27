import { CircleAlert, LoaderCircle, RefreshCw } from 'lucide-react'
import type { ReportsLoadState } from '../hooks/useReports'
import { useI18n } from '../i18n/useI18n'

interface ReportsStatusProps {
  state: ReportsLoadState
  onRetry: () => void
}

/** Floating pill for the initial load: spinner while loading, retry button on failure. */
export function ReportsStatus({ state, onRetry }: ReportsStatusProps) {
  const { t } = useI18n()

  if (state === 'loading') {
    return (
      // <output> carries an implicit role="status" (polite live region).
      <output className="pointer-events-auto flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-slate-700 shadow-lg ring-1 ring-black/5">
        <LoaderCircle className="size-4 animate-spin text-sky-700" aria-hidden="true" />
        {t.reports.loading}
      </output>
    )
  }

  if (state === 'error') {
    return (
      <div
        role="alert"
        className="pointer-events-auto flex items-center gap-3 rounded-full bg-white/95 py-1.5 pl-4 pr-1.5 text-sm text-slate-800 shadow-lg ring-1 ring-red-200"
      >
        <CircleAlert className="size-4 shrink-0 text-red-600" aria-hidden="true" />
        <span>{t.reports.loadError}</span>
        <button
          type="button"
          onClick={onRetry}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
        >
          <RefreshCw className="size-3.5" aria-hidden="true" />
          {t.reports.retry}
        </button>
      </div>
    )
  }

  return null
}
