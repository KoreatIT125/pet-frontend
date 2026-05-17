import type { SiteSummary } from '../../lib/dashboardStats'
import { Card } from '../ui/Card'

function formatWhen(iso?: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function SiteSummaryCards({ items }: { items: SiteSummary[] }) {
  if (items.length === 0) {
    return (
      <Card title="현장별 요약" description="이벤트가 없어 요약을 표시할 수 없습니다.">
        <p className="text-sm text-slate-600">데이터가 들어오면 현장 카드가 자동으로 생성됩니다.</p>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {items.map((s) => (
        <article
          key={s.siteName}
          className="rounded-[2rem] bg-surface p-6 shadow-extra-soft ring-1 ring-slate-200/60 transition hover:-translate-y-0.5 hover:shadow-soft"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-slate-900">{s.siteName}</div>
              <div className="mt-1 text-xs text-slate-500">최근 이벤트 {formatWhen(s.lastAt)}</div>
            </div>
            <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary ring-1 ring-primary/20">
              HIGH {s.high}
            </span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-app-bg p-3 ring-1 ring-slate-200/60">
              <div className="text-xs font-semibold text-slate-500">총 이벤트</div>
              <div className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{s.total}</div>
            </div>
            <div className="rounded-xl bg-app-bg p-3 ring-1 ring-slate-200/60">
              <div className="text-xs font-semibold text-slate-500">고위험 비중</div>
              <div className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                {s.total ? Math.round((s.high / s.total) * 100) : 0}%
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
