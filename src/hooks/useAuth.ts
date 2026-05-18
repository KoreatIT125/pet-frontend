import { useCallback, useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import { decodeJwt, isTokenExpired } from '../lib/jwtUtils'
import type { PublicUser } from '../types/auth'

const TOKEN_KEY = 'accessToken'
const MEMBER_ID_KEY = 'petcare:memberId'

function readStoredUser(): PublicUser | null {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token || isTokenExpired(token)) return null
  const payload = decodeJwt(token)
  if (!payload) return null
  return {
    id: String(payload.memberId),
    username: payload.userId,
    name: payload.userName,
    createdAt: '',
  }
}

export interface UseAuthResult {
  currentUser: PublicUser | null
  loading: boolean
  login: (username: string, password: string) => Promise<PublicUser>
  loginWithGoogle: () => Promise<PublicUser>
  signup: (input: { username: string; password: string; name: string }) => Promise<PublicUser>
  logout: () => void
  updateProfile: (patch: Partial<Omit<PublicUser, 'id' | 'createdAt'>>) => void
}

export function useAuth(): UseAuthResult {
  const [currentUser, setCurrentUser] = useState<PublicUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setCurrentUser(readStoredUser())
    setLoading(false)
  }, [])

  const login = useCallback(async (username: string, password: string): Promise<PublicUser> => {
    const { data: token } = await axiosInstance.post<string>('/member/login', {
      userId: username.trim(),
      password,
    })
    localStorage.setItem(TOKEN_KEY, token)
    const payload = decodeJwt(token)
    if (!payload) throw new Error('토큰 파싱에 실패했습니다.')
    localStorage.setItem(MEMBER_ID_KEY, String(payload.memberId))
    const user: PublicUser = {
      id: String(payload.memberId),
      username: payload.userId,
      name: payload.userName,
      createdAt: '',
    }
    setCurrentUser(user)
    return user
  }, [])

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
      await axiosInstance.post('/member/signup', {
        userId: username.trim().toLowerCase(),
        userName: name.trim(),
        password,
        role: 'USER',
      })
      // 회원가입 성공 후 자동 로그인
      return login(username.trim().toLowerCase(), password)
    },
    [login],
  )

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(MEMBER_ID_KEY)
    setCurrentUser(null)
  }, [])

  const updateProfile = useCallback(
    (patch: Partial<Omit<PublicUser, 'id' | 'createdAt'>>) => {
      setCurrentUser((prev) => (prev ? { ...prev, ...patch } : prev))
    },
    [],
  )

  const loginWithGoogle = useCallback(async (): Promise<PublicUser> => {
    throw new Error('구글 로그인은 현재 지원되지 않습니다.')
  }, [])

  return { currentUser, loading, login, loginWithGoogle, signup, logout, updateProfile }
}
