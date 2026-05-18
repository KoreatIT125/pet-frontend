import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { decodeJwt } from '../lib/jwtUtils'

// OAuth2 로그인 후 백엔드에서 리다이렉트되는 페이지

const TOKEN_KEY = 'accessToken'
const MEMBER_ID_KEY = 'petcare:memberId'

export default function OAuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('accessToken')

    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    localStorage.setItem(TOKEN_KEY, token)

    const payload = decodeJwt(token)
    if (payload) {
      localStorage.setItem(MEMBER_ID_KEY, String(payload.memberId))
    }
    // 로그인 성공후 메인 페이지로 이동
    navigate('/', { replace: true })
  }, [navigate])

  return <div>로그인 처리 중...</div>
}