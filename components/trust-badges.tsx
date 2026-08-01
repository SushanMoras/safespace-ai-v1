import { Lock, LogOut, Database, Eye } from 'lucide-react'

const badges = [
  { icon: Eye, label: 'Fully Anonymous', desc: 'No visibility' },
  { icon: Database, label: 'Nothing Stored Externally', desc: 'Your device only' },
  { icon: LogOut, label: 'Exit Instantly, Anytime', desc: 'You control it' },
]

export function TrustBadges() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10" role="list" aria-label="Privacy guarantees">
      {badges.map(({ icon: Icon, label, desc }) => (
        <div
          key={label}
          role="listitem"
          className="flex items-center gap-2.5 bg-white/70 backdrop-blur-sm border border-border/50 rounded-2xl px-5 py-3 shadow-sm"
        >
          <div className="w-8 h-8 rounded-xl bg-secondary/60 flex items-center justify-center flex-shrink-0">
            <Icon className="w-4 h-4 text-accent-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground leading-tight">{label}</p>
            <p className="text-xs text-muted-foreground leading-tight">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
