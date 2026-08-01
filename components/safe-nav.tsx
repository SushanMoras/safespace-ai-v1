'use client'
import { Shield } from 'lucide-react'
import Link from 'next/link'

export function SafeNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border/60">
      <Link href="/" className="flex items-center gap-2 group" aria-label="SafeSpace AI home">
        <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
          <Shield className="w-4 h-4 text-primary" />
        </div>
        <span className="font-semibold text-foreground tracking-tight">SafeSpace AI</span>
      </Link>
    </header>
  )
}