'use client'

import { useEffect, useRef, useState } from 'react'

interface RiskGaugeProps {
  value: number | null // 0-100 or null for empty state
}

function getZone(value: number) {
  if (value <= 40) return { label: 'Low Risk', color: 'var(--gauge-safe)', textColor: 'text-teal-400' }
  if (value <= 70) return { label: 'Moderate Risk', color: 'var(--gauge-warn)', textColor: 'text-amber-400' }
  return { label: 'High Risk', color: 'var(--gauge-risk)', textColor: 'text-red-400' }
}

const DURATION = 900 // ms — count-up duration

export function RiskGauge({ value }: RiskGaugeProps) {
  const isEmpty = value === null
  const [displayed, setDisplayed] = useState(0)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)

  // Animate counter from 0 → value whenever value changes
  useEffect(() => {
    if (isEmpty) {
      setDisplayed(0)
      return
    }
    const target = value!
    // Cancel any running animation
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    startRef.current = null

    function step(ts: number) {
      if (startRef.current === null) startRef.current = ts
      const elapsed = ts - startRef.current
      const progress = Math.min(elapsed / DURATION, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayed(Math.round(eased * target))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step)
      }
    }
    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [value, isEmpty])

  const displayValue = isEmpty ? 0 : displayed
  const zone = isEmpty ? null : getZone(value!)  // zone color based on final value, not animated

  // SVG arc parameters
  const r = 68
  const cx = 88
  const cy = 88
  const startAngle = 210
  const sweepAngle = 240
  const circumference = 2 * Math.PI * r
  const arcLength = (sweepAngle / 360) * circumference
  const fillLength = isEmpty ? 0 : (displayValue / 100) * arcLength

  const toRad = (d: number) => (d * Math.PI) / 180

  const startRad = toRad(startAngle)
  const endRad = toRad(startAngle + sweepAngle)
  const fillEndRad = toRad(startAngle + (sweepAngle * displayValue) / 100)

  const arcPath = (fromRad: number, toRad: number, radius: number) => {
    const x1 = cx + radius * Math.cos(fromRad)
    const y1 = cy + radius * Math.sin(fromRad)
    const x2 = cx + radius * Math.cos(toRad)
    const y2 = cy + radius * Math.sin(toRad)
    const large = Math.abs(toRad - fromRad) > Math.PI ? 1 : 0
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`
  }

  return (
    <div
      className="flex flex-col items-center gap-3"
      aria-label={`Risk level gauge: ${isEmpty ? 'no data' : `${value} out of 100, ${zone?.label}`}`}
    >
      <div className="relative" style={{ width: 176, height: 176 }}>
        <svg width={176} height={176} viewBox="0 0 176 176" aria-hidden="true">
          {/* Background track */}
          <path
            d={arcPath(startRad, endRad, r)}
            fill="none"
            stroke="var(--gauge-empty)"
            strokeWidth={14}
            strokeLinecap="round"
          />
          {/* Filled arc — no CSS transition needed since rAF drives it */}
          {!isEmpty && displayValue > 0 && (
            <path
              d={arcPath(startRad, fillEndRad, r)}
              fill="none"
              stroke={zone?.color}
              strokeWidth={14}
              strokeLinecap="round"
            />
          )}
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center mt-4">
          {isEmpty ? (
            <span className="text-4xl font-bold text-muted-foreground/30">--</span>
          ) : (
            <span
              className="text-4xl font-bold tabular-nums"
              style={{ color: zone?.color }}
            >
              {displayValue}
            </span>
          )}
          <span className="text-xs text-muted-foreground mt-0.5 font-medium">Risk Level</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: 'var(--gauge-safe)' }} />
          Safe (0–40)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: 'var(--gauge-warn)' }} />
          Moderate (41–70)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: 'var(--gauge-risk)' }} />
          High (71–100)
        </span>
      </div>

      {!isEmpty && zone && (
        <span className={`text-sm font-semibold ${zone.textColor}`}>{zone.label}</span>
      )}
    </div>
  )
}
