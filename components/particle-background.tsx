'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  id: number
  x: number
  size: number
  duration: number
  delay: number
  opacity: number
  color: string
}

export function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const particles: Particle[] = Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 6 + 4,
      duration: Math.random() * 18 + 12,
      delay: Math.random() * 20,
      opacity: Math.random() * 0.35 + 0.1,
      color: i % 3 === 0 ? '#c4b5fd' : i % 3 === 1 ? '#99f6e4' : '#ddd6fe',
    }))

    const container = containerRef.current
    if (!container) return

    // Clear existing
    container.innerHTML = ''

    particles.forEach((p) => {
      const el = document.createElement('div')
      el.className = 'particle'
      el.style.cssText = `
        left: ${p.x}%;
        bottom: -20px;
        width: ${p.size}px;
        height: ${p.size}px;
        background: ${p.color};
        opacity: ${p.opacity};
        animation-duration: ${p.duration}s;
        animation-delay: -${p.delay}s;
        filter: blur(1px);
      `
      container.appendChild(el)
    })
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
    />
  )
}
