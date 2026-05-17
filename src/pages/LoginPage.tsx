import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../hooks/useAuth'

const SAMPLE_ACCOUNTS = [
  { username: 'mango', name: '김민지' },
  { username: 'junpark', name: '박서준' },
  { username: 'sualee', name: '이수아' },
  { username: 'doyoun', name: '최도윤' },
  { username: 'haneul', name: '정하늘' },
] as const

export function LoginPage() {
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const fromPath =
    (location.state as { from?: string } | null)?.from ?? '/me'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const SHOW_SAMPLE_ACCOUNTS = false

  const validate = (): boolean => {
    const next: typeof errors = {}
    const safeUsername = username?.trim() ?? ''
    const safePassword = password ?? ''
    if (!safeUsername) next.username = '아이디를 입력해 주세요.'
    if (!safePassword) next.password = '비밀번호를 입력해 주세요.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    if (!validate()) return
    setSubmitting(true)
    const normalizedUsername = username?.trim() ?? ''
    const normalizedPassword = password?.trim() ?? ''
    try {
      await login(normalizedUsername, normalizedPassword)
      navigate(fromPath, { replace: true })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : '로그인에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const fillSample = (sampleEmail: string) => {
    setUsername(sampleEmail)
    setPassword('pw1234')
    setSubmitError(null)
  }

  return (
    <AuthLayout
      title="보호자 로그인"
      subtitle="PetScan AI와 함께 반려동물을 위한 따뜻한 케어를 시작하세요."
      footer={
        <p>
          계정이 없으신가요?{' '}
          <Link to="/signup" className="font-semibold text-primary hover:underline">
            회원가입
          </Link>
        </p>
      }
    >

      <form className="space-y-5" onSubmit={onSubmit} noValidate>
        {submitError && (
          <div
            className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800 ring-1 ring-rose-200"
            role="alert"
          >
            {submitError}
          </div>
        )}

        <Input
          name="username"
          type="text"
          autoComplete="username"
          label="아이디"
          placeholder="아이디를 입력하세요"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={errors.username}
        />

        <div className="space-y-1.5">
          <div className="flex items-end justify-between gap-3">
            <label htmlFor="login-password" className="block text-sm font-medium text-slate-700">
              비밀번호
            </label>
            <button
              type="button"
              className="text-xs font-medium text-slate-500 hover:text-primary"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? '숨기기' : '표시'}
            </button>
          </div>
          <input
            id="login-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors.password ? 'border-red-300' : 'border-slate-200'
              }`}
            aria-invalid={Boolean(errors.password)}
          />
          {errors.password && (
            <p className="text-xs font-medium text-red-600" role="alert">
              {errors.password}
            </p>
          )}
        </div>

        <Button type="submit" variant="primary" className="w-full py-3" loading={submitting}>
          로그인
        </Button>

        <div className="mt-3 flex items-center justify-center gap-4 text-sm">
          <Link to="/find-id" className="text-slate-500 hover:text-primary hover:underline">
            아이디 찾기
          </Link>
          <span className="text-slate-300">·</span>
          <Link to="/find-password" className="text-slate-500 hover:text-primary hover:underline">
            비밀번호 찾기
          </Link>
        </div>

        <div className="mt-2 mb-1 flex items-center gap-3">
          <hr className="flex-1 border-slate-200" />
          <span className="text-xs text-slate-500">또는</span>
          <hr className="flex-1 border-slate-200" />
        </div>

        <Button
          type="button"
          variant="ghost"
          className="w-full py-3"
          leftIcon={
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M44.5 20H24v8.5h11.9C34 32.5 29.9 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.2 0 6 1.2 8.2 3.1l6-6C34.5 4.6 29.6 2 24 2 12.3 2 2.7 11.6 2.7 23.3S12.3 44.7 24 44.7c11 0 20-8 20-20.7 0-1.4-.2-2.6-.5-3.7z" fill="#EA4335"/>
              <path d="M6.3 14.3l7 5.1C15 16 19 14 24 14c3.2 0 6 1.2 8.2 3.1l6-6C34.5 4.6 29.6 2 24 2 16 2 9.2 6.8 6.3 14.3z" fill="#4285F4"/>
              <path d="M24 44.7c5.6 0 10.5-1.9 14.3-5.2l-6.6-5.4C29.8 34.9 27 36 24 36c-5.9 0-10.9-3.5-12.6-8.5l-7 5.1C9.2 38 16 44.7 24 44.7z" fill="#34A853"/>
              <path d="M44.5 20H24v8.5h11.9C35.1 31.2 30 36 24 36v8.7c11 0 20-8 20-20.7 0-1.4-.2-2.6-.5-3.7z" fill="#FBBC05"/>
            </svg>
          }
          onClick={async () => {
            setSubmitError(null)
            setSubmitting(true)
            try {
              await loginWithGoogle()
              navigate(fromPath, { replace: true })
            } catch (err) {
              setSubmitError(err instanceof Error ? err.message : '로그인에 실패했습니다.')
            } finally {
              setSubmitting(false)
            }
          }}
        >
          Google로 계속하기
        </Button>

        {SHOW_SAMPLE_ACCOUNTS && (
          <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
            <p className="mb-2 text-xs font-bold text-slate-700">테스트 계정</p>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_ACCOUNTS.map((s) => (
                <button
                  key={s.username}
                  type="button"
                  onClick={() => fillSample(s.username)}
                  className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-blue-50 hover:text-blue-700"
                >
                  {s.name} · {s.username}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>
    </AuthLayout>
  )
}
