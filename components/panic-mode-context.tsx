'use client'

import { createContext, useContext, useEffect, useRef, useCallback, useState } from 'react'

interface PanicContextValue {
  isPanic: boolean
  triggerPanic: () => void
  exitPanic: () => void
}

const PanicContext = createContext<PanicContextValue>({
  isPanic: false,
  triggerPanic: () => {},
  exitPanic: () => {},
})

export function usePanic() {
  return useContext(PanicContext)
}

export function PanicModeProvider({ children }: { children: React.ReactNode }) {
  const [isPanic, setIsPanic] = useState(false)
  const escPressCount = useRef(0)
  const escTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const triggerPanic = useCallback(() => {
    setIsPanic(true)
  }, [])

  const exitPanic = useCallback(() => {
    setIsPanic(false)
  }, [])

  // Keyboard shortcut: Escape × 3 within 1.5 s  OR  Ctrl+Shift+X
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ctrl+Shift+X — trigger or exit
      if (e.ctrlKey && e.shiftKey && e.key === 'X') {
        e.preventDefault()
        setIsPanic((prev) => !prev)
        return
      }

      // Escape × 3 — trigger only (exit via secret dot)
      if (e.key === 'Escape') {
        escPressCount.current += 1
        if (escTimer.current) clearTimeout(escTimer.current)

        if (escPressCount.current >= 3) {
          escPressCount.current = 0
          triggerPanic()
          return
        }

        escTimer.current = setTimeout(() => {
          escPressCount.current = 0
        }, 1500)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (escTimer.current) clearTimeout(escTimer.current)
    }
  }, [triggerPanic])

  return (
    <PanicContext.Provider value={{ isPanic, triggerPanic, exitPanic }}>
      {children}
    </PanicContext.Provider>
  )
}
