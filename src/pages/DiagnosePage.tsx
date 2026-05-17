import { useEffect, useRef, useState } from 'react'
import { Microscope, RotateCcw } from 'lucide-react'

import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ImageUpload } from '../components/diagnose/ImageUpload'
import { JsonResultPanel } from '../components/diagnose/JsonResultPanel'
import { PredictionResult } from '../components/diagnose/PredictionResult'
import { RegionRadio } from '../components/diagnose/RegionRadio'
import { SampleGallery } from '../components/diagnose/SampleGallery'
import { useDiagnose } from '../hooks/useDiagnose'
import type { RegionId } from '../types/diagnose'

export default function DiagnosePage() {
  const [region, setRegion] = useState<RegionId>('eye')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  // 업로드된 File을 보관 (실제 모델 연동 시 fetch에 그대로 사용)
  const objectUrlRef = useRef<string | null>(null)

  const { result, loading, progress, error, diagnose, reset } = useDiagnose()

  // 메모리 누수 방지: ObjectURL 정리
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    }
  }, [])

  const onPickImage = (input: File | string) => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
    if (typeof input === 'string') {
      setImageUrl(input)
    } else {
      const url = URL.createObjectURL(input)
      objectUrlRef.current = url
      setImageUrl(url)
    }
    reset()
  }

  const onPickSample = (src: string, sampleRegion: RegionId) => {
    setRegion(sampleRegion)
    onPickImage(src)
  }

  const onClear = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
    setImageUrl(null)
    reset()
  }

  const onReset = () => {
    onClear()
    setRegion('eye')
  }

  const onDiagnose = () => {
    if (!imageUrl) return
    void diagnose(region)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Hero 카피 */}
      <Card
        title="🐾 PetScan AI 진단"
        description="반려동물의 환부 사진을 올리면 PetScan AI가 진단 후보와 보호자용 케어 가이드를 안내합니다. 밝은 곳에서 환부가 잘 보이게 촬영해 주세요."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {/* 왼쪽: 입력 */}
          <div className="space-y-5">
            <ImageUpload
              imageUrl={imageUrl}
              onPick={onPickImage}
              onClear={onClear}
              disabled={loading}
            />

            <RegionRadio value={region} onChange={setRegion} disabled={loading} />

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                onClick={onDiagnose}
                disabled={!imageUrl || loading}
                loading={loading}
                leftIcon={<Microscope className="h-4 w-4" />}
              >
                진단하기
              </Button>
              <Button
                variant="ghost"
                onClick={onReset}
                disabled={loading}
                leftIcon={<RotateCcw className="h-4 w-4" />}
              >
                초기화
              </Button>
            </div>

            {loading && (
              <div className="space-y-1">
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-blue-500 transition-all"
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500">진단 중… {Math.round(progress * 100)}%</p>
              </div>
            )}

            <SampleGallery onPick={onPickSample} disabled={loading} />

            <div className="rounded-xl border-2 border-slate-300 bg-slate-50 p-4">
              <p className="text-sm font-bold text-slate-900">촬영 팁</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                <li>흔들림 없이 초점 맞추기</li>
                <li>그림자 최소화 · 플래시 직사광선은 피하기</li>
                <li>눈/피부만이 아니라 주변 맥락이 조금 보이면 판독에 도움</li>
              </ul>
            </div>
          </div>

          {/* 오른쪽: 결과 */}
          <div className="space-y-5">
            <div>
              <h3 className="mb-3 text-base font-bold text-slate-900">
                질환 후보 및 확신도 (Top 3)
              </h3>
              <PredictionResult items={result?.probabilities ?? []} />
            </div>

            <JsonResultPanel result={result} />

            {error && (
              <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-800 ring-1 ring-rose-200">
                {error}
              </div>
            )}

            <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-900 ring-1 ring-amber-200">
              ⚠ AI 진단은 참고용이며, 확진과 치료는 반드시 수의사에게 받으시기 바랍니다.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
