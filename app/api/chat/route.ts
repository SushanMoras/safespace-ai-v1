export async function POST(req: Request) {
  const { history, message } = await req.json()

  const systemPrompt = `You are a trauma-informed AI companion for SafeSpace AI, supporting women who've experienced online harassment. Rules:
- Never judge, never ask "why didn't you block/report them"
- Validate feelings first, always
- Ask gentle, open questions to understand what happened — one at a time
- Never minimize what they've shared
- If they share something urgent/dangerous, gently mention Women Helpline 181 or Cyber Crime 1930
- Keep responses short (2-4 sentences), warm, natural — not clinical
- Silently track facts as you go: platform, dates, what happened, how it escalated`

  const contents = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: "Understood, I'll respond accordingly." }] },
    ...history.map((h: { role: string; text: string }) => ({
      role: h.role,
      parts: [{ text: h.text }],
    })),
    { role: 'user', parts: [{ text: message }] },
  ]

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents }),
    }
  )

  const data = await res.json()
  const reply =
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "I'm having trouble responding right now. Please try again."

  return Response.json({ reply })
}
