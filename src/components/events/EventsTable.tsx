import type { EventRecord } from '../../types/event'
import { formatEventType, formatSeverity, formatSymptomDescription } from '../../lib/eventLabels'
import { SeverityBadge } from '../ui/SeverityBadge'

function formatTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(d)
}

export function EventsTable({
  rows,
  onSelect,
}: {
  rows: EventRecord[]
  onSelect: (e: EventRecord) => void
}) {
  return (
    <div className="overflow-hidden rounded-[2rem] bg-surface shadow-extra-soft ring-1 ring-slate-200/60">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs sm:text-sm">
          <thead className="bg-app-bg text-xs font-semibold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-3 sm:px-5 py-2 sm:py-3">기록 시각</th>
              <th className="px-3 sm:px-5 py-2 sm:py-3">진단 부위</th>
              <th className="px-3 sm:px-5 py-2 sm:py-3">증상 내용</th>
              <th className="px-3 sm:px-5 py-2 sm:py-3">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr
                key={r.eventId}
                className="cursor-pointer bg-white transition hover:bg-app-bg"
                onClick={() => onSelect(r)}
              >
                <td className="whitespace-nowrap px-3 sm:px-5 py-2 sm:py-4 font-medium text-slate-900 text-xs sm:text-sm">{formatTime(r.timestamp)}</td>
                <td className="px-3 sm:px-5 py-2 sm:py-4 text-slate-700 text-xs sm:text-sm">{formatEventType(r.eventType)}</td>
                <td className="px-3 sm:px-5 py-2 sm:py-4 text-slate-700 text-xs sm:text-sm">{formatSymptomDescription(r.eventType, r.severity)}</td>
                <td className="px-3 sm:px-5 py-2 sm:py-4">
                  <div className="flex items-center gap-2">
                    <SeverityBadge severity={r.severity} />
                    <span className="text-xs text-muted">{formatSeverity(String(r.severity))}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
