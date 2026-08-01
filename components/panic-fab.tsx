'use client'

import { EyeOff } from 'lucide-react'
import { usePanic } from './panic-mode-context'

export function PanicFAB() {
  const { isPanic, triggerPanic } = usePanic()

  if (isPanic) return null

  return (
    <button
      onClick={triggerPanic}
      aria-label="Exit quickly — panic mode"
      style={{ zIndex: 9998 }}
      className="
        fixed bottom-6 right-6
        h-11 rounded-full
        pl-3 pr-4
        bg-secondary border border-primary/30
        flex items-center gap-2
        text-sm font-medium text-muted-foreground hover:text-foreground
        hover:bg-secondary/80 hover:border-primary/60
        transition-colors duration-150
        panic-pulse
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60
      "
    >
      <EyeOff className="w-4 h-4 shrink-0" aria-hidden="true" />
      <span>Exit Quickly</span>
    </button>
  )
}
