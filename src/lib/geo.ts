import { MAP_BOUNDS } from '../config/map'

export interface GeoPoint {
  lat: number
  lng: number
}

export function isInServiceArea({ lat, lng }: GeoPoint): boolean {
  const [[south, west], [north, east]] = MAP_BOUNDS
  return lat >= south && lat <= north && lng >= west && lng <= east
}

/**
 * 6 decimal places ≈ 0.1 m — finer than any phone GPS. The bounds sit on this grid, so
 * rounding never moves an in-area point outside the area.
 */
export function roundCoordinate(value: number): number {
  return Math.round(value * 1e6) / 1e6
}
