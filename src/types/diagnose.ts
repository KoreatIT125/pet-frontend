export type RegionId = 'eye' | 'skin'

export interface RegionMeta {
  id: RegionId
  label: string
  classes: readonly string[]
}

export interface ClassProb {
  label: string
  probability: number  // 0~1
}

/** 백엔드 DiseaseResponse 구조 */
export interface DiseaseItem {
  name: string
  koreanName: string
  description: string
  treatment: string
  riskLevel: '상' | '중' | '하'
  score: number  // 0~1
}

export interface DiagnosisResult {
  region: RegionId
  prediction: string       // 최상위 질환 한국어명
  confidence: number       // 0~100
  probabilities: ClassProb[]  // Top-N, 내림차순
  actionPlan: string
  timestamp: string
  diseases?: DiseaseItem[] // 백엔드 원본 응답 (전체 목록)
}
