'use client'

import { useState } from 'react'
import { X, Download, Loader2, AlertCircle, Clock, Tag, CheckCircle, AlertTriangle } from 'lucide-react'

export interface ReportData {
  incident_summary: string
  timeline: { event: string; note: string }[]
  classification: string
  severity: string
  recommended_action: string
}

interface ReportModalProps {
  report: ReportData
  severityScore?: number
  onClose: () => void
}

const SEVERITY_COLOR: Record<string, string> = {
  Low: 'text-teal-400 bg-teal-400/10 border-teal-400/30',
  Moderate: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  High: 'text-red-400 bg-red-400/10 border-red-400/30',
}

export function ReportModal({ report, severityScore, onClose }: ReportModalProps) {
  const [exporting, setExporting] = useState(false)

  // Determine triage priority based on severity_score
  const getTriagePriority = (score?: number) => {
    if (score === undefined || score === null) return null
    if (score >= 71) {
      return {
        label: 'Immediate Safety Concern',
        color: 'text-red-400 bg-red-400/10 border-red-400/30',
        icon: 'alert',
      }
    } else if (score >= 41) {
      return {
        label: 'Documentation Recommended',
        color: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
        icon: 'warning',
      }
    } else {
      return {
        label: 'Low Priority — Monitor',
        color: 'text-green-400 bg-green-400/10 border-green-400/30',
        icon: 'check',
      }
    }
  }

  const triagePriority = getTriagePriority(severityScore)

  async function handleExportPDF() {
    setExporting(true)
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF({ unit: 'pt', format: 'a4' })

      const pageW = doc.internal.pageSize.getWidth()
      const margin = 48
      const contentW = pageW - margin * 2
      let y = margin

      // Header bar
      doc.setFillColor(30, 30, 50)
      doc.rect(0, 0, pageW, 72, 'F')

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(16)
      doc.setTextColor(255, 255, 255)
      doc.text('SafeSpace AI — Incident Report', margin, 32)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(180, 180, 200)
      doc.text(`Generated: ${new Date().toLocaleString()}`, margin, 52)

      y = 100

      // Helper: wrapped text block
      function addSection(title: string, body: string) {
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.setTextColor(100, 130, 220)
        doc.text(title.toUpperCase(), margin, y)
        y += 16

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        doc.setTextColor(40, 40, 60)
        const lines = doc.splitTextToSize(body, contentW)
        doc.text(lines, margin, y)
        y += lines.length * 14 + 18
      }

      // Classification + Severity row
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.setTextColor(100, 130, 220)
      doc.text('CLASSIFICATION', margin, y)
      doc.text('SEVERITY', margin + contentW / 2, y)
      y += 16
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(40, 40, 60)
      doc.text(report.classification ?? '—', margin, y)
      doc.text(report.severity ?? '—', margin + contentW / 2, y)
      y += 32

      addSection('Incident Summary', report.incident_summary)
      addSection('Recommended Action', report.recommended_action)

      // Timeline
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.setTextColor(100, 130, 220)
      doc.text('TIMELINE', margin, y)
      y += 16

      report.timeline?.forEach((item, i) => {
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.setTextColor(40, 40, 60)
        doc.text(`${i + 1}. ${item.event}`, margin, y)
        y += 14
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(100, 100, 120)
        const noteLines = doc.splitTextToSize(item.note, contentW - 12)
        doc.text(noteLines, margin + 12, y)
        y += noteLines.length * 13 + 10
      })

      // Footer
      const footerY = doc.internal.pageSize.getHeight() - 36
      doc.setFillColor(245, 245, 250)
      doc.rect(0, footerY - 12, pageW, 48, 'F')
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(8)
      doc.setTextColor(130, 130, 150)
      doc.text(
        'This report is advisory only and not a substitute for law enforcement or platform action.',
        margin,
        footerY + 8
      )

      doc.save('safespace-incident-report.pdf')
    } finally {
      setExporting(false)
    }
  }

  const severityClass = SEVERITY_COLOR[report.severity] ?? SEVERITY_COLOR['Low']

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Incident report"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card rounded-3xl border border-border shadow-2xl flex flex-col">
        {/* Modal header */}
        <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm flex items-center justify-between px-6 py-4 border-b border-border/60">
          <h2 className="font-serif text-lg text-foreground">Incident Report</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="flex items-center gap-1.5 bg-primary text-primary-foreground rounded-xl px-4 py-2 text-xs font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all btn-glow"
            >
              {exporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              {exporting ? 'Exporting…' : 'Export as PDF'}
            </button>
            <button
              onClick={onClose}
              aria-label="Close report"
              className="w-8 h-8 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal body */}
        <div className="flex flex-col gap-6 p-6">
          {/* Triage Priority Badge */}
          {triagePriority && (
            <div
              className={`flex items-center gap-2.5 rounded-2xl border p-4 ${triagePriority.color}`}
            >
              {triagePriority.icon === 'alert' && <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
              {triagePriority.icon === 'warning' && <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              {triagePriority.icon === 'check' && <CheckCircle className="w-4 h-4 flex-shrink-0" />}
              <span className="text-sm font-semibold">{triagePriority.label}</span>
            </div>
          )}

          {/* Classification + Severity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/40 rounded-2xl border border-border/60 p-4 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Tag className="w-3.5 h-3.5" />
                Classification
              </div>
              <span className="text-sm font-semibold capitalize text-foreground">
                {report.classification ?? '—'}
              </span>
            </div>
            <div className="bg-muted/40 rounded-2xl border border-border/60 p-4 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Severity
              </div>
              <span
                className={`inline-flex self-start items-center text-xs font-semibold rounded-full px-2.5 py-1 border capitalize ${severityClass}`}
              >
                {report.severity ?? '—'}
              </span>
            </div>
          </div>

          {/* Incident Summary */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold text-primary uppercase tracking-wider">
              Incident Summary
            </h3>
            <p className="text-sm text-foreground/85 leading-relaxed">{report.incident_summary}</p>
          </div>

          {/* Timeline */}
          {report.timeline?.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Timeline
              </h3>
              <ol className="flex flex-col gap-3">
                {report.timeline.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-foreground">{item.event}</span>
                      <span className="text-xs text-muted-foreground leading-relaxed">{item.note}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Recommended Action */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              Recommended Action
            </h3>
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
              <p className="text-sm text-foreground/85 leading-relaxed">{report.recommended_action}</p>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground/50 leading-snug border-t border-border/40 pt-4">
            This report is advisory only and not a substitute for law enforcement or platform action.
          </p>
        </div>
      </div>
    </div>
  )
}
