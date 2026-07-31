'use client'

import dynamic from 'next/dynamic'
import { PageTransition } from './page-transition'

// Load the panic system only on the client, after the App Router is fully
// initialized. This prevents the "Router action dispatched before
// initialization" HMR race that occurs when client components that attach
// global window listeners are included in the server-rendered HTML.
const PanicModeProvider = dynamic(
  () => import('./panic-mode-context').then((m) => m.PanicModeProvider),
  { ssr: false }
)

const PanicFAB = dynamic(
  () => import('./panic-fab').then((m) => m.PanicFAB),
  { ssr: false }
)

const FakeNotesApp = dynamic(
  () => import('./fake-notes-app').then((m) => m.FakeNotesApp),
  { ssr: false }
)

export function PanicShell({ children }: { children: React.ReactNode }) {
  return (
    <PanicModeProvider>
      <PageTransition>{children}</PageTransition>
      <PanicFAB />
      <FakeNotesApp />
    </PanicModeProvider>
  )
}
