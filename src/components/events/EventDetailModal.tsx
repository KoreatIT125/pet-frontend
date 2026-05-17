import type { EventRecord } from '../../types/event'
import { resolveAssetUrl } from '../../lib/apiBase'
import { formatEventType, formatSeverity } from '../../lib/eventLabels'
import { Modal } from '../ui/Modal'
import { SeverityBadge } from '../ui/SeverityBadge'

export function EventDetailModal({
  open,
  event,
  onClose,
}: {
  open: boolean
  event: EventRecord | null
  onClose: () => void
}) {
  if (!event) return null
  const img = resolveAssetUrl(event.snapshotUrl)

  return (
    <Modal open={open} title={`건강 진단 기록 #${event.eventId}`} onClose={onClose}>
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl ring-1 ring-slate-200">
          <img src={img} alt="진단 참고 이미지" className="h-full w-full object-cover" loading="lazy" />
        </div>
        <dl className="grid gap-3 sm:gap-4">
          <div className="rounded-[2rem] bg-app-bg p-3 sm:p-4 ring-1 ring-slate-200/70">
            <dt className="text-xs font-semibold text-slate-500">분석 결과</dt>
            <dd className="mt-1 text-sm sm:text-base font-semibold text-slate-900">AI 분석 완료</dd>
          </div>
          <div className="rounded-[2rem] bg-app-bg p-3 sm:p-4 ring-1 ring-slate-200/70">
            <dt className="text-xs font-semibold text-slate-500">진단 부위</dt>
            <dd className="mt-1 text-sm sm:text-base font-semibold text-slate-900">{formatEventType(event.eventType)}</dd>
          </div>
          <div className="rounded-[2rem] bg-app-bg p-3 sm:p-4 ring-1 ring-slate-200/70">
            <dt className="text-xs font-semibold text-slate-500">기록 시각</dt>
            <dd className="mt-1 text-sm sm:text-base font-semibold text-slate-900">{event.timestamp}</dd>
          </div>
          <div className="rounded-xl bg-app-bg p-3 sm:p-4 ring-1 ring-slate-200/70">
            <dt className="text-xs font-semibold text-slate-500">상태</dt>
            <dd className="mt-2 flex flex-wrap items-center gap-2">
              <SeverityBadge severity={event.severity} />
              <span className="text-xs sm:text-sm text-muted">{formatSeverity(String(event.severity))}</span>
            </dd>
          </div>
          <div className="rounded-xl bg-app-bg p-3 sm:p-4 ring-1 ring-slate-200/70">
            <dt className="text-xs font-semibold text-slate-500">참고 이미지</dt>
            <dd className="mt-1 break-all text-xs sm:text-sm text-slate-700">{event.snapshotUrl}</dd>
          </div>
        </dl>
      </div>
    </Modal>
  )
}
