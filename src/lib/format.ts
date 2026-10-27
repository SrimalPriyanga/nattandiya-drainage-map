/** Reports are about local events, so times are always shown in Sri Lanka time. */
const TIME_ZONE = 'Asia/Colombo'

const dateTimeFormats = new Map<string, Intl.DateTimeFormat>()

export function formatDateTime(isoTimestamp: string, locales: readonly string[]): string {
  const date = new Date(isoTimestamp)
  if (Number.isNaN(date.getTime())) return isoTimestamp

  const cacheKey = locales.join(',')
  let format = dateTimeFormats.get(cacheKey)
  if (!format) {
    format = new Intl.DateTimeFormat([...locales], {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: TIME_ZONE,
    })
    dateTimeFormats.set(cacheKey, format)
  }
  return format.format(date)
}

export function formatCoordinate(value: number): string {
  return value.toFixed(6)
}
