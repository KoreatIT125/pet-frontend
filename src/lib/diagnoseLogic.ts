import type { ClassProb, DiagnosisResult, RegionId, RegionMeta } from '../types/diagnose'

export const EYE_CLASSES = ['결막염', '각막궤양', '정상'] as const
export const SKIN_CLASSES = ['농포', '태선화', '정상'] as const

export const REGIONS: Record<RegionId, RegionMeta> = {
  eye: { id: 'eye', label: '안구 질환', classes: EYE_CLASSES },
  skin: { id: 'skin', label: '피부 질환', classes: SKIN_CLASSES },
}

export const ACTION_PLAN_DB: Record<string, string> = {
  결막염: '눈 충혈과 눈꼽이 관찰됩니다. 청결을 유지하고 증상이 지속되면 안약을 처방받으세요.',
  각막궤양: '각막 손상이 의심되는 위험 상태입니다. 즉시 동물병원에 내원하여 정밀 검사를 받으세요.',
  농포: '피부 화농성 염증이 보입니다. 환부를 핥지 못하게 넥카라를 씌우고 약용 샴푸 사용을 권장합니다.',
  태선화:
    '만성 피부염으로 피부가 두꺼워진 상태입니다. 알러지 유발 요인을 차단하고 장기적인 피부 관리가 필요합니다.',
  정상: '특이 소견이 발견되지 않았습니다. 주기적인 모니터링을 통해 건강을 관리해 주세요.',
}

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function splitRemainderTwoWay(remain: number): [number, number] {
  if (remain <= 0) return [0, 0]
  if (remain < 0.2) {
    const half = Math.round((remain / 2) * 10) / 10
    return [half, Math.round((remain - half) * 10) / 10]
  }
  const lo = 0.05 * remain
  const hi = 0.95 * remain
  const r1 = Math.round((lo + Math.random() * (hi - lo)) * 10) / 10
  const r2 = Math.round((remain - r1) * 10) / 10
  if (r2 < 0) return [Math.round((remain - 0.1) * 10) / 10, 0.1]
  return [r1, r2]
}

/**
 * V2.0 PoC `predict()`의 React 포팅. 실제 모델 연결 시 본 함수를 API 호출로 교체.
 */
export function mockPredict(region: RegionId): DiagnosisResult {
  const meta = REGIONS[region]
  const classes = [...meta.classes]
  const pred = pickRandom(classes)

  const topPct = pred === '정상'
    ? Math.round((95 + Math.random() * 4.9) * 10) / 10
    : Math.round((80 + Math.random() * 18) * 10) / 10

  const others = classes.filter((c) => c !== pred)
  const remain = Math.round((100 - topPct) * 10) / 10
  const [r1, r2] = splitRemainderTwoWay(remain)

  const probabilities: ClassProb[] = [
    { label: pred, probability: topPct / 100 },
    { label: others[0], probability: r1 / 100 },
    { label: others[1], probability: r2 / 100 },
  ].sort((a, b) => b.probability - a.probability)

  return {
    region,
    prediction: pred,
    confidence: topPct,
    probabilities,
    actionPlan: ACTION_PLAN_DB[pred] ?? '',
    timestamp: new Date().toISOString(),
  }
}
