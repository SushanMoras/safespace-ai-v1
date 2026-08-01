interface PlatformMessage {
  platform: string
  messages: string
}

interface BehaviorPattern {
  tactic: string
  evidence: string
  explanation: string
}

export async function POST(req: Request) {
  const { messages, platforms } = await req.json()

  // Support both single string (legacy) and multi-platform format
  let platformsData: PlatformMessage[] = []
  
  if (platforms && Array.isArray(platforms)) {
    platformsData = platforms
  } else if (messages && typeof messages === 'string' && messages.trim()) {
    platformsData = [{ platform: 'General', messages }]
  } else {
    return Response.json({ error: 'messages_required' }, { status: 400 })
  }

  // Validate all platforms have messages
  if (!platformsData.every(p => p.platform?.trim() && p.messages?.trim())) {
    return Response.json({ error: 'invalid_platform_data' }, { status: 400 })
  }

  // Format messages for analysis
  const messagesForAnalysis = platformsData
    .map(p => `[${p.platform}]\n${p.messages}`)
    .join('\n\n')

  const hasCrossPlatform = platformsData.length >= 2

  let prompt = `Analyze these messages for online harassment targeting women.
Messages: ${messagesForAnalysis}
Return ONLY valid JSON, no markdown fences:
{
  "severity_score": 0-100,
  "category": "stalking|doxxing|blackmail|threat|grooming|harassment|none",
  "red_flags": ["short phrase", "short phrase"],
  "escalation_risk": "low|medium|high",
  "reasoning": "one sentence, non-graphic",
  "behavior_patterns": [
    {"tactic": "short name e.g. Surveillance/Monitoring", "evidence": "1 short quote or paraphrase from messages", "explanation": "1 sentence on why this is a recognized manipulation/control tactic"}
  ]`

  if (hasCrossPlatform) {
    const platformList = platformsData.map(p => p.platform).join(', ')
    prompt += `,
  "cross_platform_risk": {
    "same_actor_likelihood": "low|medium|high",
    "reasoning": "one sentence assessment of whether messages show same person/actor"
  }`
  }

  prompt += `
}`

  // Add behavior pattern analysis instructions
  prompt += `

Additionally, identify any recognized coercive control or manipulation tactics present in these messages (e.g., love-bombing, isolation tactics, gaslighting, intermittent reinforcement, surveillance/monitoring, threats escalation, guilt-tripping). Only include tactics with clear textual evidence — do not speculate.`

  // Add cross-platform instructions if applicable
  if (hasCrossPlatform) {
    prompt += `

IMPORTANT: These messages came from different platforms: [${platformsData.map(p => p.platform).join(', ')}]. 
Assess whether they show signs of being the same person/actor escalating across platforms (matching tone, phrasing, intensifying threats).`
  }

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
