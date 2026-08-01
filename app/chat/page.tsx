'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Info } from 'lucide-react'
import { SafeNav } from '@/components/safe-nav'
import { TypingIndicator } from '@/components/typing-indicator'

type Role = 'ai' | 'user'

interface Message {
  id: string
  role: Role
  text: string
}

// History entry shape expected by the API (role uses Gemini's "user"/"model" convention)
interface HistoryEntry {
  role: 'user' | 'model'
  text: string
}

const INITIAL_MESSAGE: Message = {
  id: 'init',
  role: 'ai',
  text: "Hi. I&apos;m here to listen, at your pace. Nothing you say leaves this device unless you choose to export it. What happened?",
}

// Real text (no HTML entities) for the initial message display
const INITIAL_MESSAGE_DISPLAY = "Hi. I'm here to listen, at your pace. Nothing you say leaves this device unless you choose to export it. What happened?"

function ChatBubble({ message, animate }: { message: Message; animate?: boolean }) {
  const isAI = message.role === 'ai'
  const animClass = animate ? (isAI ? 'bubble-enter-ai' : 'bubble-enter-user') : ''
  return (
    <div
      className={`flex items-end gap-2 max-w-[82%] ${isAI ? 'self-start' : 'self-end flex-row-reverse'} ${animClass}`}
    >
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mb-1 ${
          isAI ? 'bg-primary/15 text-primary' : 'bg-primary text-primary-foreground'
        }`}
      >
        {isAI ? 'S' : 'Y'}
      </div>

      <div
        className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
          isAI
            ? 'rounded-bl-sm text-foreground'
            : 'rounded-br-sm text-primary-foreground'
        }`}
        style={{
          background: isAI ? 'var(--bubble-ai)' : 'var(--bubble-user)',
        }}
      >
        {message.id === 'init' ? INITIAL_MESSAGE_DISPLAY : message.text}
      </div>
    </div>
  )
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [newIds, setNewIds] = useState<Set<string>>(new Set())
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  async function handleSend() {
    const trimmed = input.trim()
    if (!trimmed || isTyping) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setNewIds((prev) => new Set(prev).add(userMsg.id))
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    setIsTyping(true)

    // Build history from all prior messages (excluding the seeded initial AI greeting)
    const nextHistory: HistoryEntry[] = [
      ...history,
      { role: 'user', text: trimmed },
    ]

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history, message: trimmed }),
      })
      const data = await res.json()
      const replyText: string = data.reply ?? "I'm here. Can you tell me more?"

      setIsTyping(false)
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: replyText,
      }
      setMessages((prev) => [...prev, aiMsg])
      setNewIds((prev) => new Set(prev).add(aiMsg.id))
      setHistory([...nextHistory, { role: 'model', text: replyText }])
    } catch {
      setIsTyping(false)
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: "I'm having trouble connecting right now. Please try again in a moment.",
      }
      setMessages((prev) => [...prev, errMsg])
      setNewIds((prev) => new Set(prev).add(errMsg.id))
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      handleSend()
    }
  }

  // Auto-resize textarea
  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value)
    const ta = textareaRef.current
    if (ta) {
      ta.style.height = 'auto'
      ta.style.height = `${Math.min(ta.scrollHeight, 140)}px`
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SafeNav />

      {/* Safety banner */}
      <div className="fixed top-[65px] left-0 right-0 z-40 bg-secondary/60 border-b border-border/40 backdrop-blur-sm px-4 py-2 flex items-center justify-center gap-2">
        <Info className="w-3.5 h-3.5 text-accent-foreground flex-shrink-0" />
        <p className="text-xs text-accent-foreground font-medium text-center">
          This is a supportive space, not a substitute for professional help.
          {' '}
          <a
            href="https://www.crisis.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            Find a professional
          </a>
          .
        </p>
      </div>

      {/* Message area */}
      <section
        aria-label="Conversation"
        aria-live="polite"
        className="flex-1 overflow-y-auto px-4 sm:px-6 pb-32 pt-[120px]"
      >
        <div className="max-w-2xl mx-auto flex flex-col gap-4 page-enter">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} animate={newIds.has(msg.id)} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      </section>

      {/* Input bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t border-border/60 px-4 sm:px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-end gap-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Shift+Enter for new line)"
            rows={1}
            className="flex-1 resize-none rounded-2xl bg-muted/70 border border-input text-foreground placeholder:text-muted-foreground/60 text-sm leading-relaxed px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-shadow min-h-[46px] max-h-[140px]"
            aria-label="Message input"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            aria-label="Send message"
            className="w-11 h-11 flex-shrink-0 flex items-center justify-center bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-primary/20 hover:scale-[1.05]"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </main>
  )
}
