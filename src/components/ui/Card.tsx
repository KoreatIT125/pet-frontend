import type { ReactNode } from 'react'

interface CardProps {
  title?: string
  description?: string
  children: ReactNode
  className?: string
  headerRight?: ReactNode
}

export function Card({ title, description, children, className = '', headerRight }: CardProps) {
  return (
    <section
      className={`rounded-[2rem] bg-surface shadow-extra-soft ring-1 ring-slate-200/60 transition-shadow ${className}`}
    >
      {(title || description || headerRight) && (
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-4 sm:px-6 py-3 sm:py-4">
          <div className="min-w-0">
            {title && <h2 className="text-sm sm:text-base font-semibold text-slate-900">{title}</h2>}
            {description && <p className="mt-1 text-xs sm:text-sm text-slate-600">{description}</p>}
          </div>
          {headerRight}
        </header>
      )}
      <div className="px-4 sm:px-6 py-4 sm:py-5">{children}</div>
    </section>
  )
}
