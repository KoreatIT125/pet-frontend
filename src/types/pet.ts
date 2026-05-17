export type PetSpecies = '강아지' | '고양이'

export interface Pet {
  id: string
  ownerId: string        // User.id
  name: string
  species: PetSpecies
  breed: string
  birthYear?: number     // YYYY
  weightKg?: number
  photoUrl?: string      // dataURL 또는 외부 URL
  notes?: string
  createdAt: string
}
