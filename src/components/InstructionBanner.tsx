import { MapPinPlus, X } from 'lucide-react'
import { useState } from 'react'
import { useI18n } from '../i18n/useI18n'
import { readStored, STORAGE_KEYS, writeStored } from '../lib/storage'

export function InstructionBanner() {
  const { t } = useI18n()
  // Dismissal lasts for the browser session, so returning visitors see the hint again.
  const [dismissed, setDismissed] = useState(
    () => readStored(STORAGE_KEYS.instructionsDismissed, 'session') === '1',
  )

  if (dismissed) return null

  const dismiss = () => {
    setDismissed(true)
    writeStored(STORAGE_KEYS.instructionsDismissed, '1', 'session')
  }

  return (
    <div className="relative z-10 border-b border-sky-200 bg-sky-50 text-sky-950">
      <div className="mx-auto flex max-w-7xl items-start gap-2.5 px-3 py-2 sm:items-center sm:px-5">
        <MapPinPlus className="mt-0.5 size-4 shrink-0 text-sky-700 sm:mt-0" aria-hidden="true" />
        <p className="flex-1 text-sm leading-relaxed">
          {t.banner.instruction} <span className="font-semibold">{t.banner.anonymous}</span>
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label={t.banner.dismiss}
          title={t.banner.dismiss}
          className="-my-1.5 -mr-1.5 flex size-9 shrink-0 items-center justify-center rounded-lg text-sky-700 transition hover:bg-sky-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
