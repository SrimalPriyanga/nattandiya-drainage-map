import { ChevronDown, CircleAlert, LoaderCircle, MapPin, Send, TriangleAlert, X } from 'lucide-react'
import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
  type SyntheticEvent,
} from 'react'
import { CATEGORY_STYLES } from '../config/categories'
import { useI18n } from '../i18n/useI18n'
import { formatCoordinate } from '../lib/format'
import type { GeoPoint } from '../lib/geo'
import { createReport } from '../lib/reports'
import { isSupabaseConfigured } from '../lib/supabase'
import {
  DESCRIPTION_MAX_LENGTH,
  DESCRIPTION_MIN_LENGTH,
  isReportCategory,
  REPORT_CATEGORIES,
  type DrainageReport,
  type ReportCategory,
} from '../types/report'
import { TurnstilePlaceholder } from './TurnstilePlaceholder'

interface ReportModalProps {
  location: GeoPoint
  onClose: () => void
  onSubmitted: (report: DrainageReport) => void
}

type DescriptionError = 'tooShort' | 'tooLong' | null

/** Counts code points, like Postgres char_length() in the database check constraint. */
function validateDescription(text: string): DescriptionError {
  const length = Array.from(text.trim()).length
  if (length < DESCRIPTION_MIN_LENGTH) return 'tooShort'
  if (length > DESCRIPTION_MAX_LENGTH) return 'tooLong'
  return null
}

const labelClass = 'mb-1.5 block text-sm font-medium text-slate-800'
// text-base (16px) stops iOS Safari from zooming the page when a field gains focus.
const fieldClass =
  'w-full rounded-lg border bg-white text-base text-slate-900 transition focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500/40'
const readOnlyFieldClass =
  'h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 font-mono text-base tabular-nums text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40'

function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-sm leading-relaxed text-red-700">
      <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}

/**
 * Report form in a native modal <dialog>: focus trapping, Escape to close, an inert page
 * behind it and top-layer stacking above Leaflet all come from the browser. The parent mounts
 * it only while a location is selected (keyed per location), so every report starts fresh.
 */
