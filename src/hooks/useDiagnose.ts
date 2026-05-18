import { useCallback, useState } from 'react'
import type { DiagnosisResult, DiseaseItem, RegionId } from '../types/diagnose'
import { mockPredict } from '../lib/diagnoseLogic'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

function mapToResult(
  diseases: DiseaseItem[],
  region: RegionId,
): DiagnosisResult {
  const sorted = [...diseases].sort((a, b) => b.score - a.score)
  const top = sorted[0]

  return {
    region,
    prediction: top?.koreanName ?? '정상',
    confidence: Math.round((top?.score ?? 0) * 100),
    probabilities: sorted.map((d) => ({
      label: d.koreanName,
      probability: d.score,
    })),
    actionPlan: top ? `${top.description}\n\n치료: ${top.treatment}` : '이상 소견이 없습니다.',
    timestamp: new Date().toISOString(),
    diseases: sorted,
  }
}

export interface UseDiagnoseState {
  result: DiagnosisResult | null
  loading: boolean
  progress: number
  error: string | null
  diagnose: (region: RegionId, file: File, petId?: number | null) => Promise<void>
  reset: () => void
}

export function useDiagnose(): UseDiagnoseState {
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const diagnose = useCallback(
    async (region: RegionId, file: File, petId?: number | null) => {
      setLoading(true)
      setError(null)
      setResult(null)
      setProgress(0)

      // 진행률 시뮬레이션 (업로드 단계)
      const timer = setInterval(() => {
        setProgress((p) => (p < 0.85 ? p + 0.05 : p))
      }, 300)

      try {
        const token = localStorage.getItem('accessToken')
        if (!token || !petId) {
          setProgress(1)
          setResult(mockPredict(region))
          return
        }

        const formData = new FormData()
        formData.append('image', file)

        const typeParam = region === 'eye' ? 'Eye' : 'Skin'
        const url = `${API_BASE}/diagnosis?type=${typeParam}&petId=${petId}`

        const res = await fetch(url, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        })

        if (!res.ok) {
          const text = await res.text().catch(() => '')
          throw new Error(`진단 요청 실패 (${res.status})${text ? ': ' + text : ''}`)
        }

        const data: DiseaseItem[] = await res.json()
        setProgress(1)
        setResult(mapToResult(data, region))
      } catch (e) {
        if (e instanceof Error && /401|403/.test(e.message)) {
          setProgress(1)
          setResult(mockPredict(region))
        } else {
          setError(e instanceof Error ? e.message : '진단에 실패했습니다.')
        }
      } finally {
        clearInterval(timer)
        setLoading(false)
      }
    },
    [],
  )

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
    setProgress(0)
  }, [])

  return { result, loading, progress, error, diagnose, reset }
}
