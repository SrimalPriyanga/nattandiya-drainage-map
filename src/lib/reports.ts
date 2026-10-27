import type { Database } from '../types/database'
import { isReportCategory, type DrainageReport, type NewDrainageReport } from '../types/report'
import { roundCoordinate } from './geo'
import { supabase } from './supabase'

type ReportRow = Database['public']['Tables']['drainage_reports']['Row']

const TABLE = 'drainage_reports'
const COLUMNS = 'id, created_at, latitude, longitude, category, description, status'
/** Supabase caps responses at 1000 rows by default, so larger result sets are paged. */
const PAGE_SIZE = 1000

export class SupabaseNotConfiguredError extends Error {
  constructor() {
    super('Supabase is not configured (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).')
    this.name = 'SupabaseNotConfiguredError'
  }
}

function getClient() {
  if (!supabase) throw new SupabaseNotConfiguredError()
  return supabase
}

/** Validates a row from the API; returns `null` for rows that cannot be placed on the map. */
export function toReport(row: ReportRow): DrainageReport | null {
  const latitude = Number(row.latitude)
  const longitude = Number(row.longitude)
  if (!row.id || !Number.isFinite(latitude) || !Number.isFinite(longitude)) return null

  return {
    id: row.id,
    created_at: row.created_at,
    latitude,
    longitude,
    // Unknown categories (e.g. added in the DB before the app) still render, as "Other".
    category: isReportCategory(row.category) ? row.category : 'other',
    description: row.description ?? '',
    status: row.status ?? 'pending',
  }
}

/** Fetches every report, paging past the API row cap. */
export async function fetchAllReports(signal?: AbortSignal): Promise<DrainageReport[]> {
  const client = getClient()
  const reports: DrainageReport[] = []
  let total = Number.POSITIVE_INFINITY // known after the first page
  let from = 0

  while (from < total) {
    // Oldest first, so reports created while paging append to the end instead of shifting pages.
    const query = client
      .from(TABLE)
      .select(COLUMNS, { count: from === 0 ? 'exact' : undefined })
      .order('created_at', { ascending: true })
      .order('id', { ascending: true })
      .range(from, from + PAGE_SIZE - 1)

    const { data, error, count } = await (signal ? query.abortSignal(signal) : query)
    if (error) throw error

    if (from === 0) total = count ?? 0
    for (const row of data) {
      const report = toReport(row)
      if (report) reports.push(report)
    }

    if (data.length === 0) break
    // Advance by what the server actually returned — its row cap may be below PAGE_SIZE.
    from += data.length
  }

  return reports
}

export async function createReport(input: NewDrainageReport): Promise<DrainageReport> {
  const { data, error } = await getClient()
    .from(TABLE)
    .insert({
      latitude: roundCoordinate(input.latitude),
      longitude: roundCoordinate(input.longitude),
      category: input.category,
      description: input.description.trim(),
    })
    .select(COLUMNS)
    .single()

  if (error) throw error
  const report = toReport(data)
  if (!report) throw new Error('The saved report came back in an unexpected shape.')
  return report
}
