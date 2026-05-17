import { useCallback, useEffect, useState } from 'react'
import { fetchEvents } from '../lib/eventsApi'
import type { EventRecord } from '../types/event'

export interface UseEventsState {
  data: EventRecord[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useEvents(): UseEventsState {
  const [data, setData] = useState<EventRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const rows = await fetchEvents()
      setData(rows)
    } catch (e) {
      setData([])
      setError(e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return { data, loading, error, refetch: load }
}
