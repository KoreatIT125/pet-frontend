import { useEffect, useState } from 'react'
import { LogOut, Save, User as UserIcon } from 'lucide-react'
import type { PublicUser } from '../../types/auth'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'

interface OwnerCardProps {
  user: PublicUser
  onUpdate: (patch: { name?: string }) => void
  onLogout: () => void
}

export function OwnerCard({ user, onUpdate, onLogout }: OwnerCardProps) {
  const [name, setName] = useState(user.name)
  const [savedAt, setSavedAt] = useState<string | null>(null)

  useEffect(() => {
    setName(user.name)
  }, [user.id, user.name])

  const onSave = () => {
    onUpdate({ name: name.trim() })
    setSavedAt(new Date().toLocaleTimeString('ko-KR'))
    setTimeout(() => setSavedAt(null), 2000)
  }

  return (
    <Card
      title="내 정보"
      description="보호자 프로필 — 진단 결과·리포트에 함께 노출됩니다."
      headerRight={
        <Button variant="ghost" leftIcon={<LogOut className="h-4 w-4" />} onClick={onLogout}>
          로그아웃
        </Button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
        <div className="flex items-start gap-4">
          <div className="grid h-16 w-16 flex-shrink-0 place-items-center rounded-2xl bg-blue-50 ring-1 ring-blue-200">
            <UserIcon className="h-7 w-7 text-blue-700" />
          </div>
          <div className="min-w-0">
            <div className="text-sm text-slate-500">아이디 (변경 불가)</div>
            <div className="truncate text-base font-semibold text-slate-900">{user.username ?? user.email}</div>
            <div className="mt-1 text-xs text-slate-500">
              가입일 {new Date(user.createdAt).toLocaleDateString('ko-KR')}
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="이름" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Button variant="primary" leftIcon={<Save className="h-4 w-4" />} onClick={onSave}>
          저장
        </Button>
        {savedAt && <span className="text-xs text-emerald-700">저장됨 · {savedAt}</span>}
      </div>
    </Card>
  )
}
