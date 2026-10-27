import { useCallback, useRef, useState } from 'react'
import { ConfigNotice } from './components/ConfigNotice'
import { Header } from './components/Header'
import { InstructionBanner } from './components/InstructionBanner'
import { Legend } from './components/Legend'
import { DrainageMap } from './components/map/DrainageMap'
import { ReportModal } from './components/ReportModal'
import { ReportsStatus } from './components/ReportsStatus'
import { Toaster } from './components/toast/Toaster'
import { useToast } from './components/toast/useToast'
import { useReports } from './hooks/useReports'
import type { GeoPoint } from './lib/geo'
import { isSupabaseConfigured } from './lib/supabase'
import type { DrainageReport } from './types/report'

interface DraftReport extends GeoPoint {
  /** Remounts the form for every newly selected location. */
  key: number
}

export default function App() {
  const { reports, loadState, retry, addReport } = useReports()
  const { showToast } = useToast()
  const [draft, setDraft] = useState<DraftReport | null>(null)
  const draftCount = useRef(0)

  const handleLocationSelect = useCallback((point: GeoPoint) => {
    draftCount.current += 1
    setDraft({ ...point, key: draftCount.current })
  }, [])

  const handleOutsideArea = useCallback(() => {
    showToast({ key: 'outside-area', variant: 'info', message: (t) => t.map.outsideArea })
  }, [showToast])

  const closeDraft = useCallback(() => setDraft(null), [])

  const handleSubmitted = useCallback(
    (report: DrainageReport) => {
      addReport(report)
      setDraft(null)
      showToast({ variant: 'success', message: (t) => t.toast.submitted })
    },
    [addReport, showToast],
  )

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <Header />
      {!isSupabaseConfigured && <ConfigNotice />}
      <InstructionBanner />

      <main className="relative min-h-0 flex-1">
        <DrainageMap
          reports={reports}
          draftLocation={draft}
          onLocationSelect={handleLocationSelect}
          onOutsideArea={handleOutsideArea}
        />
        <div className="pointer-events-none absolute inset-x-0 top-3 z-10 flex flex-col items-center gap-2 px-3">
          <ReportsStatus state={loadState} onRetry={retry} />
          <Toaster />
        </div>
        <Legend reports={reports} />
      </main>

      {draft && (
        <ReportModal
          key={draft.key}
          location={draft}
          onClose={closeDraft}
          onSubmitted={handleSubmitted}
        />
      )}
    </div>
  )
}
