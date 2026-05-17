export type EventSeverity = 'HIGH' | 'MEDIUM' | 'LOW' | string

export type PetEventType =
  | 'DISEASE_ALERT'
  | 'BEHAVIOR_ANOMALY'
  | string

export interface EventRecord {
  eventId: number
  siteName: string
  eventType: PetEventType
  timestamp: string
  snapshotUrl: string
  severity: EventSeverity
}
