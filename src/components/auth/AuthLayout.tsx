import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface AuthLayoutProps {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  const loc = useLocation()
  return (
    <div className="flex min-h-full flex-col bg-app-bg">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-12 -top-12 h-48 w-48 sm:h-72 sm:w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-12 -right-12 h-48 w-48 sm:h-72 sm:w-72 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-slate-200/80 bg-surface/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <Link to="/" className="flex items-center gap-3 rounded-lg outline-none ring-primary/40 focus-visible:ring-2 flex-1 min-w-0">
            <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <span className="text-lg" aria-hidden="true">
                ✚
              </span>
            </div>
            <div className="text-left min-w-0">
              <div className="text-sm font-semibold text-slate-900">PetScan AI</div>
              <div className="truncate text-xs text-slate-500">보호자를 위한 반려동물 케어 플랫폼</div>
            </div>
          </Link>
          {!loc.pathname.startsWith('/login') && (
            <Link
              to="/"
              className="text-xs sm:text-sm font-medium text-slate-600 transition hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary flex-shrink-0 ml-4"
            >
              대시보드로
            </Link>
          )}
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-6 sm:py-12">
        <div className="w-full max-w-md">
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
            {subtitle && <p className="mt-2 text-xs sm:text-sm text-slate-600">{subtitle}</p>}
          </div>

          <div className="rounded-xl bg-surface p-6 sm:p-8 shadow-sm ring-1 ring-slate-200/80">{children}</div>

          {footer && <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-slate-600">{footer}</div>}
        </div>
      </main>
    </div>
  )
}
