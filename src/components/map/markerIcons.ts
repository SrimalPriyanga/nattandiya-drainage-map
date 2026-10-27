import { divIcon, type DivIcon, type PointTuple } from 'leaflet'
import { CATEGORY_STYLES, DRAFT_MARKER_COLOR } from '../../config/categories'
import { REPORT_CATEGORIES, type ReportCategory } from '../../types/report'

/*
 * Glyph paths copied from Lucide v1 (https://lucide.dev, ISC licence) because Leaflet divIcons
 * take an HTML string, not React elements. They are the same icons the legend and popups
 * render through lucide-react (config/categories.ts) — keep the two in sync.
 */
const CATEGORY_GLYPHS: Record<ReportCategory, string> = {
  // droplets
  blocked_drain:
    '<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>',
  // construction
  illegal_construction:
    '<rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M7 14v7"/><path d="M17 3v3"/><path d="M7 3v3"/><path d="M10 14 2.3 6.3"/><path d="m14 6 7.7 7.7"/><path d="m8 6 8 8"/>',
  // waves-horizontal
  canal_issue:
    '<path d="M2 12q2.5 2 5 0t5 0 5 0 5 0"/><path d="M2 19q2.5 2 5 0t5 0 5 0 5 0"/><path d="M2 5q2.5 2 5 0t5 0 5 0 5 0"/>',
  // triangle-alert
  other:
    '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
}

// plus
const DRAFT_GLYPH = '<path d="M5 12h14"/><path d="M12 5v14"/>'

const PIN_PATH =
  'M16 1.5C8 1.5 1.5 7.9 1.5 15.8c0 10.6 12.4 23 13.4 24a1.5 1.5 0 0 0 2.2 0c1-1 13.4-13.4 13.4-24C30.5 7.9 24 1.5 16 1.5Z'

function pinSvg(fill: string, glyph: string): string {
  return (
    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42" aria-hidden="true" focusable="false">' +
    `<path d="${PIN_PATH}" fill="${fill}" stroke="#fff" stroke-width="2"/>` +
    // The 24-unit Lucide glyph, scaled to 16 px and centred in the pin head.
    `<g transform="translate(8 7.8) scale(0.6667)" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${glyph}</g>` +
    '</svg>'
  )
}

const ICON_SIZE: PointTuple = [32, 42]
const ICON_ANCHOR: PointTuple = [16, 41] // the pin's tip
const POPUP_ANCHOR: PointTuple = [0, -38]

export const CATEGORY_ICONS = Object.fromEntries(
  REPORT_CATEGORIES.map((category) => [
    category,
    divIcon({
      className: 'ndm-marker',
      html: pinSvg(CATEGORY_STYLES[category].color, CATEGORY_GLYPHS[category]),
      iconSize: ICON_SIZE,
      iconAnchor: ICON_ANCHOR,
      popupAnchor: POPUP_ANCHOR,
    }),
  ]),
) as Record<ReportCategory, DivIcon>

/** Temporary pin for the location being reported, with a pulsing ring at its tip. */
export const DRAFT_ICON = divIcon({
  className: 'ndm-marker ndm-marker--draft',
  html: `<span class="ndm-marker__pulse"></span>${pinSvg(DRAFT_MARKER_COLOR, DRAFT_GLYPH)}`,
  iconSize: ICON_SIZE,
  iconAnchor: ICON_ANCHOR,
})
