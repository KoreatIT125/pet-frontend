import { useEffect } from 'react'
import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}

export function Modal({ open, title, onClose, children, footer }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-primary/20 backdrop-blur-[1px]"
        aria-label="닫기"
        onClick={onClose}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          className="w-full max-w-2xl sm:max-w-3xl rounded-[2rem] bg-surface shadow-extra-soft ring-1 ring-slate-200/60"
        >
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-4 sm:px-6 py-3 sm:py-4">
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">{title}</h2>
            <button
              type="button"
              className="rounded-lg px-2 py-1 text-xs sm:text-sm text-slate-600 hover:bg-slate-50 flex-shrink-0"
              onClick={onClose}
            >
              닫기
            </button>
          </div>
          <div className="max-h-[min(72vh,860px)] overflow-auto px-4 sm:px-6 py-4 sm:py-5">{children}</div>
          {footer && <div className="border-t border-slate-100 px-4 sm:px-6 py-3 sm:py-4">{footer}</div>}
        </div>
      </div>
    </div>
  )
}
