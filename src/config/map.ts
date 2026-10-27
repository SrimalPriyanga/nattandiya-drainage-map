import type { LatLngTuple } from 'leaflet'

/** Nattandiya town centre. */
export const MAP_CENTER: LatLngTuple = [7.4167, 79.8667]
export const DEFAULT_ZOOM = 14
/** Zooming out further would mostly show the masked area outside Nattandiya. */
export const MIN_ZOOM = 13
/** Highest zoom level the standard OpenStreetMap tile server provides. */
export const MAX_ZOOM = 19

/**
 * Service area as [south-west, north-east]. The map cannot be panned outside it, reports
 * outside it are rejected, and the same numbers are enforced by check constraints in
 * supabase/migrations — change them together.
 */
export const MAP_BOUNDS: [LatLngTuple, LatLngTuple] = [
  [7.38, 79.82],
  [7.46, 79.92],
]

/** Standard OSM tiles. Heavy production traffic needs a tile provider — see DECISIONS.md. */
export const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
export const LEAFLET_ATTRIBUTION_PREFIX = '<a href="https://leafletjs.com">Leaflet</a>'
