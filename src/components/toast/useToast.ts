import { use } from 'react'
import { ToastActionsContext, ToastListContext } from './toastContext'

export function useToast() {
  const actions = use(ToastActionsContext)
  if (!actions) throw new Error('useToast() must be used inside <ToastProvider>.')
  return actions
}

export function useToastList() {
  return use(ToastListContext)
}
