export function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 max-w-[80%]" aria-label="AI is typing" aria-live="polite">
      {/* AI avatar */}
      <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold bg-primary/15 text-primary mb-1">
        S
      </div>
      <div
        className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm"
        style={{ background: 'var(--bubble-ai)' }}
      >
        <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground/50" />
        <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground/50" />
        <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground/50" />
      </div>
    </div>
  )
}
