import { useCallback, useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import type { Pet, PetSpecies } from '../types/pet'

interface BackendPet {
  id: number
  name: string
  species: 'Dog' | 'Cat'
  breed: string | null
  birth_date: string | null
  memberId: number
}

function toFrontendPet(p: BackendPet, ownerId: string): Pet {
  const speciesMap: Record<string, PetSpecies> = { Dog: '강아지', Cat: '고양이' }
  let birthYear: number | undefined
  if (p.birth_date) {
    birthYear = new Date(p.birth_date).getFullYear()
  }
  return {
    id: String(p.id),
    ownerId,
    name: p.name,
    species: speciesMap[p.species] ?? '강아지',
    breed: p.breed ?? '',
    birthYear,
    createdAt: p.birth_date ?? new Date().toISOString(),
  }
}

export interface UsePetProfileResult {
  pets: Pet[]
  loading: boolean
  add: (input: Omit<Pet, 'id' | 'ownerId' | 'createdAt'>) => Promise<void>
  update: (id: string, patch: Partial<Pet>) => Promise<void>
  remove: (id: string) => void
}

export function usePetProfile(ownerId: string | null): UsePetProfileResult {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!ownerId) {
      setPets([])
      return
    }
    setLoading(true)
    axiosInstance
      .get<BackendPet[]>('/pets', { params: { memberId: Number(ownerId) } })
      .then((res) => setPets(res.data.map((p) => toFrontendPet(p, ownerId))))
      .catch(() => setPets([]))
      .finally(() => setLoading(false))
  }, [ownerId])

  const add = useCallback(
    async (input: Omit<Pet, 'id' | 'ownerId' | 'createdAt'>) => {
      if (!ownerId) return
      const speciesMap: Record<string, string> = { 강아지: 'Dog', 고양이: 'Cat' }
      const birthDate = input.birthYear ? `${input.birthYear}-01-01T00:00:00` : null
      const { data } = await axiosInstance.post<BackendPet>('/pets', {
        name: input.name,
        species: speciesMap[input.species] ?? 'Dog',
        memberId: Number(ownerId),
        breed: input.breed ?? '',
        birth_date: birthDate,
      })
      setPets((prev) => [...prev, toFrontendPet(data, ownerId)])
    },
    [ownerId],
  )

  const update = useCallback(
    async (id: string, patch: Partial<Pet>) => {
      if (!ownerId) return
      const birthDate = patch.birthYear ? `${patch.birthYear}-01-01T00:00:00` : null
      const { data } = await axiosInstance.put<BackendPet>(`/pets/${id}`, {
        breed: patch.breed ?? '',
        birth_date: birthDate,
      })
      setPets((prev) => prev.map((p) => (p.id === id ? toFrontendPet(data, ownerId) : p)))
    },
    [ownerId],
  )

  const remove = useCallback((id: string) => {
    // 백엔드 DELETE API 미구현 → 로컬 상태에서만 제거
    setPets((prev) => prev.filter((p) => p.id !== id))
  }, [])

  return { pets, loading, add, update, remove }
}
