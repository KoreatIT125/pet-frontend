import { useCallback, useState } from 'react'
import type { DiagnosisResult, RegionId } from '../types/diagnose'
import { mockPredict } from '../lib/diagnoseLogic'

export interface UseDiagnoseState {
  result: DiagnosisResult | null
  loading: boolean
  progress: number
  error: string | null
  diagnose: (region: RegionId) => Promise<void>
  reset: () => void
}

/**
 * 진단 진입점. V2.0의 progress(0/0.1.../1.0) 단계 표시까지 유지.
 * 실 모델 연결 시 mockPredict 자리만 fetch 호출로 교체.
 */
export function useDiagnose(): UseDiagnoseState {
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const diagnose = useCallback(async (region: RegionId) => {
    setLoading(true)
    setError(null)
    setResult(null)
    setProgress(0)
    try {
      for (let step = 1; step <= 10; step++) {
        await new Promise((r) => setTimeout(r, 100))
        setProgress(step / 10)
      }
      const r = mockPredict(region)
      setResult(r)
    } catch (e) {
      setError(e instanceof Error ? e.message : '진단에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
    setProgress(0)
  }, [])

  return { result, loading, progress, error, diagnose, reset }
}
