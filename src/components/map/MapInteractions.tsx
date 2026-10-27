import type { LatLng, LeafletKeyboardEvent, LeafletMouseEvent, PopupEvent } from 'leaflet'
import { useEffect, useEffectEvent } from 'react'
import { useMap } from 'react-leaflet'
import { useI18n } from '../../i18n/useI18n'
import { isInServiceArea, roundCoordinate, type GeoPoint } from '../../lib/geo'
import { prefersReducedMotion } from '../../lib/motion'

/** Wait this long after a click so a double-click / double-tap zooms instead of reporting. */
const DOUBLE_CLICK_WINDOW_MS = 300
/** Below this map width the report form is a bottom sheet covering the lower half. */
const BOTTOM_SHEET_MAX_WIDTH_PX = 640

interface MapInteractionsProps {
  onLocationSelect: (point: GeoPoint) => void
  onOutsideArea: () => void
}

/** Wires Leaflet map events to the app. Must be rendered inside <MapContainer>. */
export function MapInteractions({ onLocationSelect, onOutsideArea }: MapInteractionsProps) {
  const map = useMap()
  const { t } = useI18n()

  const selectLocation = useEffectEvent((latlng: LatLng) => {
    const point = { lat: roundCoordinate(latlng.lat), lng: roundCoordinate(latlng.lng) }
    if (!isInServiceArea(point)) {
      onOutsideArea()
      return
    }
    onLocationSelect(point)

    // On phones the form opens as a bottom sheet — nudge the map so the new pin stays visible.
    const size = map.getSize()
    if (size.x < BOTTOM_SHEET_MAX_WIDTH_PX) {
      const offsetY = map.latLngToContainerPoint(latlng).y - size.y * 0.25
      if (Math.abs(offsetY) > 24) map.panBy([0, offsetY], { animate: !prefersReducedMotion() })
    }
  })

  const localizePopupCloseButton = useEffectEvent((event: PopupEvent) => {
    // Leaflet hard-codes an English "Close popup" label on the × button.
    const button = event.popup.getElement()?.querySelector('.leaflet-popup-close-button')
    if (button instanceof HTMLElement) {
      button.setAttribute('aria-label', t.popup.close)
      button.title = t.popup.close
    }
  })

  useEffect(() => {
    const container = map.getContainer()
    let pendingClick: number | undefined
    let popupJustClosed = false
    let popupResetTimer: number | undefined

    const cancelPendingClick = () => {
      window.clearTimeout(pendingClick)
      pendingClick = undefined
    }

    const handleClick = (event: LeafletMouseEvent) => {
      // A tap that only dismissed an open popup must not also start a report. Leaflet closes
      // popups on `preclick`, i.e. synchronously just before this handler runs.
      if (popupJustClosed) return
      // Clicks from keyboards / assistive tech (detail 0) carry no real pointer position.
      const latlng = event.originalEvent.detail === 0 ? map.getCenter() : event.latlng
      cancelPendingClick()
      pendingClick = window.setTimeout(() => {
        pendingClick = undefined
        selectLocation(latlng)
      }, DOUBLE_CLICK_WINDOW_MS)
    }

    const handleKeyDown = (event: LeafletKeyboardEvent) => {
      const { originalEvent } = event
      const target = originalEvent.target
      // Leaflet only closes popups on Escape while the container itself has focus; popup
      // content receives focus for keyboard users (see ReportPopup), so handle it there too.
      if (originalEvent.key === 'Escape' && target instanceof Element && target.closest('.leaflet-popup')) {
        map.closePopup()
        return
      }
      // Enter reports at the centre — only when the map itself is focused, not a marker.
      if (originalEvent.key === 'Enter' && target === container) {
        originalEvent.preventDefault()
        selectLocation(map.getCenter())
      }
    }

    const handlePopupClose = () => {
      popupJustClosed = true
      window.clearTimeout(popupResetTimer)
      popupResetTimer = window.setTimeout(() => {
        popupJustClosed = false
      }, 0)
    }

    const handlePopupOpen = (event: PopupEvent) => localizePopupCloseButton(event)

    map.on('click', handleClick)
    map.on('dblclick zoomstart movestart', cancelPendingClick)
    map.on('keydown', handleKeyDown)
    map.on('popupopen', handlePopupOpen)
    map.on('popupclose', handlePopupClose)

    return () => {
      map.off('click', handleClick)
      map.off('dblclick zoomstart movestart', cancelPendingClick)
      map.off('keydown', handleKeyDown)
      map.off('popupopen', handlePopupOpen)
      map.off('popupclose', handlePopupClose)
      cancelPendingClick()
      window.clearTimeout(popupResetTimer)
    }
  }, [map])

  // Accessible name + instructions for the focusable map container, in the current language.
  useEffect(() => {
    const container = map.getContainer()
    container.setAttribute('role', 'region')
    container.setAttribute('aria-label', t.map.label)
  }, [map, t])

  // Leaflet only watches window resizes; the container also changes size when the
  // instruction banner is dismissed, the header wraps, or a phone rotates.
  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize())
    observer.observe(map.getContainer())
    return () => observer.disconnect()
  }, [map])

  return null
}
