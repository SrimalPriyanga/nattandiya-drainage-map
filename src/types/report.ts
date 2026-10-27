/**
 * Stable machine keys stored in `drainage_reports.category`. UI labels live in the i18n
 * dictionaries; the database `check` constraint must list exactly these values.
 */
export const REPORT_CATEGORIES = [
  'blocked_drain',
  'illegal_construction',
  'canal_issue',
  'other',
] as const
export type ReportCategory = (typeof REPORT_CATEGORIES)[number]

/** Values allowed in `drainage_reports.status` (new reports always start as `pending`). */
export const REPORT_STATUSES = ['pending', 'in_progress', 'resolved'] as const
export type ReportStatus = (typeof REPORT_STATUSES)[number]

/** Mirrored by the `drainage_reports_description_length` check constraint. */
export const DESCRIPTION_MIN_LENGTH = 10
export const DESCRIPTION_MAX_LENGTH = 1000

/** A report as stored in `public.drainage_reports`. */
export interface DrainageReport {
  id: string
  created_at: string
  latitude: number
  longitude: number
  category: ReportCategory
  description: string
  /** Normally a {@link ReportStatus}; kept as a string so unexpected values still render. */
  status: string
}

/** The only fields a citizen supplies — id, created_at and status are set by the database. */
export type NewDrainageReport = Pick<
  DrainageReport,
  'latitude' | 'longitude' | 'category' | 'description'
>

export function isReportCategory(value: unknown): value is ReportCategory {
  return typeof value === 'string' && (REPORT_CATEGORIES as readonly string[]).includes(value)
}

export function isReportStatus(value: unknown): value is ReportStatus {
  return typeof value === 'string' && (REPORT_STATUSES as readonly string[]).includes(value)
}
