export async function POST(req: Request) {
  const { messages } = await req.json()

  if (!messages || typeof messages !== 'string' || !messages.trim()) {
    return Response.json({ error: 'messages_required' }, { status: 400 })
  }

  const prompt = `Analyze these messages for online harassment targeting women.
Messages: ${messages}
Return ONLY valid JSON, no markdown fences:
{
  "severity_score": 0-100,
  "category": "stalking|doxxing|blackmail|threat|grooming|harassment|none",
  "red_flags": ["short phrase", "short phrase"],
  "escalation_risk": "low|medium|high",
  "reasoning": "one sentence, non-graphic"
}`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    }
  )

  if (!res.ok) {
    const err = await res.text()
    return Response.json({ error: 'gemini_error', detail: err }, { status: 502 })
  }

  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text

  try {
    return Response.json(JSON.parse(text))
  } catch {
    return Response.json({ error: 'parse_failed', raw: text }, { status: 500 })
  }
}
