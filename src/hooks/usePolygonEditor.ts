import { useCallback, useState } from 'react'
import type { PolygonPoint } from '../types/polygon'

export interface UsePolygonEditorResult {
  points: PolygonPoint[]
  addPoint: (p: PolygonPoint) => void
  undoLast: () => void
  clear: () => void
  setPoints: (next: PolygonPoint[]) => void
}

export function usePolygonEditor(initial: PolygonPoint[] = []): UsePolygonEditorResult {
  const [points, setPoints] = useState<PolygonPoint[]>(initial)

  const addPoint = useCallback((p: PolygonPoint) => {
    setPoints((prev) => [...prev, { x: Math.round(p.x), y: Math.round(p.y) }])
  }, [])

  const undoLast = useCallback(() => {
    setPoints((prev) => prev.slice(0, -1))
  }, [])

  const clear = useCallback(() => setPoints([]), [])

  return { points, addPoint, undoLast, clear, setPoints }
}
