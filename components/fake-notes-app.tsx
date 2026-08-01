'use client'

import { useRef, useCallback, useState, useEffect } from 'react'
import { usePanic } from './panic-mode-context'

const NOTES = [
  {
    id: 1,
    title: 'Grocery List',
    preview: 'Milk, eggs, bread, bananas, yogurt...',
    body: 'Milk\nEggs (free range)\nBread — sourdough\nBananas\nYogurt\nOlive oil\nGarlic\nOnions\nChicken breast\nLemons',
    date: 'Today, 11:04 AM',
    active: true,
  },
  {
    id: 2,
    title: 'Meeting Notes',
    preview: 'Q3 review — action items from last...',
    body: 'Q3 review meeting\n\nAction items:\n– Finalise budget sheet by Friday\n– Coordinate with design on new deck\n– Follow up with Priya re: timeline\n\nNext meeting: Thursday 3pm',
    date: 'Yesterday',
    active: false,
  },
  {
    id: 3,
    title: 'Recipe Ideas',
    preview: 'Dal makhani, pasta bake, overnight...',
    body: 'Dal makhani — soak lentils overnight\nOne-pot pasta bake\nOvernight oats with chia\nZucchini fritters\nMango lassi',
    date: 'Tue',
    active: false,
  },
  {
    id: 4,
    title: 'Books to Read',
    preview: 'Atomic Habits, Pachinko, The Midnight...',
    body: 'Atomic Habits – James Clear\nPachinko – Min Jin Lee\nThe Midnight Library\nProject Hail Mary\nThe Year of Magical Thinking',
    date: 'Mon',
    active: false,
  },
]

// Inner component — only rendered when isPanic=true, so hooks are always called consistently
function NotesUI() {
  const { exitPanic } = usePanic()
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Controls whether the dot / tooltip are in their "revealed" state (first 4 s)
  const [revealed, setRevealed] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setRevealed(false), 4000)
    return () => clearTimeout(t)
  }, [])

  // Press-and-hold 2 s to exit
  const handleSecretPointerDown = useCallback(() => {
    holdTimer.current = setTimeout(() => {
      exitPanic()
    }, 2000)
  }, [exitPanic])

  const handleSecretPointerUp = useCallback(() => {
    if (holdTimer.current) clearTimeout(holdTimer.current)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#f2f2f7',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
        display: 'flex',
        flexDirection: 'column',
        color: '#1c1c1e',
      }}
      role="application"
      aria-label="Notes"
    >
      {/* Status bar spacer */}
      <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />

      {/* App header */}
      <header
        style={{
          padding: '12px 20px 8px',
          background: '#f2f2f7',
          borderBottom: '1px solid rgba(0,0,0,0.12)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Notes icon SVG — yellow notepad */}
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
            <rect width="34" height="34" rx="8" fill="#FFD60A" />
            <rect x="9" y="10" width="16" height="2" rx="1" fill="#1c1c1e" opacity="0.7" />
            <rect x="9" y="15" width="12" height="2" rx="1" fill="#1c1c1e" opacity="0.5" />
            <rect x="9" y="20" width="10" height="2" rx="1" fill="#1c1c1e" opacity="0.4" />
          </svg>
          <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>Notes</span>
        </div>
        <button
          style={{
            fontSize: 15,
            color: '#ff9f0a',
            fontWeight: 600,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
          }}
        >
          New
        </button>
      </header>

      {/* Search bar */}
      <div style={{ padding: '10px 16px', background: '#f2f2f7' }}>
        <div
          style={{
            background: '#e5e5ea',
            borderRadius: 10,
            padding: '7px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            color: '#8e8e93',
            fontSize: 15,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.867-3.834zm-5.242 1.156a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
          </svg>
          Search
        </div>
      </div>

      {/* Section label */}
      <div
        style={{
          padding: '4px 20px 6px',
          fontSize: 13,
          fontWeight: 600,
          color: '#8e8e93',
          textTransform: 'uppercase',
          letterSpacing: 0.4,
        }}
      >
        All iCloud
      </div>

      {/* Notes list */}
      <ul
        style={{
          flex: 1,
          overflowY: 'auto',
          listStyle: 'none',
          margin: 0,
          padding: '0 0 0 16px',
          background: '#ffffff',
          borderRadius: '12px 12px 0 0',
          boxShadow: '0 -1px 0 rgba(0,0,0,0.06)',
        }}
        role="list"
      >
        {NOTES.map((note, i) => (
          <li
            key={note.id}
            role="listitem"
            style={{
              padding: '13px 16px 13px 0',
              borderBottom: i < NOTES.length - 1 ? '1px solid rgba(0,0,0,0.08)' : 'none',
              cursor: 'default',
              background: note.active ? '#fff8e6' : 'transparent',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
              <span style={{ fontWeight: 600, fontSize: 15, color: '#1c1c1e' }}>
                {note.title}
              </span>
              <span style={{ fontSize: 12, color: '#8e8e93', flexShrink: 0, marginLeft: 8 }}>
                {note.date}
              </span>
            </div>
            <span style={{ fontSize: 13, color: '#8e8e93', display: 'block', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '90%' }}>
              {note.preview}
            </span>
          </li>
        ))}
      </ul>

      {/* Bottom toolbar */}
      <div
        style={{
          background: '#f2f2f7',
          borderTop: '1px solid rgba(0,0,0,0.12)',
          padding: '10px 20px',
          paddingBottom: 'calc(10px + env(safe-area-inset-bottom, 0px))',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#8e8e93',
          fontSize: 12,
        }}
      >
        <span>4 Notes</span>

        {/* Secret exit dot — visible for 4 s, then fades to near-invisible. Hold 2 s to return. */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Tooltip — auto-dismisses after 4 s via CSS */}
          {revealed && (
            <div
              className="tooltip-dismiss"
              style={{
                position: 'absolute',
                bottom: 'calc(100% + 10px)',
                left: '50%',
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap',
                background: 'rgba(28,28,30,0.88)',
                color: '#ffffff',
                fontSize: 12,
                fontWeight: 500,
                padding: '5px 10px',
                borderRadius: 8,
                pointerEvents: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
              }}
              role="tooltip"
            >
              Hold here to return
              {/* Arrow */}
              <span style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderTop: '5px solid rgba(28,28,30,0.88)',
              }} />
            </div>
          )}

          <button
            onPointerDown={handleSecretPointerDown}
            onPointerUp={handleSecretPointerUp}
            onPointerLeave={handleSecretPointerUp}
            aria-label="compose"
            className={revealed ? undefined : 'dot-fade-out'}
            style={{
              // During reveal: prominent dot, 20px, clearly tappable
              // After: faded out by the CSS animation
              width: revealed ? 20 : 10,
              height: revealed ? 20 : 10,
              borderRadius: '50%',
              background: revealed ? '#636366' : '#e5e5ea',
              border: revealed ? '2px solid rgba(0,0,0,0.18)' : 'none',
              cursor: 'default',
              padding: 0,
              flexShrink: 0,
              opacity: revealed ? 1 : undefined,
              transition: 'width 0.4s ease, height 0.4s ease, background 0.4s ease',
              // Expand hit area without changing visual size after reveal
              boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#ff9f0a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="New note"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// Outer shell — conditionally mounts NotesUI so hooks inside are always stable
export function FakeNotesApp() {
  const { isPanic } = usePanic()
  if (!isPanic) return null
  return <NotesUI />
}
