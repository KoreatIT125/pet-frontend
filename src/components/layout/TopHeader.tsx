import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function titleForPath(pathname: string): { title: string; subtitle: string } {
  if (pathname.startsWith('/me')) {
    return {
      title: '마이페이지',
      subtitle: '내 정보와 우리 아이의 프로필을 관리합니다.',
    }
  }
  if (pathname.startsWith('/diagnose')) {
    return {
      title: 'AI 진단',
      subtitle: '환부 사진을 올리면 AI가 안구·피부 질환을 분류하고 케어 가이드를 안내합니다.',
    }
  }
  if (pathname.startsWith('/events')) {
    return {
      title: '건강 진단 히스토리',
      subtitle: '반려동물의 진단 이력과 상태를 한눈에 살펴보세요.',
    }
  }
  if (pathname.startsWith('/login')) {
    return {
      title: '보호자 로그인',
      subtitle: 'PetScan AI와 함께 반려동물 케어 여정을 시작해 보세요.',
    }
  }
  if (pathname.startsWith('/signup')) {
    return { title: '회원가입', subtitle: '새 계정을 만들고 반려동물 케어를 시작하세요.' }
  }
  return {
    title: '건강 현황',
    subtitle: '건강 상태와 최근 이상 징후를 한눈에 확인하세요.',
  }
}

export function TopHeader() {
  const loc = useLocation()
  const { currentUser } = useAuth()
  const { title, subtitle } = useMemo(() => titleForPath(loc.pathname), [loc.pathname])

  return (
    <header className="border-b border-[#EFE6DA] bg-white/80 backdrop-blur-md">
      <div className="flex items-start justify-between gap-4 px-4 py-6 sm:px-6 md:px-8">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <div className="min-w-0">
            <h1 className="text-[26px] font-bold tracking-tight text-[#24324A]">{title}</h1>
            <p className="mt-2 hidden text-sm text-slate-500 sm:block">{subtitle}</p>
          </div>
        </div>

        <div className="hidden flex-shrink-0 items-center gap-3 sm:flex">
          <div className="rounded-2xl bg-[#EAF8F1] px-4 py-2 text-xs text-[#2F855A] ring-1 ring-[#CFEBDD]">
            <span className="font-semibold">진단 시스템</span> 정상
          </div>

          {currentUser ? (
            <div
              className="rounded-2xl bg-[#5B8DEF] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4A7DE0]"
            >
              {currentUser.name}님의 마이페이지
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
