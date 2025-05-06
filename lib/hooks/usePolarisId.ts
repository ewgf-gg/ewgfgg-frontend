import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { polarisIdAtom } from '@/app/state/atoms/polarisAtoms'

export function usePolarisId() {
  const [polarisId, setPolarisIdAtom] = useAtom(polarisIdAtom)

  // Sync to localStorage whenever polarisId changes
  useEffect(() => {
    if (typeof window === 'undefined') return

    if (polarisId) {
      localStorage.setItem('polarisId', polarisId)
    } else {
      localStorage.removeItem('polarisId')
    }
  }, [polarisId])

  // Hook API
  const setPolarisId = (id: string | null) => {
    setPolarisIdAtom(id)
  }

  return {
    polarisId,
    setPolarisId,
  }
}