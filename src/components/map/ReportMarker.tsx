import type { LatLngTuple, Marker as LeafletMarker, LeafletEventHandlerFnMap } from 'leaflet'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { Marker, Popup } from 'react-leaflet'
import { getStatusLabel } from '../../i18n/labels'
import { useI18n } from '../../i18n/useI18n'
import type { DrainageReport } from '../../types/report'
import { CATEGORY_ICONS } from './markerIcons'
import { ReportPopup } from './ReportPopup'

export const ReportMarker = memo(function ReportMarker({ report }: { report: DrainageReport }) {
  const { t } = useI18n()
  const markerRef = useRef<LeafletMarker>(null)
  const position = useMemo<LatLngTuple>(
    () => [report.latitude, report.longitude],
    [report.latitude, report.longitude],
  )
  const label = `${t.categories[report.category]} · ${getStatusLabel(t, report.status)}`

  // react-leaflet keeps popup children mounted after the popup first opens, so track the open
  // state and render the content only while open — ReportPopup's effects then map to open/close.
  const [popupOpen, setPopupOpen] = useState(false)
  const eventHandlers = useMemo<LeafletEventHandlerFnMap>(
    () => ({ popupopen: () => setPopupOpen(true), popupclose: () => setPopupOpen(false) }),
    [],
  )

  // Leaflet applies `title` only when the marker is created; keep the accessible name and
  // hover tooltip in step with the UI language ourselves.
  useEffect(() => {
    const element = markerRef.current?.getElement()
    if (!element) return
    element.setAttribute('aria-label', label)
    element.title = label
  }, [label])

  return (
    <Marker
      ref={markerRef}
      position={position}
      icon={CATEGORY_ICONS[report.category]}
      eventHandlers={eventHandlers}
      riseOnHover
    >
      <Popup minWidth={220} maxWidth={300} maxHeight={320} autoPanPadding={[24, 24]}>
        {popupOpen && <ReportPopup report={report} />}
      </Popup>
    </Marker>
  )
})
