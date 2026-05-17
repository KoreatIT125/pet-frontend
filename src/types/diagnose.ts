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

export interface DiagnosisResult {
  region: RegionId
  prediction: string
  confidence: number    // 0~100
  probabilities: ClassProb[]  // Top-3, 내림차순
  actionPlan: string
  timestamp: string
}
