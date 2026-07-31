export async function POST(req: Request) {
  const { messages, analysis, chatHistory } = await req.json()

  const prompt = `Create a structured incident report summary from this data.
Original messages: ${messages}
Detection: category=${analysis.category}, severity=${analysis.severity_score}, escalation_risk=${analysis.escalation_risk}
Chat context: ${JSON.stringify(chatHistory)}

Return ONLY JSON, no markdown:
{
  "incident_summary": "2-3 sentence neutral summary",
  "timeline": [{"event": "short description", "note": "context"}],
  "classification": "final category",
  "severity": "Low/Moderate/High",
  "recommended_action": "1-2 sentences"
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
  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  try {
    return Response.json(JSON.parse(text))
  } catch {
    return Response.json({ error: 'parse_failed', raw: text }, { status: 500 })
  }
}
