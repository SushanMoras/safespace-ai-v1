import { Lock, LogOut, Database, Eye } from 'lucide-react'

const badges = [
  { icon: Eye, label: 'Fully Anonymous', desc: 'No login required' },
  { icon: Database, label: 'Nothing Stored', desc: 'Data stays local' },
  { icon: LogOut, label: 'Exit Instantly', desc: 'One tap, anytime' },
]

export function TrustBadges() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 w-full max-w-2xl mx-auto" role="list" aria-label="Privacy guarantees">
      {badges.map(({ icon: Icon, label, desc }) => (
        <div
          key={label}
          role="listitem"
          className="flex flex-col items-center justify-center text-center bg-white/70 backdrop-blur-sm border border-border/50 rounded-2xl px-6 py-5 shadow-sm"
        >
          <div className="w-10 h-10 rounded-lg bg-secondary/60 flex items-center justify-center mb-3">
            <Icon className="w-5 h-5 text-accent-foreground" />
          </div>
          <p className="text-sm font-semibold text-foreground leading-snug">{label}</p>
          <p className="text-xs text-muted-foreground leading-snug mt-1">{desc}</p>
        </div>
      ))}
    </div>
  )
}
