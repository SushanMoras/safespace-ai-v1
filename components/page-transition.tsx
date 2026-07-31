'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [transitioning, setTransitioning] = useState(false)
  const prevPathname = useRef(pathname)

  useEffect(() => {
    if (pathname === prevPathname.current) {
      // Same route (e.g. initial mount) — just show content
      setDisplayChildren(children)
      return
    }
    // New route: trigger exit → swap → enter
    prevPathname.current = pathname
    setTransitioning(true)
    const t = setTimeout(() => {
      setDisplayChildren(children)
      setTransitioning(false)
    }, 180)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Keep children fresh when on the same route
  useEffect(() => {
    if (!transitioning) setDisplayChildren(children)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children])

  return (
    <div
      style={{
        opacity: transitioning ? 0 : 1,
        transform: transitioning ? 'translateY(8px)' : 'translateY(0)',
        transition: 'opacity 0.22s ease, transform 0.22s ease',
      }}
    >
      {displayChildren}
    </div>
  )
}
