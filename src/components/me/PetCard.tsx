import { Pencil, Trash2 } from 'lucide-react'
import type { Pet } from '../../types/pet'

function petAge(birthYear?: number): string {
  if (!birthYear || birthYear <= 1900) return '나이 정보 없음'
  const y = new Date().getFullYear() - birthYear
  return `${y}살`
}

export function PetCard({
  pet,
  onEdit,
  onRemove,
}: {
  pet: Pet
  onEdit: () => void
  onRemove: () => void
}) {
  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      <div className="aspect-[4/3] bg-slate-100">
        {pet.photoUrl ? (
          <img src={pet.photoUrl} alt={pet.name} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl">🐾</div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold text-slate-900">{pet.name}</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              {pet.species} · {pet.breed || '품종 미입력'}
            </p>
          </div>
          <div className="flex flex-shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={onEdit}
              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="수정"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-rose-50 hover:text-rose-700"
              aria-label="삭제"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg bg-slate-50 p-2">
            <dt className="text-slate-500">나이</dt>
            <dd className="mt-0.5 font-semibold text-slate-900">{petAge(pet.birthYear)}</dd>
          </div>
          <div className="rounded-lg bg-slate-50 p-2">
            <dt className="text-slate-500">몸무게</dt>
            <dd className="mt-0.5 font-semibold text-slate-900">
              {pet.weightKg !== undefined ? `${pet.weightKg} kg` : '—'}
            </dd>
          </div>
        </dl>

        {pet.notes && (
          <p className="mt-3 line-clamp-3 rounded-lg bg-amber-50 p-2 text-xs leading-5 text-amber-900 ring-1 ring-amber-200">
            {pet.notes}
          </p>
        )}
      </div>
    </article>
  )
}
