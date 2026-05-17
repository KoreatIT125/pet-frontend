import type { Pet } from '../types/pet'
import type { Session, User } from '../types/auth'

const USERS_KEY = 'petcare:users:v1'
const PETS_KEY = 'petcare:pets:v1'
const SESSION_KEY = 'petcare:session:v1'
const SEED_FLAG_KEY = 'petcare:seeded:v1'

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function uid(prefix: string = 'id'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

// ─────────────────────────────
// 5명 임의 회원 + 펫 seed
// ─────────────────────────────
const SEED_USERS: User[] = [
  {
    id: 'user-mango',
    username: 'mango',
    email: 'mango@petcare.kr',
    password: 'pw1234',
    name: '김민지',
    phone: '010-1234-1001',
    createdAt: '2026-04-01T09:00:00.000Z',
  },
  {
    id: 'user-junpark',
    username: 'junpark',
    email: 'junpark@petcare.kr',
    password: 'pw1234',
    name: '박서준',
    phone: '010-1234-1002',
    createdAt: '2026-04-02T09:00:00.000Z',
  },
  {
    id: 'user-sualee',
    username: 'sualee',
    email: 'sualee@petcare.kr',
    password: 'pw1234',
    name: '이수아',
    phone: '010-1234-1003',
    createdAt: '2026-04-05T09:00:00.000Z',
  },
  {
    id: 'user-doyoun',
    username: 'doyoun',
    email: 'doyoun@petcare.kr',
    password: 'pw1234',
    name: '최도윤',
    phone: '010-1234-1004',
    createdAt: '2026-04-08T09:00:00.000Z',
  },
  {
    id: 'user-haneul',
    username: 'haneul',
    email: 'haneul@petcare.kr',
    password: 'pw1234',
    name: '정하늘',
    phone: '010-1234-1005',
    createdAt: '2026-04-12T09:00:00.000Z',
  },
]

const SEED_PETS: Pet[] = [
  {
    id: 'pet-mango-1',
    ownerId: 'user-mango',
    name: '망고',
    species: '강아지',
    breed: '푸들',
    birthYear: 2022,
    weightKg: 4.1,
    photoUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&q=80',
    notes: '귀 청소 주기적 필요. 알러지성 피부 경향.',
    createdAt: '2026-04-01T09:00:00.000Z',
  },
  {
    id: 'pet-junpark-1',
    ownerId: 'user-junpark',
    name: '나비',
    species: '고양이',
    breed: '코리안숏헤어',
    birthYear: 2021,
    weightKg: 4.8,
    photoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80',
    notes: '결막염 이력 1회 (2025년 11월). 정상 회복.',
    createdAt: '2026-04-02T09:00:00.000Z',
  },
  {
    id: 'pet-sualee-1',
    ownerId: 'user-sualee',
    name: '보리',
    species: '강아지',
    breed: '포메라니안',
    birthYear: 2020,
    weightKg: 3.2,
    photoUrl: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=400&q=80',
    notes: '슬개골 탈구 1단계. 점프 자제 권고.',
    createdAt: '2026-04-05T09:00:00.000Z',
  },
  {
    id: 'pet-sualee-2',
    ownerId: 'user-sualee',
    name: '콩이',
    species: '강아지',
    breed: '시츄',
    birthYear: 2019,
    weightKg: 5.5,
    photoUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80',
    notes: '안구건조증 관리 중. 인공눈물 1일 2회.',
    createdAt: '2026-04-05T09:05:00.000Z',
  },
  {
    id: 'pet-doyoun-1',
    ownerId: 'user-doyoun',
    name: '초코',
    species: '강아지',
    breed: '시바견',
    birthYear: 2023,
    weightKg: 9.8,
    photoUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80',
    notes: '활동량 많음. 발바닥 패드 자주 확인.',
    createdAt: '2026-04-08T09:00:00.000Z',
  },
  {
    id: 'pet-haneul-1',
    ownerId: 'user-haneul',
    name: '미카',
    species: '고양이',
    breed: '러시안블루',
    birthYear: 2020,
    weightKg: 4.2,
    photoUrl: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400&q=80',
    notes: '예방접종 완료. 다음 건강검진 5월 예정.',
    createdAt: '2026-04-12T09:00:00.000Z',
  },
  {
    id: 'pet-haneul-2',
    ownerId: 'user-haneul',
    name: '라떼',
    species: '고양이',
    breed: '먼치킨',
    birthYear: 2022,
    weightKg: 3.6,
    photoUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&q=80',
    notes: '식이 알러지 의심 - 프리미엄 사료 급여 중.',
    createdAt: '2026-04-12T09:05:00.000Z',
  },
]

// ─────────────────────────────
// Storage 액세스
// ─────────────────────────────

export function ensureSeed(): void {
  if (typeof window === 'undefined') return
  if (window.localStorage.getItem(SEED_FLAG_KEY) === '1') return
  window.localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS))
  window.localStorage.setItem(PETS_KEY, JSON.stringify(SEED_PETS))
  window.localStorage.setItem(SEED_FLAG_KEY, '1')
}

export function loadUsers(): User[] {
  if (typeof window === 'undefined') return []
  return safeParse<User[]>(window.localStorage.getItem(USERS_KEY), [])
}

export function saveUsers(users: User[]): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function loadPets(): Pet[] {
  if (typeof window === 'undefined') return []
  return safeParse<Pet[]>(window.localStorage.getItem(PETS_KEY), [])
}

export function savePets(pets: Pet[]): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(PETS_KEY, JSON.stringify(pets))
}

export function loadSession(): Session | null {
  if (typeof window === 'undefined') return null
  return safeParse<Session | null>(window.localStorage.getItem(SESSION_KEY), null)
}

export function saveSession(session: Session | null): void {
  if (typeof window === 'undefined') return
  if (session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  else window.localStorage.removeItem(SESSION_KEY)
}

/** 모든 데이터 초기화 (seed 다시 적용). 디버그용. */
export function resetAll(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(USERS_KEY)
  window.localStorage.removeItem(PETS_KEY)
  window.localStorage.removeItem(SESSION_KEY)
  window.localStorage.removeItem(SEED_FLAG_KEY)
  ensureSeed()
}
