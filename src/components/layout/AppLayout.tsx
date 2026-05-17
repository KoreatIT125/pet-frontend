import { Suspense, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Spinner } from '../ui/Spinner'
import { Sidebar } from './Sidebar'
import { TopHeader } from './TopHeader'

function PageFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center gap-3 text-sm text-slate-600">
      <Spinner className="h-6 w-6 text-primary" label="페이지를 불러오는 중" />
      페이지를 불러오는 중…
    </div>
  )
}

export function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-full flex-col bg-app-bg">
      <Sidebar mobileMenuOpen={mobileMenuOpen} onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      <TopHeader />
      <main className="flex-1 px-4 py-6 sm:px-6 md:px-8 md:py-8">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}
