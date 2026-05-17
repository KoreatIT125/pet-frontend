import { useCallback, useEffect, useState } from 'react'
import { loadPets, savePets, uid } from '../lib/authStorage'
import type { Pet } from '../types/pet'

export interface UsePetProfileResult {
  pets: Pet[]
  add: (input: Omit<Pet, 'id' | 'ownerId' | 'createdAt'>) => void
  update: (id: string, patch: Partial<Pet>) => void
  remove: (id: string) => void
}

/**
 * 특정 ownerId(=현재 로그인 유저)에 속하는 펫만 노출.
 * 변경 사항은 전체 storage에 머지하여 저장.
 */
export function usePetProfile(ownerId: string | null): UsePetProfileResult {
  const [allPets, setAllPets] = useState<Pet[]>(() => loadPets())

  useEffect(() => {
    savePets(allPets)
  }, [allPets])

  const pets = ownerId ? allPets.filter((p) => p.ownerId === ownerId) : []

  const add = useCallback(
    (input: Omit<Pet, 'id' | 'ownerId' | 'createdAt'>) => {
      if (!ownerId) return
      const newPet: Pet = {
        ...input,
        id: uid('pet'),
        ownerId,
        createdAt: new Date().toISOString(),
      }
      setAllPets((prev) => [...prev, newPet])
    },
    [ownerId],
  )

  const update = useCallback(
    (id: string, patch: Partial<Pet>) => {
      if (!ownerId) return
      setAllPets((prev) =>
        prev.map((p) => (p.id === id && p.ownerId === ownerId ? { ...p, ...patch } : p)),
      )
    },
    [ownerId],
  )

  const remove = useCallback(
    (id: string) => {
      if (!ownerId) return
      setAllPets((prev) => prev.filter((p) => !(p.id === id && p.ownerId === ownerId)))
    },
    [ownerId],
  )

  return { pets, add, update, remove }
}
