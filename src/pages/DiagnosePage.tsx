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
import { useAuth } from '../hooks/useAuth'
import { usePetProfile } from '../hooks/usePetProfile'
import type { RegionId } from '../types/diagnose'

export default function DiagnosePage() {
  const { currentUser } = useAuth()
  const { pets } = usePetProfile(currentUser?.id ?? null)

  const [region, setRegion] = useState<RegionId>('eye')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null)

  const objectUrlRef = useRef<string | null>(null)
  // 업로드된 실제 File 객체 보관
  const fileRef = useRef<File | null>(null)

  const { result, loading, progress, error, diagnose, reset } = useDiagnose()

  // 첫 번째 반려동물 자동 선택
  useEffect(() => {
    if (pets.length > 0 && selectedPetId === null) {
      setSelectedPetId(Number(pets[0].id))
    }
  }, [pets, selectedPetId])

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
      fileRef.current = null
    } else {
      const url = URL.createObjectURL(input)
      objectUrlRef.current = url
      setImageUrl(url)
      fileRef.current = input
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
    fileRef.current = null
    reset()
  }

  const onReset = () => {
    onClear()
    setRegion('eye')
  }

  const onDiagnose = async () => {
    if (!imageUrl) return

    let file = fileRef.current
    // 샘플 이미지(URL)인 경우 fetch로 File 변환
    if (!file && imageUrl) {
      try {
        const res = await fetch(imageUrl)
        const blob = await res.blob()
        file = new File([blob], 'sample.jpg', { type: blob.type || 'image/jpeg' })
      } catch {
        // fetch 실패 시 진단 불가
      }
    }

    if (!file) return
    void diagnose(region, file, selectedPetId)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* 로그인 필요 안내 */}
      {!currentUser && (
        <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200">
          ⚠ 로그인하지 않아도 데모 진단은 가능합니다. 실제 저장/이력 연동은 <a href="/login" className="font-semibold underline">로그인</a> 후 사용하세요.
        </div>
      )}

      {/* Hero 카피 */}
      <Card
        title="🐾 PetScan AI 진단"
        description="반려동물의 환부 사진을 올리면 PetScan AI가 진단 후보와 보호자용 케어 가이드를 안내합니다. 밝은 곳에서 환부가 잘 보이게 촬영해 주세요."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {/* 왼쪽: 입력 */}
          <div className="space-y-5">
            {/* 반려동물 선택 */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">반려동물 선택</label>
              {!currentUser ? (
                <p className="text-sm text-slate-500">데모 모드에서는 자동으로 샘플 진단이 실행됩니다.</p>
              ) : pets.length === 0 ? (
                <p className="text-sm text-slate-500">
                  마이페이지에서 반려동물을 먼저 등록해 주세요.
                </p>
              ) : (
                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  value={selectedPetId ?? ''}
                  onChange={(e) => setSelectedPetId(Number(e.target.value))}
                  disabled={loading}
                >
                  {pets.map((p) => (
                    <option key={p.id} value={Number(p.id)}>
                      {p.name} ({p.species})
                    </option>
                  ))}
                </select>
              )}
            </div>

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
                onClick={() => void onDiagnose()}
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

            {result?.diseases && result.diseases.length > 0 && (
              <div className="space-y-3">
                {result.diseases.slice(0, 3).map((d) => (
                  <div
                    key={d.name}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-slate-900">{d.koreanName}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                          d.riskLevel === '상'
                            ? 'bg-red-100 text-red-700'
                            : d.riskLevel === '중'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        위험도 {d.riskLevel}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{d.description}</p>
                    <p className="mt-1 text-xs text-slate-500">💊 {d.treatment}</p>
                  </div>
                ))}
              </div>
            )}

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
