import { isReportStatus } from '../types/report'
import type { Dictionary } from './locales'

/** Translated status, or the raw database value if it is not one the app knows. */
export function getStatusLabel(t: Dictionary, status: string): string {
  return isReportStatus(status) ? t.statuses[status] : status
}
