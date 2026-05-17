export function formatEventType(type: string): string {
  const map: Record<string, string> = {
    DISEASE_ALERT: '눈/피부',
    BEHAVIOR_ANOMALY: '관절/행동',
  }
  return map[type] ?? type
}
export function formatSymptomDescription(type: string, sev: string): string {
  const map: Record<string, string> = {
    DISEASE_ALERT: '결막염·피부 발적의 증상이 감지되었습니다.',
    BEHAVIOR_ANOMALY: '활동량 감소와 행동 변화가 관찰되었습니다.',
  }
  return map[type] ?? `의심 증상이 감지되었습니다. (${formatSeverity(sev)})`
}
export function formatSeverity(sev: string): string {
  const map: Record<string, string> = {
    HIGH: '주의',
    MEDIUM: '주의',
    LOW: '양호',
  }
  return map[sev] ?? sev
}
