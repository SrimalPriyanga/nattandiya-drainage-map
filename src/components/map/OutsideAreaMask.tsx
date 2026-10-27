import type { LatLngTuple } from 'leaflet'
import { Polygon, Rectangle } from 'react-leaflet'
import { MAP_BOUNDS } from '../../config/map'

const [[SOUTH, WEST], [NORTH, EAST]] = MAP_BOUNDS
/** The outer ring only has to cover whatever is visible around the area at MIN_ZOOM. */
const PADDING_DEGREES = 5

const OUTER_RING: LatLngTuple[] = [
  [SOUTH - PADDING_DEGREES, WEST - PADDING_DEGREES],
  [NORTH + PADDING_DEGREES, WEST - PADDING_DEGREES],
  [NORTH + PADDING_DEGREES, EAST + PADDING_DEGREES],
  [SOUTH - PADDING_DEGREES, EAST + PADDING_DEGREES],
]
const SERVICE_AREA_RING: LatLngTuple[] = [
  [SOUTH, WEST],
  [SOUTH, EAST],
  [NORTH, EAST],
  [NORTH, WEST],
]
const MASK_RINGS = [OUTER_RING, SERVICE_AREA_RING] // second ring = hole

/**
 * Dims everything outside Nattandiya and outlines the service area. Non-interactive, so taps
 * fall through to the map, which then explains that the spot is outside the area.
 */
export function OutsideAreaMask() {
  return (
    <>
      <Polygon
        positions={MASK_RINGS}
        interactive={false}
        pathOptions={{ stroke: false, fillColor: '#0f172a', fillOpacity: 0.3 }}
      />
      <Rectangle
        bounds={MAP_BOUNDS}
        interactive={false}
        pathOptions={{ color: '#0369a1', weight: 2, opacity: 0.8, dashArray: '6 6', fill: false }}
      />
    </>
  )
}
