import type { ReactNode } from 'react'
import {
  Activity,
  AlertTriangle,
  Clock,
} from 'lucide-react'

const healthMetrics = [
  {
    name: '눈 상태',
    value: '정상',
    detail: '눈 깜박임과 안구 건조 검사 정상',
    tone: 'emerald',
  },
  {
    name: '피부 상태',
    value: '주의',
    detail: '피부 발적과 가려움 가능성 감지',
    tone: 'amber',
  },
]

const recentEvents = [
  { time: '14:22', site: 'AI 분석', type: '결막염 의심', level: '주의' },
  { time: '13:48', site: 'AI 분석', type: '피부 농포 의심', level: '주의' },
  { time: '13:21', site: 'AI 분석', type: '정상 모니터링', level: '정상' },
]

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string
  value: string
  description: string
  icon: ReactNode
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <h3 className="mt-3 text-3xl font-black text-slate-900">{value}</h3>
          <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/25 text-slate-900">
          {icon}
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-app-bg">
      <section className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="overflow-hidden rounded-[2rem] bg-primary p-8 text-slate-900 shadow-soft">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/30 px-4 py-2 text-sm font-bold text-slate-900/90">
                <Activity className="h-4 w-4" />
                마이 펫 케어 홈
              </div>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                마이 펫 케어 홈
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
                AI 감지와 분석으로 반려동물 건강 상태를 빠르게 확인하고,
                이상 징후를 빠르게 파악하여 케어할 수 있도록 돕습니다.
              </p>
            </div>
            <div className="rounded-[2rem] bg-white/10 p-5 ring-1 ring-white/10">
              <p className="text-sm font-semibold text-slate-700">건강 컨디션</p>
              <div className="mt-2 flex items-end gap-2">
                <span className="text-4xl font-black">98%</span>
                <span className="pb-1 text-sm text-emerald-300">정상 운영</span>
              </div>
            </div>
          </div>
        </div>

        {/* KPI */}
        <div className="grid gap-5">
          <StatCard
            title="오늘 감지 이벤트"
            value="18건"
            description="AI가 감지한 이상 징후"
            icon={<AlertTriangle className="h-6 w-6" />}
          />
        </div>

        {/* Health overview cards */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-[2rem] bg-white p-6 shadow-extra-soft ring-1 ring-slate-200/60">
            <div className="mb-6">
              <h3 className="text-xl font-black text-slate-900">오늘의 건강 체크</h3>
              <p className="mt-1 text-sm text-slate-500">눈·피부 상태를 한눈에 확인하세요</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {healthMetrics.map((metric) => (
                <div
                  key={metric.name}
                  className="rounded-[2rem] bg-surface p-5 shadow-soft ring-1 ring-slate-200/60"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">{metric.name}</p>
                      <p className="mt-3 text-2xl font-black text-slate-900">{metric.value}</p>
                    </div>
                    <div
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        metric.tone === 'emerald'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {metric.value}
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{metric.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-extra-soft ring-1 ring-slate-200/60">
            <h3 className="text-xl font-black text-slate-900">최근 건강 이벤트</h3>
            <p className="mt-1 text-sm text-slate-500">실시간 감지 로그</p>
            <div className="mt-5 space-y-4">
              {recentEvents.map((event) => (
                <div key={`${event.time}-${event.site}`} className="rounded-[2rem] bg-surface p-4 shadow-soft ring-1 ring-slate-200/60">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <Clock className="h-4 w-4" />
                      {event.time}
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        event.level === '위험'
                          ? 'bg-rose-100 text-rose-700'
                          : event.level === '주의'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {event.level}
                    </span>
                  </div>
                  <p className="mt-3 font-bold text-slate-900">{event.type}</p>
                  <p className="mt-1 text-sm text-slate-500">AI 분석 완료</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>
    </main>
  )
}
