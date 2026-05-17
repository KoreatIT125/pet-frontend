import type { PolygonPoint } from '../types/polygon'
import { getApiBaseUrl } from './apiBase'

export async function savePolygon(coordinates: PolygonPoint[]): Promise<void> {
  const base = getApiBaseUrl()
  if (!base) {
    await new Promise((r) => setTimeout(r, 400))
    console.info('[demo] polygon saved', coordinates)
    return
  }

  const res = await fetch(`${base}/polygon`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ coordinates }),
  })

  if (!res.ok) {
    throw new Error(`폴리곤 저장에 실패했습니다. (${res.status})`)
  }
}
