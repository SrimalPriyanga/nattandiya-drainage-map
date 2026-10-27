import { useEffect, useId, useRef } from 'react'
import { CATEGORY_STYLES } from '../../config/categories'
import { getStatusLabel } from '../../i18n/labels'
import { useI18n } from '../../i18n/useI18n'
import { formatCoordinate, formatDateTime } from '../../lib/format'
import type { DrainageReport } from '../../types/report'

const STATUS_BADGE_CLASSES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-900',
  in_progress: 'bg-sky-100 text-sky-900',
  resolved: 'bg-emerald-100 text-emerald-900',
}

/** Popup body for a report marker. ReportMarker mounts it only while the popup is open. */
export function ReportPopup({ report }: { report: DrainageReport }) {
  const { t, locales } = useI18n()
  const contentRef = useRef<HTMLElement>(null)
  const titleId = useId()
  const detailsId = useId()
  const { color, icon: Icon } = CATEGORY_STYLES[report.category]

  // Keyboard users: when the popup was opened from a focused marker, move focus into it so
  // screen readers read it, and hand focus back to the marker when it closes (Escape inside
  // the popup is handled in MapInteractions).
  useEffect(() => {
    const content = contentRef.current
    const active = document.activeElement
    const marker =
      active instanceof HTMLElement && active.classList.contains('leaflet-marker-icon')
        ? active
        : null
    if (marker) content?.focus()
    return () => {
      // If focus was inside the popup, it has just been removed with it. Depending on timing,
      // browsers report that as <body>, null, or the detached element itself.
      const current = document.activeElement
      const focusLost =
        !current || current === document.body || !current.isConnected || !!content?.contains(current)
      if (marker?.isConnected && focusLost) marker.focus()
    }
  }, [])

  return (
    <article
      ref={contentRef}
      tabIndex={-1}
      aria-labelledby={titleId}
      aria-describedby={detailsId}
      className="space-y-2.5 outline-none"
    >
      <div className="flex items-start gap-2.5 pr-4">
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        >
          <Icon className="size-4" />
        </span>
        <div className="min-w-0 space-y-1">
          <h2 id={titleId} className="text-[0.9375rem] font-semibold leading-snug text-slate-900">
            {t.categories[report.category]}
          </h2>
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
              STATUS_BADGE_CLASSES[report.status] ?? 'bg-slate-100 text-slate-700'
            }`}
          >
            <span className="sr-only">{t.popup.status}: </span>
            {getStatusLabel(t, report.status)}
          </span>
        </div>
      </div>

      <div id={detailsId} className="space-y-2.5">
        <p className="whitespace-pre-line break-words text-sm leading-relaxed text-slate-700">
          {report.description.trim() || t.popup.noDescription}
        </p>
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-slate-100 pt-2 text-xs leading-relaxed">
          <dt className="text-slate-500">{t.popup.reportedOn}</dt>
          <dd className="text-slate-700">
            <time dateTime={report.created_at}>{formatDateTime(report.created_at, locales)}</time>
          </dd>
          <dt className="text-slate-500">{t.popup.coordinates}</dt>
          <dd className="font-mono tabular-nums text-slate-700">
            {formatCoordinate(report.latitude)}, {formatCoordinate(report.longitude)}
          </dd>
        </dl>
      </div>
    </article>
  )
}
