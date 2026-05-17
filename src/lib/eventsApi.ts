import type { EventRecord } from '../types/event'
import { getApiBaseUrl } from './apiBase'

function normalizeEventsPayload(data: unknown): EventRecord[] {
  if (Array.isArray(data)) return data as EventRecord[]
  if (data && typeof data === 'object' && 'events' in data) {
    const inner = (data as { events: unknown }).events
    if (Array.isArray(inner)) return inner as EventRecord[]
  }
  if (data && typeof data === 'object' && 'eventId' in (data as object)) {
    return [data as EventRecord]
  }
  return []
}

export async function fetchEvents(): Promise<EventRecord[]> {
  const base = getApiBaseUrl()
  const url = base ? `${base}/events` : '/mock-events.json'

  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
  })

  if (!res.ok) {
    throw new Error(`이벤트를 불러오지 못했습니다. (${res.status})`)
  }

  const json: unknown = await res.json()
  return normalizeEventsPayload(json)
}
