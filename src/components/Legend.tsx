import { ChevronDown, Layers } from 'lucide-react'
import { useId, useMemo, useState } from 'react'
import { CATEGORY_STYLES } from '../config/categories'
import { useI18n } from '../i18n/useI18n'
import { REPORT_CATEGORIES, type DrainageReport, type ReportCategory } from '../types/report'

function countByCategory(reports: DrainageReport[]): Record<ReportCategory, number> {
  const counts = Object.fromEntries(REPORT_CATEGORIES.map((category) => [category, 0])) as Record<
    ReportCategory,
    number
  >
  for (const report of reports) counts[report.category] += 1
  return counts
}

export function Legend({ reports }: { reports: DrainageReport[] }) {
  const { t } = useI18n()
  const listId = useId()
  // Expanded on tablets/desktops, collapsed on phones to keep the map visible.
  const [expanded, setExpanded] = useState(() => window.matchMedia('(min-width: 640px)').matches)
  const counts = useMemo(() => countByCategory(reports), [reports])

  return (
    // bottom-7 clears Leaflet's attribution line, which spans most of the bottom edge on phones.
    <section
      aria-label={t.legend.title}
      className="absolute bottom-7 left-3 z-10 w-56 max-w-[calc(100%-5rem)] rounded-xl bg-white/95 text-slate-900 shadow-lg ring-1 ring-black/5 backdrop-blur"
    >
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={listId}
        onClick={() => setExpanded((value) => !value)}
        className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
      >
        <Layers className="size-4 shrink-0 text-sky-700" aria-hidden="true" />
        <span className="flex-1 leading-snug">{t.legend.title}</span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium tabular-nums text-slate-600">
          <span className="sr-only">{t.legend.total}: </span>
          {reports.length}
        </span>
        <ChevronDown
          className={`size-4 shrink-0 text-slate-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      <ul id={listId} hidden={!expanded} className="space-y-2 px-3 pb-3">
        {REPORT_CATEGORIES.map((category) => {
          const { color, icon: Icon } = CATEGORY_STYLES[category]
          return (
            <li key={category} className="flex items-center gap-2.5 text-sm">
              <span
                className="flex size-6 shrink-0 items-center justify-center rounded-full text-white shadow-sm"
                style={{ backgroundColor: color }}
                aria-hidden="true"
              >
                <Icon className="size-3.5" />
              </span>
              <span className="flex-1 leading-snug">{t.categories[category]}</span>
              <span className="text-xs tabular-nums text-slate-500">{counts[category]}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
