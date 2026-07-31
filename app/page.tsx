import Link from 'next/link'
import { ArrowRight, Heart } from 'lucide-react'
import { SafeNav } from '@/components/safe-nav'
import { ParticleBackground } from '@/components/particle-background'
import { TrustBadges } from '@/components/trust-badges'

export default function LandingPage() {
  return (
    <main className="relative min-h-screen flex flex-col">
      <ParticleBackground />
      <SafeNav />

      {/* Hero */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 page-enter">
        {/* Soft glow behind hero */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full"
          style={{
            background:
              'radial-gradient(ellipse at center, oklch(0.82 0.1 290 / 0.25) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        <div className="relative max-w-2xl mx-auto">
          {/* Statistics badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-1.5 bg-muted/40 border border-border/40 rounded-full px-3.5 py-1.5">
              <span className="text-xs text-foreground">1 in 3 women worldwide experience online harassment</span>
              <span className="text-xs text-muted-foreground">· UN Women, 2023</span>
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-8">
            <Heart className="w-3.5 h-3.5 text-primary fill-primary/40" />
            <span className="text-xs font-medium text-primary tracking-wide">You deserve support</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-foreground leading-tight text-balance mb-6">
            {"You're not alone."}
            <br />
            <span className="text-primary">{"Let's figure this out"}</span>
            <br />
            together.
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed text-balance mb-10 max-w-md mx-auto">
            SafeSpace AI helps you understand the severity of online harassment, identify warning
            signs, and take calm, informed next steps — privately and without judgment.
          </p>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2.5 bg-primary text-primary-foreground rounded-2xl px-8 py-4 text-base font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-primary/35 hover:scale-[1.02] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Start Safely
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <TrustBadges />
      </section>

      {/* Footer note */}
      <footer className="relative z-10 text-center pb-8 px-6">
        <p className="text-xs text-muted-foreground">
          SafeSpace AI is a supportive tool, not a substitute for professional legal or psychological help.
        </p>
      </footer>
    </main>
  )
}
