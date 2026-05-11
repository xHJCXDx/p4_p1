export type Level = 'Principiante' | 'Intermedio' | 'Avanzado'
export type Modality = 'Presencial' | 'Virtual' | 'Híbrido'
export type Technology = 'React' | 'Angular' | 'Vue' | 'Node' | 'Python' | 'Java'

export const COUNTRIES = ['Argentina', 'Chile', 'Uruguay', 'México', 'España'] as const
export const LEVELS: Level[] = ['Principiante', 'Intermedio', 'Avanzado']
export const MODALITIES: Modality[] = ['Presencial', 'Virtual', 'Híbrido']
export const TECHNOLOGIES: Technology[] = ['React', 'Angular', 'Vue', 'Node', 'Python', 'Java']

export interface Participante {
  id: number
  nombre: string
  email: string
  edad: number
  pais: string
  modalidad: Modality
  tecnologias: Technology[]
  nivel: Level
  aceptaTerminos: boolean
}

export type Action =
  | { type: 'GET_PARTICIPANTES'; payload: Participante[] }
  | { type: 'AGREGAR'; payload: Participante }
  | { type: 'ELIMINAR'; payload: number }
  | { type: 'EDITAR'; payload: Participante }
  | { type: 'SET'; payload: Participante[] }
  | { type: 'RESET'; payload: Participante[] }
