import { useCallback, useEffect, useState } from 'react'
import {
  ensureSeed,
  loadSession,
  loadUsers,
  saveSession,
  saveUsers,
  uid,
} from '../lib/authStorage'
import type { PublicUser, Session, User } from '../types/auth'

function toPublic(u: User | undefined): PublicUser | null {
  if (!u) return null
  const { password: _pw, ...rest } = u
  void _pw
  return rest
}

export interface UseAuthResult {
  currentUser: PublicUser | null
  loading: boolean
  login: (username: string, password: string) => Promise<PublicUser>
  loginWithGoogle: () => Promise<PublicUser>
  signup: (input: { username: string; password: string; name: string }) => Promise<PublicUser>
  logout: () => void
  updateProfile: (patch: Partial<Omit<User, 'id' | 'password' | 'createdAt'>>) => void
}

export function useAuth(): UseAuthResult {
  const [session, setSession] = useState<Session | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  // 최초 1회 seed + 로드
  useEffect(() => {
    ensureSeed()
    setUsers(loadUsers())
    setSession(loadSession())
    setLoading(false)
  }, [])

  const persistUsers = useCallback((next: User[]) => {
    setUsers(next)
    saveUsers(next)
  }, [])

  const persistSession = useCallback((next: Session | null) => {
    setSession(next)
    saveSession(next)
  }, [])

  const login = useCallback(
    async (username: string, password: string): Promise<PublicUser> => {
      const norm = username?.trim()?.toLowerCase() ?? ''
      const found = users.find(
        (u) => u.username?.toLowerCase?.() === norm && u.password === password,
      )
      if (!found) {
        throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.')
      }
      const next: Session = { userId: found.id, loggedInAt: new Date().toISOString() }
      persistSession(next)
      return toPublic(found) as PublicUser
    },
    [users, persistSession],
  )

  const signup = useCallback(
    async ({
      username,
      password,
      name,
    }: {
      username: string
      password: string
      name: string
    }): Promise<PublicUser> => {
      const norm = username?.trim()?.toLowerCase() ?? ''
      if (users.some((u) => u.username?.toLowerCase?.() === norm)) {
        throw new Error('이미 등록된 아이디입니다.')
      }
      const newUser: User = {
        id: uid('user'),
        username: norm,
        password: password?.trim() ?? '',
        name: name?.trim() || norm,
        createdAt: new Date().toISOString(),
      }
      const nextUsers = [...users, newUser]
      persistUsers(nextUsers)
      const next: Session = { userId: newUser.id, loggedInAt: new Date().toISOString() }
      persistSession(next)
      return toPublic(newUser) as PublicUser
    },
    [users, persistSession, persistUsers],
  )

  const logout = useCallback(() => {
    persistSession(null)
  }, [persistSession])

  const updateProfile = useCallback(
    (patch: Partial<Omit<User, 'id' | 'password' | 'createdAt'>>) => {
      if (!session) return
      const next = users.map((u) => (u.id === session.userId ? { ...u, ...patch } : u))
      persistUsers(next)
    },
    [session, users, persistUsers],
  )

  const currentUser = session ? toPublic(users.find((u) => u.id === session.userId)) : null

  const loginWithGoogle = useCallback(async (): Promise<PublicUser> => {
    // 간단한 로컬 시뮬레이션: Google에서 받은 사용자 정보를 흉내냄
    const googleEmail = 'google@petcare.kr'
    const googleName = '구글 사용자'
    const norm = googleEmail?.trim()?.toLowerCase() ?? ''
    const googleUsername = googleEmail.split('@')[0] ?? ''
    let found = users.find(
      (u) => u.username?.toLowerCase?.() === googleUsername || u.email?.toLowerCase?.() === norm,
    )
    if (!found) {
      const newUser: User = {
        id: uid('user'),
        username: googleUsername,
        email: norm,
        password: '',
        name: googleName,
        createdAt: new Date().toISOString(),
      }
      const nextUsers = [...users, newUser]
      persistUsers(nextUsers)
      found = newUser
    }
    const next: Session = { userId: found.id, loggedInAt: new Date().toISOString() }
    persistSession(next)
    return toPublic(found) as PublicUser
  }, [users, persistUsers, persistSession])

  return { currentUser, loading, login, loginWithGoogle, signup, logout, updateProfile }
}
