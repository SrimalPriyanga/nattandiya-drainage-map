import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  ToastActionsContext,
  ToastListContext,
  type Toast,
  type ToastActions,
  type ToastOptions,
} from './toastContext'

const DEFAULT_DURATION_MS = 5000
const MAX_VISIBLE = 3

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(0)
  const timers = useRef(new Map<number, number>())

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
    window.clearTimeout(timers.current.get(id))
    timers.current.delete(id)
  }, [])

  const showToast = useCallback(
    ({ message, variant = 'info', key, durationMs = DEFAULT_DURATION_MS }: ToastOptions) => {
      nextId.current += 1
      const id = nextId.current
      setToasts((current) => {
        const others = key ? current.filter((toast) => toast.key !== key) : current
        return [...others.slice(-(MAX_VISIBLE - 1)), { id, key, variant, message }]
      })
      timers.current.set(
        id,
        window.setTimeout(() => dismissToast(id), durationMs),
      )
    },
    [dismissToast],
  )

  useEffect(() => {
    const pending = timers.current
    return () => {
      for (const timer of pending.values()) window.clearTimeout(timer)
      pending.clear()
    }
  }, [])

  const actions = useMemo<ToastActions>(
    () => ({ showToast, dismissToast }),
    [showToast, dismissToast],
  )

  return (
    <ToastActionsContext value={actions}>
      <ToastListContext value={toasts}>{children}</ToastListContext>
    </ToastActionsContext>
  )
}
