import { useCallback, useEffect, useState } from 'react'
import { fetchAllReports } from '../lib/reports'
import { isSupabaseConfigured } from '../lib/supabase'
import type { DrainageReport } from '../types/report'

/** `disabled` = Supabase is not configured, so nothing is fetched. */
export type ReportsLoadState = 'disabled' | 'loading' | 'ready' | 'error'

/** Upsert by id — a report submitted while the initial fetch is in flight is never lost. */
function mergeReports(current: DrainageReport[], incoming: DrainageReport[]): DrainageReport[] {
  const byId = new Map(current.map((report) => [report.id, report]))
  for (const report of incoming) byId.set(report.id, report)
  return [...byId.values()]
}

export function useReports() {
  const [reports, setReports] = useState<DrainageReport[]>([])
  const [loadState, setLoadState] = useState<ReportsLoadState>(
    isSupabaseConfigured ? 'loading' : 'disabled',
  )
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!isSupabaseConfigured) return
    const controller = new AbortController()

    fetchAllReports(controller.signal)
      .then((loaded) => {
        if (controller.signal.aborted) return
        setReports((current) => mergeReports(current, loaded))
        setLoadState('ready')
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        console.error('[reports] Failed to load reports', error)
        setLoadState('error')
      })

    return () => controller.abort()
  }, [attempt])

  const retry = useCallback(() => {
    setLoadState('loading')
    setAttempt((value) => value + 1)
  }, [])

  const addReport = useCallback((report: DrainageReport) => {
    setReports((current) => mergeReports(current, [report]))
  }, [])

  return { reports, loadState, retry, addReport }
}
