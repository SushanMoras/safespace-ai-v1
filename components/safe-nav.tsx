'use client'

import { Shield, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { usePanic } from './panic-mode-context'

export function SafeNav() {
  const { triggerPanic } = usePanic()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border/60">
      <Link href="/" className="flex items-center gap-2 group" aria-label="SafeSpace AI home">
        <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
          <Shield className="w-4 h-4 text-primary" />
        </div>
        <span className="font-semibold text-foreground tracking-tight">SafeSpace AI</span>
      </Link>

      <button
        aria-label="Exit quickly"
        onClick={triggerPanic}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground border border-border/60 rounded-full px-3 py-1.5 hover:bg-muted transition-all"
      >
        <EyeOff className="w-3.5 h-3.5" />
        <span>Exit Quickly</span>
      </button>
    </header>
  )
}
