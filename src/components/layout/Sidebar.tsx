import { LogIn, LogOut, User } from 'lucide-react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const items = [
  { to: '/', label: '대시보드', end: true },
  { to: '/diagnose', label: 'AI 진단' },
  { to: '/events', label: '건강 진단 히스토리' },
  { to: '/me', label: '마이페이지' },
] as const

interface SidebarProps {
  mobileMenuOpen?: boolean
  onMobileMenuToggle?: () => void
}

export function Sidebar({ mobileMenuOpen = false, onMobileMenuToggle }: SidebarProps) {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const onLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const loc = useLocation()

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="px-4 py-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between gap-6">
          <NavLink to="/" className="flex flex-shrink-0 items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-slate-900 shadow-soft">
              <span className="text-xl" aria-hidden="true">🐾</span>
            </div>
            <div className="min-w-0">
              <div className="text-base font-black text-slate-900">PetScan AI</div>
              <div className="truncate text-xs font-semibold text-slate-500">
                반려동물을 사랑하는 보호자를 위한 케어 대시보드
              </div>
            </div>
          </NavLink>

          <nav className="hidden items-center gap-1 md:flex">
            {(() => {
              const visibleItems = items.filter((it) => !(loc.pathname.startsWith('/login') && it.to === '/'))
              return visibleItems.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={'end' in it ? it.end : false}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-2 text-sm font-bold transition ${
                    isActive
                      ? 'bg-primary text-slate-900 shadow-soft'
                      : 'text-slate-600 hover:bg-surface hover:text-slate-900'
                  }`
                }
              >
                {it.label}
              </NavLink>
              ))
            })()}
          </nav>

          <div className="hidden flex-shrink-0 items-center gap-2 md:flex">
            {currentUser ? (
              <>
                <NavLink
                  to="/me"
                  className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200"
                >
                  <User className="h-3.5 w-3.5" />
                  {currentUser.name}
                </NavLink>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  로그아웃
                </button>
              </>
            ) : (
              !loc.pathname.startsWith('/login') ? (
                <NavLink
                  to="/login"
                  className="flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-blue-700"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  로그인
                </NavLink>
              ) : null
            )}
          </div>

          <button
            onClick={onMobileMenuToggle}
            className="flex-shrink-0 rounded-lg p-2 transition hover:bg-slate-100 md:hidden"
            aria-label="메뉴"
          >
            <svg className="h-5 w-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="mt-4 space-y-1 border-t border-slate-100 pt-4 pb-4 md:hidden">
            {(() => {
              const visibleItems = items.filter((it) => !(loc.pathname.startsWith('/login') && it.to === '/'))
              return visibleItems.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={'end' in it ? it.end : false}
                onClick={onMobileMenuToggle}
                className={({ isActive }) =>
                  `block rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                    isActive ? 'bg-primary text-slate-900 shadow-soft' : 'text-slate-700 hover:bg-surface'
                  }`
                }
              >
                {it.label}
              </NavLink>
              ))
            })()}
            <div className="mt-2 flex flex-wrap items-center gap-2 px-3 py-2.5">
              {currentUser ? (
                <>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                    {currentUser.name}
                  </span>
                  <button
                    onClick={() => {
                      onMobileMenuToggle?.()
                      onLogout()
                    }}
                    className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                !loc.pathname.startsWith('/login') ? (
                  <NavLink
                    to="/login"
                    onClick={onMobileMenuToggle}
                    className="rounded-full bg-blue-600 px-2.5 py-1 text-xs font-bold text-white"
                  >
                    로그인
                  </NavLink>
                ) : null
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
