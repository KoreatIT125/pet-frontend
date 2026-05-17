import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { OwnerCard } from '../components/me/OwnerCard'
import { PetCard } from '../components/me/PetCard'
import { PetEditModal } from '../components/me/PetEditModal'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useAuth } from '../hooks/useAuth'
import { usePetProfile } from '../hooks/usePetProfile'
import type { Pet } from '../types/pet'

export default function MyPage() {
  const { currentUser, logout, updateProfile } = useAuth()
  const navigate = useNavigate()
  const { pets, add, update, remove } = usePetProfile(currentUser?.id ?? null)

  const [editing, setEditing] = useState<Pet | null>(null)
  const [open, setOpen] = useState(false)

  if (!currentUser) {
    return null  // RequireAuth가 처리
  }

  const onAdd = () => {
    setEditing(null)
    setOpen(true)
  }
  const onEdit = (pet: Pet) => {
    setEditing(pet)
    setOpen(true)
  }
  const onRemove = (pet: Pet) => {
    if (window.confirm(`${pet.name}을(를) 삭제하시겠어요?`)) remove(pet.id)
  }
  const onSubmit = (input: Parameters<typeof add>[0]) => {
    if (editing) update(editing.id, input)
    else add(input)
    setOpen(false)
  }

  const onLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <OwnerCard user={currentUser} onUpdate={updateProfile} onLogout={onLogout} />

      <Card
        title={`내 반려동물 (${pets.length})`}
        description="등록한 아이의 정보가 진단·리포트에 함께 사용됩니다."
        headerRight={
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={onAdd}>
            반려동물 등록
          </Button>
        }
      >
        {pets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <p className="text-3xl">🐾</p>
            <p className="mt-2 text-sm font-semibold text-slate-700">아직 등록된 반려동물이 없어요</p>
            <p className="mt-1 text-xs text-slate-500">우상단 "반려동물 등록" 버튼으로 추가해 주세요.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {pets.map((p) => (
              <PetCard key={p.id} pet={p} onEdit={() => onEdit(p)} onRemove={() => onRemove(p)} />
            ))}
          </div>
        )}
      </Card>

      <PetEditModal
        open={open}
        pet={editing}
        onClose={() => setOpen(false)}
        onSubmit={onSubmit}
      />
    </div>
  )
}
