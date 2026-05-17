import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../hooks/useAuth'

export function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agree, setAgree] = useState(false)

  const [errors, setErrors] = useState<{
    name?: string
    username?: string
    password?: string
    password2?: string
    agree?: string
  }>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const validate = (): boolean => {
    const next: typeof errors = {}
    const safeName = name?.trim() ?? ''
    const safeUsername = username?.trim() ?? ''
    const safePassword = password ?? ''
    const safePassword2 = password2 ?? ''
    if (safeName.length < 2) next.name = '이름은 2자 이상 입력해 주세요.'
    if (!safeUsername) next.username = '아이디를 입력해 주세요.'
    else if (!/^[a-z0-9]{4,12}$/.test(safeUsername)) {
      next.username = '아이디는 4~12자, 소문자와 숫자만 사용할 수 있습니다.'
    }
    if (!safePassword) next.password = '비밀번호를 입력해 주세요.'
    else if (safePassword.length < 4) next.password = '비밀번호는 4자 이상으로 설정해 주세요.'
    if (safePassword !== safePassword2) next.password2 = '비밀번호가 일치하지 않습니다.'
    if (!agree) next.agree = '약관에 동의해 주세요.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    if (!validate()) return
    setSubmitting(true)
    const normalizedName = name?.trim() ?? ''
    const normalizedUsername = username?.trim()?.toLowerCase() ?? ''
    const normalizedPassword = password?.trim() ?? ''
    try {
      await signup({ username: normalizedUsername, password: normalizedPassword, name: normalizedName })
      navigate('/me', { replace: true })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : '회원가입에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="회원가입"
      subtitle="PetScan AI와 함께 우리 아이 건강을 따뜻하게 돌보세요."
      footer={
        <p>
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            로그인
          </Link>
        </p>
      }
    >
      <form className="space-y-5" onSubmit={onSubmit} noValidate>
        {submitError && (
          <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800 ring-1 ring-rose-200" role="alert">
            {submitError}
          </div>
        )}

        <Input
          name="name"
          type="text"
          autoComplete="name"
          label="이름"
          placeholder="홍길동"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />

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
            <label htmlFor="signup-password" className="block text-sm font-medium text-slate-700">
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
            id="signup-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 ${
              errors.password ? 'border-red-300' : 'border-slate-200'
            }`}
          />
          {errors.password && (
            <p className="text-xs font-medium text-red-600" role="alert">
              {errors.password}
            </p>
          )}
          <p className="text-xs text-slate-500">아이디는 4~12자 이내, 소문자와 숫자만 사용할 수 있습니다.</p>
        </div>

        <Input
          name="password2"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          label="비밀번호 확인"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          error={errors.password2}
        />

        <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/40"
          />
          <span>서비스 이용약관 및 개인정보 처리방침에 동의합니다.</span>
        </label>
        {errors.agree && <p className="text-xs font-medium text-red-600">{errors.agree}</p>}

        <Button type="submit" variant="secondary" className="w-full py-3" loading={submitting}>
          회원가입
        </Button>

        <p className="text-xs text-slate-500 text-center">
          ⚠ 본 데모는 브라우저 localStorage에 계정을 저장합니다. 실서비스에서는 절대 평문 저장 금지.
        </p>
      </form>
    </AuthLayout>
  )
}
