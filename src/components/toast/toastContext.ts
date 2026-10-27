import { createContext } from 'react'
import type { Dictionary } from '../../i18n/locales'

export type ToastVariant = 'success' | 'error' | 'info'

/**
 * Messages are dictionary selectors rather than strings, so a visible toast re-renders in
 * the new language if the user switches language while it is on screen.
 */
export type ToastMessage = (t: Dictionary) => string

export interface Toast {
  id: number
  key?: string
  variant: ToastVariant
  message: ToastMessage
}

export interface ToastOptions {
  message: ToastMessage
  variant?: ToastVariant
  /** Showing a toast with the same key replaces the previous one instead of stacking. */
  key?: string
  durationMs?: number
}

export interface ToastActions {
  showToast: (options: ToastOptions) => void
  dismissToast: (id: number) => void
}

// Actions and the toast list are separate contexts so that components which only *show*
// toasts don't re-render every time one appears or disappears.
export const ToastActionsContext = createContext<ToastActions | null>(null)
export const ToastListContext = createContext<readonly Toast[]>([])
