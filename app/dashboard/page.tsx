'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  MessageSquareHeart,
  TrendingUp,
  Search,
  Tag,
  Clock,
  MessageSquare,
  Scale,
  ChevronDown,
  ChevronUp,
  FileText,
  Loader2,
  Phone,
  ExternalLink,
  ShieldAlert,
  Zap,
  Plus,
  X,
  AlertCircle,
  Network,
} from 'lucide-react'
import { SafeNav } from '@/components/safe-nav'
import { RiskGauge } from '@/components/risk-gauge'
import { ReportModal, type ReportData } from '@/components/report-modal'

// ─── Shared types ─────────────────────────────────────────────────────────────

interface AnalysisResult {
  severity_score: number
  category: string
  red_flags: string[]
  escalation_risk: 'low' | 'medium' | 'high'
  reasoning: string
  cross_platform_risk?: {
    same_actor_likelihood: 'low' | 'medium' | 'high'
    reasoning: string
  }
}

interface PlatformMessage {
  id: string
  platform: string
  messages: string
}

// ─── Sample Scenarios ─────────────────────────────────────────────────────────

interface SampleScenario {
  id: string
  label: string
  messages: string
}

const SAMPLE_SCENARIOS: SampleScenario[] = [
  {
    id: 'stalking',
    label: 'Stalking Scenario',
    messages: `I saw you at the coffee shop today. Do you always go there?

You look nice in that blue sweater you wore to the mall yesterday.

I've been watching your Instagram. You went to the park at 3pm on Sunday. I was there too but you didn't see me.`,
  },
  {
    id: 'blackmail',
    label: 'Blackmail Scenario',
    messages: `I have screenshots of your private messages to your ex. Send me $500 or I'm posting them.

I'm serious. You have 24 hours. Everyone at your workplace will see what you said.

I found more photos. The amount just went up to $1000. This is your final warning before I go public.`,
  },
  {
    id: 'doxxing',
    label: 'Doxxing Scenario',
    messages: `Everyone should know you're a terrible person. Here's your home address: [Address]

I'm posting your phone number, your parents' names, and where your sister works. Hope you're ready.

I've shared your info with 50 people already. This is what you deserve for what you did.`,
  },
]

// ─── Sample Scenario Dropdown ─────────────────────────────────────────────────

