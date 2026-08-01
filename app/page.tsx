import Link from 'next/link'
import { ArrowRight, Shield, MessageSquare, Activity, HeartHandshake, FileCheck } from 'lucide-react'
import { SafeNav } from '@/components/safe-nav'
import { ParticleBackground } from '@/components/particle-background'
import { TrustBadges } from '@/components/trust-badges'

export default function LandingPage() {
  return (
    <main className="relative min-h-screen flex flex-col">
      <ParticleBackground />
      <SafeNav />

      {/* Hero */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-12 page-enter">
        {/* Soft glow behind hero — warm amber/teal */}
        <div
          aria-hidden="true"
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full"
          style={{
            background:
              'radial-gradient(ellipse at center, oklch(0.75 0.12 70 / 0.2) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />

        <div className="relative max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left side: badge, headline, subtext, CTA */}
          <div className="flex flex-col">
            {/* Statistics badge */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 bg-muted/40 border border-border/40 rounded-full px-3.5 py-1.5">
                <span className="text-xs text-foreground">1 in 3 women worldwide experience online harassment</span>
                <span className="text-xs text-muted-foreground">· UN Women, 2023</span>
              </div>
            </div>

            {/* Main badge */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 rounded-full px-4 py-1.5">
                <span className="text-xs font-semibold text-primary tracking-wide">SafeSpace AI — Confidential & Judgment-Free</span>
              </div>
            </div>

            {/* Headline with gradient */}
            <h1 className="font-serif text-5xl sm:text-6xl leading-tight text-balance mb-8">
              <span className="text-white">You don&apos;t have to carry this alone.</span>
              <br />
              <span className="bg-gradient-to-r from-teal-400 to-amber-400 bg-clip-text text-transparent">We help you understand it,</span>
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-orange-300 bg-clip-text text-transparent">document it, and act.</span>
            </h1>

            {/* Subtext */}
            <p className="text-lg text-muted-foreground leading-relaxed text-balance mb-8">
              SafeSpace AI gives you a private space to evaluate online harassment, talk to a supportive AI companion, and generate a clear incident report — entirely on your terms.
            </p>

            {/* CTA Button */}
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2.5 w-fit bg-gradient-to-r from-teal-500 to-amber-400 text-foreground rounded-2xl px-8 py-4 text-base font-semibold shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-[1.02] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Shield className="w-4 h-4" />
              Start Your Assessment
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Trust badges below CTA */}
            <div className="mt-8">
              <TrustBadges />
            </div>
          </div>

          {/* Right side: 2x2 feature grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Feature 1: Paste & Analyze */}
            <div className="bg-card border border-border/50 rounded-2xl p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 group">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mb-3 group-hover:bg-primary/30 transition-colors">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Paste & Analyze</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Share what happened. Our AI reads for patterns of harassment, stalking, and threats in seconds.</p>
            </div>

            {/* Feature 2: Real Risk Scoring */}
            <div className="bg-card border border-border/50 rounded-2xl p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 group">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mb-3 group-hover:bg-primary/30 transition-colors">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Real Risk Scoring</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Get a clear severity score and escalation pattern, not vague warnings.</p>
            </div>

            {/* Feature 3: Talk It Through */}
            <div className="bg-card border border-border/50 rounded-2xl p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 group">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mb-3 group-hover:bg-primary/30 transition-colors">
                <HeartHandshake className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Talk It Through</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">A trauma-informed AI companion helps you process what happened, at your pace.</p>
            </div>

            {/* Feature 4: Ready-to-File Reports */}
            <div className="bg-card border border-border/50 rounded-2xl p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 group">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mb-3 group-hover:bg-primary/30 transition-colors">
                <FileCheck className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Ready-to-File Reports</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Export a structured incident report and get routed to the right helpline.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-6 md:gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center mb-2">
                <span className="text-sm font-semibold text-primary">1</span>
              </div>
              <p className="text-xs font-medium text-foreground text-center max-w-[80px]">Share what happened</p>
            </div>

            {/* Connector line */}
            <div className="flex-1 h-0.5 bg-border/40 mb-6 hidden md:block" />

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center mb-2">
                <span className="text-sm font-semibold text-primary">2</span>
              </div>
              <p className="text-xs font-medium text-foreground text-center max-w-[80px]">Get instant analysis</p>
            </div>

            {/* Connector line */}
            <div className="flex-1 h-0.5 bg-border/40 mb-6 hidden md:block" />

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center mb-2">
                <span className="text-sm font-semibold text-primary">3</span>
              </div>
              <p className="text-xs font-medium text-foreground text-center max-w-[80px]">Get support & act</p>
            </div>
          </div>
        </div>
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
