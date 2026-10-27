import { CircleAlert, CircleCheck, Info, X, type LucideIcon } from 'lucide-react'
import { useI18n } from '../../i18n/useI18n'
import type { ToastVariant } from './toastContext'
import { useToast, useToastList } from './useToast'

const VARIANTS: Record<ToastVariant, { icon: LucideIcon; className: string; iconClassName: string }> =
  {
    success: {
      icon: CircleCheck,
      className: 'bg-emerald-50 text-emerald-950 ring-emerald-200',
      iconClassName: 'text-emerald-600',
    },
    error: {
      icon: CircleAlert,
      className: 'bg-red-50 text-red-950 ring-red-200',
      iconClassName: 'text-red-600',
    },
    info: {
      icon: Info,
      className: 'bg-white text-slate-900 ring-slate-200',
      iconClassName: 'text-sky-700',
    },
  }

/** Renders the toast stack. Place it wherever toasts should appear; it is always mounted so
 * the live region exists before the first message is inserted. */
export function Toaster() {
  const toasts = useToastList()
  const { dismissToast } = useToast()
  const { t } = useI18n()

  return (
    <div aria-live="polite" className="flex w-full max-w-sm flex-col items-stretch gap-2">
      {toasts.map((toast) => {
        const { icon: Icon, className, iconClassName } = VARIANTS[toast.variant]
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl py-3 pl-4 pr-2 text-sm shadow-lg ring-1 motion-safe:animate-toast-in ${className}`}
          >
            <Icon className={`mt-0.5 size-5 shrink-0 ${iconClassName}`} aria-hidden="true" />
            <p className="flex-1 leading-relaxed">{toast.message(t)}</p>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label={t.toast.dismiss}
              title={t.toast.dismiss}
              className="-my-1 flex size-8 shrink-0 items-center justify-center rounded-lg opacity-60 transition hover:bg-black/5 hover:opacity-100 focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
