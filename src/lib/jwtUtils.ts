export interface JwtPayload {
  memberId: number
  userId: string
  userName: string
  exp: number
}

/** JWT를 디코딩하여 payload를 반환합니다. 실패 시 null 반환. */
export function decodeJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null
    // base64url → base64
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )
    return JSON.parse(jsonPayload) as JwtPayload
  } catch {
    return null
  }
}

/** JWT 만료 여부를 반환합니다. */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJwt(token)
  if (!payload) return true
  return Date.now() / 1000 > payload.exp
}