function SampleScenarioDropdown({
  onLoadScenario,
  loading,
}: {
  onLoadScenario: (scenario: SampleScenario) => void
  loading: boolean
}) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (scenario: SampleScenario) => {
    onLoadScenario(scenario)
    setOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground rounded-2xl px-6 py-3 font-semibold text-sm hover:bg-secondary/80 transition-all border border-border/60 hover:border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed card-glow"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Zap className="w-4 h-4" />
        Load Sample
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-56 bg-card border border-border rounded-2xl shadow-lg z-50 overflow-hidden">
          <div className="p-2">
            {SAMPLE_SCENARIOS.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => handleSelect(scenario)}
                className="w-full text-left px-4 py-3 rounded-lg text-sm hover:bg-muted/60 transition-colors text-foreground flex items-center gap-2"
              >
                <Zap className="w-3.5 h-3.5 text-primary opacity-60" />
                {scenario.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Safe Reply Suggestions ───────────────────────────────────────────────────

interface ReplyOption {
  id: string
  label: string
  description: string
  sampleWording: string
}

const REPLY_OPTIONS: ReplyOption[] = [
  {
    id: 'document',
    label: 'Document & Ignore',
    description: 'Best when the messages are one-off or low-escalation.',
    sampleWording:
      '"I am choosing not to engage. I have documented this interaction and will take action if it continues."',
  },
  {
    id: 'boundary',
    label: 'Set a Firm Boundary',
    description: 'Use when you want the person to know their behaviour is not acceptable.',
    sampleWording:
      '"This kind of message is not something I will respond to. Please do not contact me again."',
  },
  {
    id: 'disengage',
    label: 'Disengage Completely',
    description: 'Safest option when escalation risk is moderate or high.',
    sampleWording:
      '"I have nothing to say to you. Further contact will be reported to the platform and, if necessary, authorities."',
  },
]

function SafeReplyCard({ analyzed }: { analyzed: boolean }) {
  const [expanded, setExpanded] = useState<string | null>(null)

  if (!analyzed) {
    return (
      <div className="flex flex-col items-center justify-center h-36 gap-2 text-center text-muted-foreground">
        <MessageSquare className="w-7 h-7 opacity-25" />
        <p className="text-sm">Suggested responses will appear after you run an analysis.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {REPLY_OPTIONS.map((opt) => {
        const isOpen = expanded === opt.id
        return (
          <div
            key={opt.id}
            className="rounded-2xl border border-border bg-muted/40 p-4 flex flex-col gap-2 card-glow"
          >
            <span className="text-sm font-semibold text-foreground">{opt.label}</span>
            <p className="text-xs text-muted-foreground leading-relaxed">{opt.description}</p>
            <button
              onClick={() => setExpanded(isOpen ? null : opt.id)}
              className="mt-auto flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors self-start"
              aria-expanded={isOpen}
            >
              {isOpen ? 'Hide Wording' : 'View Suggested Wording'}
              {isOpen ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
            {isOpen && (
              <blockquote className="mt-1 border-l-2 border-primary/40 pl-3 text-xs text-foreground/80 italic leading-relaxed">
                {opt.sampleWording}
              </blockquote>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Know Your Rights ─────────────────────────────────────────────────────────

const LEGAL_CONTEXT: Record<string, { summary: string; provisions: string }> = {
  stalking: {
    summary:
      'Repeated unwanted contact or following online may constitute cyberstalking. You have the right to report this to the platform and law enforcement.',
    provisions:
      'IPC Section 354D (Stalking) · IT Act Section 66A (though struck down, police may cite it) · Contact the National Commission for Women (NCW) helpline: 7827170170',
  },
  doxxing: {
    summary:
      'Publishing your private information without consent is a violation of your right to privacy and may be actionable under IT law.',
    provisions:
      'IT Act Section 72 (Breach of confidentiality) · IT Act Section 67 (Publishing obscene material if applicable) · File a complaint at cybercrime.gov.in',
  },
  blackmail: {
    summary:
      'Threatening to expose images or information to extort you is a criminal offence. Do not comply with demands — document everything and report immediately.',
    provisions:
      'IPC Section 503 (Criminal intimidation) · IPC Section 384 (Extortion) · IT Act Section 67A · Contact Cyber Crime helpline: 1930',
  },
  threat: {
    summary:
      'Threats to your physical safety or reputation are criminal. You can file an FIR and seek a protection order.',
    provisions:
      'IPC Section 506 (Criminal intimidation) · IPC Section 507 (Anonymous criminal intimidation) · Apply for a protection order under the Domestic Violence Act if applicable',
  },
  grooming: {
    summary:
      'Online grooming is a serious offence, especially when minors are involved. You should report this to law enforcement immediately.',
    provisions:
      'POCSO Act (if victim is a minor) · IT Act Section 67B · National Cyber Crime Reporting Portal: cybercrime.gov.in',
  },
  harassment: {
    summary:
      'Persistent online harassment violates your right to dignity. Platforms are obligated under the IT Rules 2021 to act on complaints within 24 hours for severe cases.',
    provisions:
      'IT Rules 2021 (Grievance mechanism) · IPC Section 354A (Sexual harassment) · IPC Section 509 (Insulting modesty) · NCW Helpline: 7827170170',
  },
  none: {
    summary:
      'No specific category was detected. If you still feel unsafe, your concerns are valid — you can still reach out to support services.',
    provisions: 'NCW Helpline: 7827170170 · iCall (mental health): 9152987821',
  },
}

function KnowYourRightsCard({ analyzed, result }: { analyzed: boolean; result: AnalysisResult | null }) {
  const [open, setOpen] = useState(false)

  if (!analyzed) {
    return (
      <div className="flex flex-col items-center justify-center h-36 gap-2 text-center text-muted-foreground">
        <Scale className="w-7 h-7 opacity-25" />
        <p className="text-sm">Legal context will be available after you run an analysis.</p>
      </div>
    )
  }

  const category = result?.category ?? 'none'
  const legal = LEGAL_CONTEXT[category] ?? LEGAL_CONTEXT['none']

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="self-start flex items-center gap-2 bg-secondary text-secondary-foreground border border-border/60 rounded-2xl px-5 py-2.5 text-sm font-semibold hover:bg-secondary/80 hover:border-primary/30 transition-all card-glow"
        aria-expanded={open}
      >
        Explain This to Me
        {open ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {open && (
        <div className="rounded-2xl border border-border bg-muted/30 p-5 flex flex-col gap-3 text-sm leading-relaxed">
          <p className="text-foreground/85">{legal.summary}</p>
          <p className="text-xs text-muted-foreground border-t border-border/40 pt-3 leading-relaxed">
            {legal.provisions}
          </p>
        </div>
      )}

      <p className="text-xs text-muted-foreground/60 leading-snug">
        Informational only — not legal advice.
      </p>
    </div>
  )
}

// ─── Escalation empty state ───────────────────────────────────────────────────

const ESCALATION_COLOR: Record<string, string> = {
  low: 'text-teal-400',
  medium: 'text-amber-400',
  high: 'text-red-400',
}

const ESCALATION_BAR: Record<string, string> = {
  low: 'bg-teal-400/70',
  medium: 'bg-amber-400/70',
  high: 'bg-red-400/70',
}


function EscalationBar({ risk }: { risk: string }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  const widthMap: Record<string, string> = { low: '25%', medium: '50%', high: '100%' }
  return (
    <div className="w-full h-2 rounded-full bg-muted/60 overflow-hidden">
      <div
        className={`h-full rounded-full ${ESCALATION_BAR[risk]}`}
        style={{
          width: mounted ? (widthMap[risk] ?? '0%') : '0%',
          transition: 'width 0.85s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      />
    </div>
  )
}

function EscalationChartEmpty({ analyzed, result }: { analyzed: boolean; result: AnalysisResult | null }) {
  if (analyzed && result) {
    const risk = result.escalation_risk
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <TrendingUp className={`w-5 h-5 ${ESCALATION_COLOR[risk]}`} />
          <span className={`text-lg font-semibold capitalize ${ESCALATION_COLOR[risk]}`}>
            {risk} escalation risk
          </span>
        </div>
        <EscalationBar risk={risk} />
        <p className="text-sm text-muted-foreground leading-relaxed">{result.reasoning}</p>
        <p className="text-xs text-muted-foreground/50">
          Category detected:{' '}
          <span className="capitalize text-muted-foreground">{result.category}</span>
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-40 gap-2 text-muted-foreground">
      <TrendingUp className="w-8 h-8 opacity-30" />
      <p className="text-sm text-center">
        {analyzed
          ? 'No escalation data returned.'
          : 'Paste messages above and click Analyze to see the escalation pattern.'}
      </p>
    </div>
  )
}

// ─── Get Help Now ─────────────────────────────────────────────────────────────

interface HelpResource {
  id: string
  name: string
  description: string
  type: 'call' | 'link'
  href: string
  number?: string
}

const HELP_RESOURCES: HelpResource[] = [
  {
    id: 'cyber-helpline',
    name: 'Cyber Crime Helpline',
    description: 'Report online crimes, harassment, blackmail, and fraud directly to cybercrime police.',
    type: 'call',
    href: 'tel:1930',
    number: '1930',
  },
  {
    id: 'women-helpline',
    name: 'Women Helpline',
    description: 'National emergency helpline for women facing violence, threats, or distress.',
    type: 'call',
    href: 'tel:181',
    number: '181',
  },
  {
    id: 'cyber-portal',
    name: 'National Cyber Crime Portal',
    description: 'File a formal online complaint with the National Cyber Crime Reporting Portal.',
    type: 'link',
    href: 'https://cybercrime.gov.in',
  },
  {
    id: 'ncw',
    name: 'National Commission for Women',
    description: 'File complaints related to harassment, abuse, and rights violations with the NCW.',
    type: 'link',
    href: 'https://ncw.nic.in',
  },
]

// Which resources to highlight per detected category
const CATEGORY_PRIMARY: Record<string, string[]> = {
  stalking:   ['cyber-helpline', 'women-helpline'],
  threat:     ['cyber-helpline', 'women-helpline'],
  blackmail:  ['cyber-portal', 'cyber-helpline'],
  doxxing:    ['cyber-portal', 'ncw'],
  grooming:   ['cyber-portal', 'cyber-helpline'],
  harassment: ['women-helpline', 'ncw'],
  none:       ['women-helpline', 'cyber-portal'],
}

function GetHelpNow({ result }: { result: AnalysisResult }) {
  const category = result.category ?? 'none'
  const primaryIds = CATEGORY_PRIMARY[category] ?? CATEGORY_PRIMARY['none']

  return (
    <section
      aria-label="Get help now"
      className="mt-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Get Help Now</h2>
        <span className="ml-auto text-xs text-muted-foreground">
          Showing resources for:{' '}
          <span className="capitalize text-foreground/70">{category === 'none' ? 'general' : category}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {HELP_RESOURCES.map((resource) => {
          const isPrimary = primaryIds.includes(resource.id)
          return (
            <div
              key={resource.id}
              className={[
                'relative rounded-3xl border p-5 flex flex-col gap-3 transition-all',
                isPrimary
                  ? 'bg-card border-primary/40 shadow-[0_0_18px_0_hsl(var(--primary)/0.18)]'
                  : 'bg-card border-border opacity-80 hover:opacity-100',
              ].join(' ')}
            >
              {isPrimary && (
                <span className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider text-primary/80 bg-primary/10 rounded-full px-2 py-0.5 border border-primary/20">
                  Recommended
                </span>
              )}

              {/* Icon */}
              <div
                className={[
                  'w-9 h-9 rounded-2xl flex items-center justify-center shrink-0',
                  isPrimary ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground',
                ].join(' ')}
              >
                {resource.type === 'call' ? (
                  <Phone className="w-4 h-4" />
                ) : (
                  <ExternalLink className="w-4 h-4" />
                )}
              </div>

              <div className="flex flex-col gap-1 flex-1">
                <p className={`text-sm font-semibold leading-snug ${isPrimary ? 'text-foreground' : 'text-foreground/80'}`}>
                  {resource.name}
                  {resource.number && (
                    <span className="ml-1.5 font-mono text-xs text-muted-foreground">
                      {resource.number}
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {resource.description}
                </p>
              </div>

              <a
                href={resource.href}
                target={resource.type === 'link' ? '_blank' : undefined}
                rel={resource.type === 'link' ? 'noopener noreferrer' : undefined}
                className={[
                  'mt-auto flex items-center justify-center gap-1.5 rounded-2xl px-4 py-2 text-xs font-semibold transition-all',
                  isPrimary
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 btn-glow'
                    : 'bg-secondary text-secondary-foreground border border-border/60 hover:bg-secondary/80 hover:border-primary/20 card-glow',
                ].join(' ')}
              >
                {resource.type === 'call' ? (
                  <>
                    <Phone className="w-3.5 h-3.5" />
                    Call Now
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-3.5 h-3.5" />
                    Visit Portal
                  </>
                )}
              </a>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [platformBlocks, setPlatformBlocks] = useState<PlatformMessage[]>([
    { id: '1', platform: '', messages: '' },
  ])
  const [riskValue, setRiskValue] = useState<number | null>(null)
  const [flags, setFlags] = useState<string[]>([])
  const [analyzed, setAnalyzed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [reportLoading, setReportLoading] = useState(false)
  const [report, setReport] = useState<ReportData | null>(null)
  const [showReport, setShowReport] = useState(false)

  function handleLoadScenario(scenario: SampleScenario) {
    setPlatformBlocks([{ id: '1', platform: '', messages: scenario.messages }])
  }

  function handlePlatformChange(id: string, platform: string) {
    setPlatformBlocks(prev => prev.map(p => p.id === id ? { ...p, platform } : p))
  }

  function handleMessagesChange(id: string, messages: string) {
    setPlatformBlocks(prev => prev.map(p => p.id === id ? { ...p, messages } : p))
  }

  function handleAddPlatform() {
    if (platformBlocks.length < 3) {
      const newId = Math.max(0, ...platformBlocks.map(p => parseInt(p.id))) + 1
      setPlatformBlocks(prev => [...prev, { id: newId.toString(), platform: '', messages: '' }])
    }
  }

  function handleRemovePlatform(id: string) {
    if (platformBlocks.length > 1) {
      setPlatformBlocks(prev => prev.filter(p => p.id !== id))
    }
  }

  async function handleAnalyze() {
    const validBlocks = platformBlocks.filter(p => p.messages.trim())
    if (validBlocks.length === 0) return

    setLoading(true)
    setError(null)
    setResult(null)
    setRiskValue(null)
    setFlags([])
    setAnalyzed(false)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platforms: validBlocks }),
      })
      const data = await res.json()

      if (!res.ok || data.error) {
        setError(data.detail ?? data.raw ?? 'Something went wrong. Please try again.')
        setAnalyzed(true)
        return
      }

      const analysis = data as AnalysisResult
      setResult(analysis)
      setRiskValue(analysis.severity_score ?? null)
      setFlags(Array.isArray(analysis.red_flags) ? analysis.red_flags : [])
      setAnalyzed(true)
    } catch {
      setError('Could not reach the analysis service. Please try again.')
      setAnalyzed(true)
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerateReport() {
    if (!result) return
    setReportLoading(true)
    try {
      const validBlocks = platformBlocks.filter(p => p.messages.trim())
      const messagesText = validBlocks.map(p => `[${p.platform}]\n${p.messages}`).join('\n\n')
      const res = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messagesText, analysis: result, chatHistory: [] }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.raw ?? 'Failed to generate report. Please try again.')
        return
      }
      setReport(data as ReportData)
      setShowReport(true)
    } catch {
      setError('Could not generate report. Please try again.')
    } finally {
      setReportLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <SafeNav />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16 page-enter">
        <header className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground mb-2 text-balance">
            Detection Dashboard
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Paste the messages you received. We&apos;ll help you understand what&apos;s happening.
          </p>
        </header>

        {/* Input card */}
        <section
          aria-label="Message input"
          className="bg-card rounded-3xl border border-border shadow-sm p-6 mb-6 card-glow"
        >
          <label className="block text-sm font-medium text-foreground mb-4">
            Paste the messages you received
          </label>

          {/* Platform blocks */}
          <div className="space-y-4 mb-4">
            {platformBlocks.map((block, index) => (
              <div key={block.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <label htmlFor={`platform-${block.id}`} className="text-xs font-medium text-muted-foreground">
                    Platform {index + 1}
                  </label>
                  {platformBlocks.length > 1 && (
                    <button
                      onClick={() => handleRemovePlatform(block.id)}
                      className="ml-auto p-1 hover:bg-destructive/10 rounded text-destructive/60 hover:text-destructive transition-colors"
                      aria-label={`Remove platform ${index + 1}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <input
                  id={`platform-${block.id}`}
                  type="text"
                  value={block.platform}
                  onChange={(e) => handlePlatformChange(block.id, e.target.value)}
                  placeholder="e.g., Instagram DM, WhatsApp, Email"
                  className="w-full rounded-lg bg-muted/60 border border-input text-foreground placeholder:text-muted-foreground/50 text-sm p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-shadow"
                />
                <textarea
                  value={block.messages}
                  onChange={(e) => handleMessagesChange(block.id, e.target.value)}
                  placeholder="Copy and paste messages here. You can include usernames, timestamps, or context. Nothing leaves this page."
                  rows={4}
                  className="w-full rounded-lg bg-muted/60 border border-input text-foreground placeholder:text-muted-foreground/50 text-sm leading-relaxed resize-none p-3 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-shadow"
                />
              </div>
            ))}
          </div>

          {/* Add another platform button */}
          {platformBlocks.length < 3 && (
            <button
              onClick={handleAddPlatform}
              className="w-full flex items-center justify-center gap-2 bg-muted/40 border border-dashed border-border/60 rounded-lg py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/60 hover:border-border transition-colors mb-4"
            >
              <Plus className="w-4 h-4" />
              Add another platform
            </button>
          )}

          {error && (
            <p className="mt-3 text-xs text-red-400 bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-2 leading-relaxed">
              {error}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 mt-4 flex-wrap">
            <button
              onClick={handleAnalyze}
              disabled={!platformBlocks.some(p => p.messages.trim()) || loading}
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-2xl px-6 py-3 font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed btn-glow btn-primary-hover"
            >
              <Search className="w-4 h-4" />
              {loading ? 'Analyzing…' : 'Analyze'}
            </button>
            <SampleScenarioDropdown onLoadScenario={handleLoadScenario} loading={loading} />
            {analyzed && result && (
              <button
                onClick={handleGenerateReport}
                disabled={reportLoading}
                className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground rounded-2xl px-6 py-3 font-semibold text-sm hover:bg-secondary/80 transition-all border border-border/60 hover:border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed card-glow"
              >
                {reportLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
                {reportLoading ? 'Generating…' : 'Generate Report'}
              </button>
            )}
            <Link
              href="/chat"
              className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground rounded-2xl px-6 py-3 font-semibold text-sm hover:bg-secondary/80 transition-all border border-border/60 hover:border-primary/30 card-glow"
            >
              <MessageSquareHeart className="w-4 h-4" />
              Talk to someone
            </Link>
          </div>
        </section>

        {/* Analysis results grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Risk gauge card */}
          <section
            aria-label="Risk level gauge"
            className="bg-card rounded-3xl border border-border shadow-sm p-6 flex flex-col items-center card-glow"
          >
            <div className="flex items-center gap-2 self-start mb-4">
              <AlertTriangle className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Risk Level</h2>
            </div>
            <RiskGauge value={riskValue} />
            {analyzed && riskValue === null && (
              <p className="text-xs text-muted-foreground mt-4 text-center max-w-xs">
                Risk analysis will appear here once the AI model is connected.
              </p>
            )}
          </section>

          {/* Red flags card */}
          <section
            aria-label="Detected red flags"
            className="bg-card rounded-3xl border border-border shadow-sm p-6 card-glow"
          >
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Detected Red Flags</h2>
            </div>

            {flags.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-36 gap-2 text-center text-muted-foreground">
                <Tag className="w-7 h-7 opacity-25" />
                <p className="text-sm">
                  {analyzed
                    ? 'No red flags detected yet — wire up the analysis API to populate this.'
                    : 'Red flags identified in the text will appear as tags here.'}
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {flags.map((flag, i) => (
                  <span
                    key={flag}
                    className="inline-flex items-center gap-1.5 bg-destructive/20 text-red-400 border border-destructive/30 rounded-full px-3 py-1 text-xs font-medium tag-enter"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <AlertTriangle className="w-3 h-3" />
                    {flag}
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Cross-Platform Pattern card */}
          {analyzed && platformBlocks.filter(p => p.messages.trim()).length >= 2 && result?.cross_platform_risk && (
            <section
              aria-label="Cross-platform pattern analysis"
              className="bg-card rounded-3xl border border-border shadow-sm p-6 md:col-span-2 card-glow"
            >
              <div className="flex items-center gap-2 mb-4">
                <Network className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">Cross-Platform Pattern</h2>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0 ${
                    result.cross_platform_risk.same_actor_likelihood === 'high'
                      ? 'bg-red-500/20 text-red-400'
                      : result.cross_platform_risk.same_actor_likelihood === 'medium'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-green-500/20 text-green-400'
                  }`}
                >
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                        result.cross_platform_risk.same_actor_likelihood === 'high'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : result.cross_platform_risk.same_actor_likelihood === 'medium'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-green-500/20 text-green-300 border border-green-500/30'
                      }`}
                    >
                      {result.cross_platform_risk.same_actor_likelihood === 'high'
                        ? 'High Risk'
                        : result.cross_platform_risk.same_actor_likelihood === 'medium'
                          ? 'Medium Risk'
                          : 'Low Risk'}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {result.cross_platform_risk.reasoning}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Analyzed {platformBlocks.filter(p => p.messages.trim()).map(p => p.platform).join(', ')}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Safe Reply Suggestions card */}
          <section
            aria-label="Safe reply suggestions"
            className="bg-card rounded-3xl border border-border shadow-sm p-6 md:col-span-2 card-glow"
          >
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Suggested Responses</h2>
            </div>
            <SafeReplyCard analyzed={analyzed} />
          </section>

          {/* Escalation timeline */}
          <section
            aria-label="Escalation pattern timeline"
            className="bg-card rounded-3xl border border-border shadow-sm p-6 card-glow"
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Escalation Pattern</h2>
            </div>
            <EscalationChartEmpty analyzed={analyzed} result={result} />
          </section>

          {/* Know Your Rights card */}
          <section
            aria-label="Know your rights"
            className="bg-card rounded-3xl border border-border shadow-sm p-6 card-glow"
          >
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">What Are My Rights?</h2>
            </div>
            <KnowYourRightsCard analyzed={analyzed} result={result} />
          </section>
        </div>

        {/* Get Help Now */}
        {analyzed && result && (
          <GetHelpNow result={result} />
        )}
      </div>

      {showReport && report && (
        <ReportModal report={report} severityScore={result?.severity_score} onClose={() => setShowReport(false)} />
      )}
    </main>
  )
}
