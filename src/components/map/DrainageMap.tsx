import { useMemo } from 'react'
import { AttributionControl, MapContainer, Marker, TileLayer, ZoomControl } from 'react-leaflet'
import {
  DEFAULT_ZOOM,
  LEAFLET_ATTRIBUTION_PREFIX,
  MAP_BOUNDS,
  MAP_CENTER,
  MAX_ZOOM,
  MIN_ZOOM,
  TILE_ATTRIBUTION,
  TILE_URL,
} from '../../config/map'
import { useI18n } from '../../i18n/useI18n'
import type { GeoPoint } from '../../lib/geo'
import { prefersReducedMotion } from '../../lib/motion'
import type { DrainageReport } from '../../types/report'
import { MapInteractions } from './MapInteractions'
import { DRAFT_ICON } from './markerIcons'
import { OutsideAreaMask } from './OutsideAreaMask'
import { ReportMarker } from './ReportMarker'

interface DrainageMapProps {
  reports: DrainageReport[]
  /** Location currently being reported — shown as a temporary pin. */
  draftLocation: GeoPoint | null
  onLocationSelect: (point: GeoPoint) => void
  onOutsideArea: () => void
}

export function DrainageMap({
  reports,
  draftLocation,
  onLocationSelect,
  onOutsideArea,
}: DrainageMapProps) {
  const { language, t } = useI18n()
  // MapContainer props are read once, at creation.
  const animate = useMemo(() => !prefersReducedMotion(), [])

  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={DEFAULT_ZOOM}
      minZoom={MIN_ZOOM}
      maxZoom={MAX_ZOOM}
      maxBounds={MAP_BOUNDS}
      maxBoundsViscosity={1}
      zoomControl={false}
      attributionControl={false}
      zoomAnimation={animate}
      fadeAnimation={animate}
      markerZoomAnimation={animate}
      // `isolate` keeps Leaflet's internal z-indexes (up to 1000) from competing with app overlays.
      className="isolate h-full w-full bg-slate-200"
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} maxZoom={MAX_ZOOM} />
      <AttributionControl position="bottomright" prefix={LEAFLET_ATTRIBUTION_PREFIX} />
      {/* Keyed by language: Leaflet reads the button titles only when the control is created. */}
      <ZoomControl
        key={language}
        position="bottomright"
        zoomInTitle={t.map.zoomIn}
        zoomOutTitle={t.map.zoomOut}
      />
      <OutsideAreaMask />
      <MapInteractions onLocationSelect={onLocationSelect} onOutsideArea={onOutsideArea} />

      {reports.map((report) => (
        <ReportMarker key={report.id} report={report} />
      ))}

      {draftLocation && (
        <Marker
          position={[draftLocation.lat, draftLocation.lng]}
          icon={DRAFT_ICON}
          interactive={false}
          keyboard={false}
          zIndexOffset={1000}
        />
      )}
    </MapContainer>
  )
}