export function ReportModal({ location, onClose, onSubmitted }: ReportModalProps) {
  const { t } = useI18n()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const categoryRef = useRef<HTMLSelectElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)
  const id = useId()
  const ids = {
    title: `${id}-title`,
    latitude: `${id}-latitude`,
    longitude: `${id}-longitude`,
    category: `${id}-category`,
    categoryError: `${id}-category-error`,
    description: `${id}-description`,
    descriptionHint: `${id}-description-hint`,
    descriptionError: `${id}-description-error`,
  }

  const [category, setCategory] = useState<ReportCategory | ''>('')
  const [description, setDescription] = useState('')
  const [showErrors, setShowErrors] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitFailed, setSubmitFailed] = useState(false)

  // A layout effect, because its cleanup runs before React detaches the <dialog>: closing an
  // attached modal dialog is what makes the browser hand focus back to the map. (A passive
  // effect's cleanup runs after removal, when focus has already fallen to <body>.)
  useLayoutEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (!dialog.open) dialog.showModal()
    return () => {
      if (dialog.open) dialog.close()
    }
  }, [])

  const descriptionError = validateDescription(description)
  const categoryInvalid = showErrors && category === ''
  const descriptionInvalid = showErrors && descriptionError !== null
  const isPristine = category === '' && description.trim() === ''
  const selectedStyle = category === '' ? null : CATEGORY_STYLES[category]
  const SelectedIcon = selectedStyle?.icon

  const requestClose = () => {
    if (!submitting) onClose()
  }

  const handleDialogClose = () => {
    // Ignore stale `close` events, e.g. from React StrictMode's mount → unmount → mount cycle.
    if (!dialogRef.current?.open) onClose()
  }

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    // Escape key: keep the dialog open while a submission is in flight.
    if (submitting) event.preventDefault()
  }

  const handleDialogClick = (event: MouseEvent<HTMLDialogElement>) => {
    // Only clicks on the ::backdrop target the <dialog> itself (the form fills its box). Close
    // on a backdrop tap only while the form is untouched, so typed text is never lost by a mis-tap.
    if (event.target === event.currentTarget && isPristine) requestClose()
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting || !isSupabaseConfigured) return

    if (category === '' || descriptionError) {
      setShowErrors(true)
      ;(category === '' ? categoryRef : descriptionRef).current?.focus()
      return
    }

    setSubmitting(true)
    setSubmitFailed(false)
    try {
      const report = await createReport({
        latitude: location.lat,
        longitude: location.lng,
        category,
        description,
      })
      onSubmitted(report) // the parent unmounts this dialog
    } catch (error) {
      console.error('[report] Failed to submit report', error)
      setSubmitFailed(true)
      setSubmitting(false)
    }
  }

  return (
    // The click handler only detects ::backdrop taps; keyboard users close with Escape, which
    // <dialog> handles natively.
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
    <dialog
      ref={dialogRef}
      aria-labelledby={ids.title}
      onClose={handleDialogClose}
      onCancel={handleCancel}
      onClick={handleDialogClick}
      className="m-0 mt-auto max-h-[92dvh] w-full max-w-full overflow-hidden rounded-t-2xl bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/40 motion-safe:animate-sheet-in sm:m-auto sm:max-w-lg sm:rounded-2xl"
    >
      <form noValidate onSubmit={handleSubmit} className="flex max-h-[92dvh] flex-col">
        <div className="flex items-start gap-3 border-b border-slate-200 px-4 py-3 sm:px-5">
          <h2 id={ids.title} className="flex-1 pt-1.5 text-lg font-semibold leading-snug">
            {t.form.title}
          </h2>
          <button
            type="button"
            onClick={requestClose}
            disabled={submitting}
            aria-label={t.form.close}
            title={t.form.close}
            className="-mr-1.5 flex size-10 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:opacity-50"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-4 sm:px-5">
          {!isSupabaseConfigured && (
            <p className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-relaxed text-amber-950">
              <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden="true" />
              <span>{t.form.notConfigured}</span>
            </p>
          )}

          <fieldset>
            <legend className="mb-2 flex items-center gap-1.5 text-sm font-medium text-slate-800">
              <MapPin className="size-4 text-emerald-600" aria-hidden="true" />
              {t.form.location}
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor={ids.latitude} className="mb-1 block text-xs text-slate-500">
                  {t.form.latitude}
                </label>
                <input
                  id={ids.latitude}
                  readOnly
                  value={formatCoordinate(location.lat)}
                  className={readOnlyFieldClass}
                />
              </div>
              <div>
                <label htmlFor={ids.longitude} className="mb-1 block text-xs text-slate-500">
                  {t.form.longitude}
                </label>
                <input
                  id={ids.longitude}
                  readOnly
                  value={formatCoordinate(location.lng)}
                  className={readOnlyFieldClass}
                />
              </div>
            </div>
          </fieldset>

          <div>
            <label htmlFor={ids.category} className={labelClass}>
              {t.form.category}{' '}
              <span className="text-red-600" aria-hidden="true">
                *
              </span>
            </label>
            <div className="relative">
              {selectedStyle && SelectedIcon && (
                <span
                  className="pointer-events-none absolute left-2.5 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: selectedStyle.color }}
                  aria-hidden="true"
                >
                  <SelectedIcon className="size-3.5" />
                </span>
              )}
              <select
                ref={categoryRef}
                id={ids.category}
                required
                value={category}
                onChange={(event) =>
                  setCategory(isReportCategory(event.target.value) ? event.target.value : '')
                }
                aria-invalid={categoryInvalid}
                aria-describedby={categoryInvalid ? ids.categoryError : undefined}
                className={`${fieldClass} min-h-12 cursor-pointer appearance-none py-2.5 pr-10 ${
                  selectedStyle ? 'pl-11' : 'pl-3'
                } ${categoryInvalid ? 'border-red-500' : 'border-slate-300'} ${
                  category === '' ? 'text-slate-500' : ''
                }`}
              >
                <option value="" disabled>
                  {t.form.categoryPlaceholder}
                </option>
                {REPORT_CATEGORIES.map((value) => (
                  <option key={value} value={value} className="text-slate-900">
                    {t.categories[value]}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-500"
                aria-hidden="true"
              />
            </div>
            {categoryInvalid && <FieldError id={ids.categoryError}>{t.form.categoryRequired}</FieldError>}
          </div>

          <div>
            <label htmlFor={ids.description} className={labelClass}>
              {t.form.description}{' '}
              <span className="text-red-600" aria-hidden="true">
                *
              </span>
            </label>
            <textarea
              ref={descriptionRef}
              id={ids.description}
              required
              rows={4}
              maxLength={DESCRIPTION_MAX_LENGTH}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder={t.form.descriptionPlaceholder}
              aria-invalid={descriptionInvalid}
              aria-describedby={
                descriptionInvalid
                  ? `${ids.descriptionError} ${ids.descriptionHint}`
                  : ids.descriptionHint
              }
              className={`${fieldClass} block resize-y px-3 py-2.5 leading-relaxed placeholder:text-slate-400 ${
                descriptionInvalid ? 'border-red-500' : 'border-slate-300'
              }`}
            />
            <div className="mt-1.5 flex items-start justify-between gap-3 text-xs leading-relaxed">
              <p id={ids.descriptionHint} className="text-slate-500">
                {t.form.privacyHint}
              </p>
              <span className="shrink-0 tabular-nums text-slate-400" aria-hidden="true">
                {description.length}/{DESCRIPTION_MAX_LENGTH}
              </span>
            </div>
            {descriptionInvalid && (
              <FieldError id={ids.descriptionError}>
                {descriptionError === 'tooLong'
                  ? t.form.descriptionTooLong(DESCRIPTION_MAX_LENGTH)
                  : t.form.descriptionTooShort(DESCRIPTION_MIN_LENGTH)}
              </FieldError>
            )}
          </div>

          <TurnstilePlaceholder />

          {submitFailed && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-relaxed text-red-900"
            >
              <CircleAlert className="mt-0.5 size-4 shrink-0 text-red-600" aria-hidden="true" />
              <p>{t.form.submitError}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 border-t border-slate-200 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:px-5 sm:pb-4">
          <button
            type="button"
            onClick={requestClose}
            disabled={submitting}
            className="min-h-11 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:opacity-50"
          >
            {t.form.cancel}
          </button>
          <button
            type="submit"
            disabled={submitting || !isSupabaseConfigured}
            className="flex min-h-11 flex-[2] items-center justify-center gap-2 rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {submitting ? (
              <LoaderCircle className="size-4 shrink-0 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="size-4 shrink-0" aria-hidden="true" />
            )}
            {submitting ? t.form.submitting : t.form.submit}
          </button>
        </div>
      </form>
    </dialog>
  )
}
