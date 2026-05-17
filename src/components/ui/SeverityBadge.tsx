import type { EventSeverity } from '../../types/event'

const styles: Record<string, string> = {
  HIGH: 'bg-orange-50 text-orange-700 ring-orange-200',
  MEDIUM: 'bg-amber-50 text-amber-800 ring-amber-200',
  LOW: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
}

const labels: Record<string, string> = {
  HIGH: '주의',
  MEDIUM: '주의',
  LOW: '양호',
}

export function SeverityBadge({ severity }: { severity: EventSeverity }) {
  const key = String(severity).toUpperCase()
  const cls = styles[key] ?? 'bg-surface text-slate-700 ring-slate-200'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${cls}`}>
      {labels[key] ?? key}
    </span>
  )
}
