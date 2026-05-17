import { useEffect, useState } from 'react'
import type { Pet, PetSpecies } from '../../types/pet'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'

interface PetEditModalProps {
  open: boolean
  pet: Pet | null  // null이면 신규 등록
  onClose: () => void
  onSubmit: (input: {
    name: string
    species: PetSpecies
    breed: string
    birthYear?: number
  }) => void
}

const SPECIES: PetSpecies[] = ['강아지', '고양이']

export function PetEditModal({ open, pet, onClose, onSubmit }: PetEditModalProps) {
  const [name, setName] = useState('')
  const [species, setSpecies] = useState<PetSpecies>('강아지')
  const [breed, setBreed] = useState('')
  const [birthDate, setBirthDate] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    if (pet) {
      setName(pet.name)
      setSpecies(pet.species)
      setBreed(pet.breed)
      setBirthDate(pet.birthYear ? `${pet.birthYear}-01-01` : '')
    } else {
      setName('')
      setSpecies('강아지')
      setBreed('')
      setBirthDate('')
    }
    setError(null)
  }, [open, pet])



  const submit = () => {
    if (!name.trim()) {
      setError('이름을 입력해 주세요.')
      return
    }
    const yr = Number(birthDate.substring(0, 4))
    onSubmit({
      name: name.trim(),
      species,
      breed: breed.trim(),
      birthYear: birthDate && Number.isFinite(yr) ? yr : undefined,
    })
  }

  return (
    <Modal open={open} title={pet ? `${pet.name} 정보 수정` : '반려동물 등록'} onClose={onClose}>
      <div className="grid gap-4">
        {error && (
          <div className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800 ring-1 ring-rose-200">
            {error}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="이름 *" value={name} onChange={(e) => setName(e.target.value)} placeholder="예: 코코" />

          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-medium text-slate-700">종</label>
            <div className="flex gap-2">
              {SPECIES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpecies(s)}
                  className={`flex-1 rounded-xl border-2 px-3 py-2 text-sm font-bold transition ${
                    species === s
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="품종" value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="말티즈, 푸들 등" />
          <Input
            label="출생일"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button variant="primary" onClick={submit}>
            {pet ? '수정 저장' : '등록'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
