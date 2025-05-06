import { atom } from 'jotai'

export const polarisIdAtom = atom<string | null>(
  typeof window !== 'undefined' ? localStorage.getItem('polarisId') : null
)