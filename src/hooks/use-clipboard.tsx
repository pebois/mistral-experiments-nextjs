import { useCallback } from 'react'

interface Hook {
  copy: (value: string) => Promise<boolean>
}

export function useCopyToClipboard(): Hook {
  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (!navigator?.clipboard) {
      console.warn('unsupported')
      return false
    }
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (error) {
      return false
    }
  }, [])
  return { copy }
}
