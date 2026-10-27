import {
  Construction,
  Droplets,
  TriangleAlert,
  WavesHorizontal,
  type LucideIcon,
} from 'lucide-react'
import type { ReportCategory } from '../types/report'

export interface CategoryStyle {
  /** Marker / swatch fill. Each keeps ≥ 3:1 contrast with the white glyph (WCAG 1.4.11). */
  color: string
  /** Same glyph as the map marker, so colour is never the only cue (WCAG 1.4.1). */
  icon: LucideIcon
}

export const CATEGORY_STYLES: Record<ReportCategory, CategoryStyle> = {
  blocked_drain: { color: '#d97706', icon: Droplets }, // amber-600
  illegal_construction: { color: '#dc2626', icon: Construction }, // red-600
  canal_issue: { color: '#2563eb', icon: WavesHorizontal }, // blue-600
  other: { color: '#475569', icon: TriangleAlert }, // slate-600
}

/** Colour of the temporary "new report" pin (distinct from every category). */
export const DRAFT_MARKER_COLOR = '#059669' // emerald-600
