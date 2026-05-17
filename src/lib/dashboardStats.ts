import type { EventRecord } from '../types/event'

export interface SiteSummary {
  siteName: string
  total: number
  high: number
  lastAt?: string
}

export interface DailyCount {
  date: string
  count: number
}

export interface TypeShare {
  name: string
  value: number
}

function toDayKey(iso: string): string {
  return iso.slice(0, 10)
}

export function buildSiteSummaries(events: EventRecord[]): SiteSummary[] {
  const bySite = new Map<string, { total: number; high: number; last?: string }>()

  for (const e of events) {
    const cur = bySite.get(e.siteName) ?? { total: 0, high: 0, last: undefined }
    cur.total += 1
    if (e.severity === 'HIGH') cur.high += 1
    if (!cur.last || e.timestamp > cur.last) cur.last = e.timestamp
    bySite.set(e.siteName, cur)
  }

  return [...bySite.entries()]
    .map(([siteName, v]) => ({
      siteName,
      total: v.total,
      high: v.high,
      lastAt: v.last,
    }))
    .sort((a, b) => b.total - a.total)
}

export function buildDailyCounts(events: EventRecord[], days = 7): DailyCount[] {
  const today = new Date()
  const keys: string[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    keys.push(d.toISOString().slice(0, 10))
  }

  const counts = new Map<string, number>()
  for (const k of keys) counts.set(k, 0)

  for (const e of events) {
    const k = toDayKey(e.timestamp)
    if (counts.has(k)) counts.set(k, (counts.get(k) ?? 0) + 1)
  }

  return keys.map((date) => ({ date, count: counts.get(date) ?? 0 }))
}

export function buildTypeShares(events: EventRecord[]): TypeShare[] {
  const m = new Map<string, number>()
  for (const e of events) {
    m.set(e.eventType, (m.get(e.eventType) ?? 0) + 1)
  }
  return [...m.entries()].map(([name, value]) => ({ name, value }))
}
