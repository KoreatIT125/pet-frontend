export interface User {
  id: string
  username: string
  email?: string
  password: string   // ⚠ mock 전용 - 실제 서비스에서는 절대 평문 보관 금지
  name: string
  phone?: string
  createdAt: string
}

export interface Session {
  userId: string
  loggedInAt: string
}

// 화면에서 노출할 안전한 사용자 정보 (password 제외)
export type PublicUser = Omit<User, 'password'>
