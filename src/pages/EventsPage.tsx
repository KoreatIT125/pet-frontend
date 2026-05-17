import { useState } from 'react'
import { EventDetailModal } from '../components/events/EventDetailModal'
import { EventsTable } from '../components/events/EventsTable'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Spinner } from '../components/ui/Spinner'
import { useEvents } from '../hooks/useEvents'
import type { EventRecord } from '../types/event'

export function EventsPage() {
  const { data, loading, error, refetch } = useEvents()
  const [selected, setSelected] = useState<EventRecord | null>(null)
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs sm:text-sm text-muted">진단 기록을 클릭하면 상세 모달을 확인할 수 있습니다.</div>
        <Button variant="ghost" onClick={() => void refetch()} disabled={loading}>
          새로고침
        </Button>
      </div>

      {error && (
        <Card title="오류">
          <p className="text-xs sm:text-sm text-rose-700">{error}</p>
        </Card>
      )}

      {loading ? (
        <Card title="건강 진단 히스토리">
          <div className="flex items-center gap-3 text-sm text-muted">
            <Spinner className="h-6 w-6 text-primary" />
            진단 기록을 불러오는 중입니다…
          </div>
        </Card>
      ) : (
        <EventsTable
          rows={data}
          onSelect={(e) => {
            setSelected(e)
            setOpen(true)
          }}
        />
      )}

      <EventDetailModal
        open={open}
        event={selected}
        onClose={() => {
          setOpen(false)
        }}
      />
    </div>
  )
}
export default EventsPage