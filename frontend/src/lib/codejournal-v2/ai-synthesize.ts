"use client"

import { loadAIConfig, getBaseUrl, getProviderHeaders } from "@/lib/codejournal-v2/ai-settings"
import { parseProviderError } from "@/lib/codejournal-v2/ai-enrich"

export interface SynthesisContext {
  text: string
  category?: string
  contentType?: string
  confidence?: number | null
}

export interface ConnectionResult {
  from: string
  to: string
  reason: string
}

export interface SynthesisResult {
  synthesis: string
  blind_spots: string[]
  assignment: string
  connections: ConnectionResult[]
}

export async function generateSynthesisClient(
  context: SynthesisContext[],
): Promise<SynthesisResult> {
  const config = loadAIConfig()
  if (!config) throw new Error("No API key configured")

  // Use the user's configured model (same one used for enrichment)
  const model = config.modelId

  // Compute per-category average confidence from context entries
  const categoryConfidenceMap: Record<string, { total: number; count: number }> = {}
  for (const entry of context) {
    if (entry.category && entry.confidence != null) {
      if (!categoryConfidenceMap[entry.category]) {
        categoryConfidenceMap[entry.category] = { total: 0, count: 0 }
      }
      categoryConfidenceMap[entry.category].total += entry.confidence
      categoryConfidenceMap[entry.category].count += 1
    }
  }

  const categoryAverages: { category: string; avg: number; count: number }[] = []
  for (const [category, data] of Object.entries(categoryConfidenceMap)) {
    categoryAverages.push({
      category,
      avg: Math.round((data.total / data.count) * 10) / 10,
      count: data.count,
    })
  }
  categoryAverages.sort((a, b) => a.avg - b.avg)

  // Build confidence section for the prompt
  let confidenceSection = ""
  if (categoryAverages.length > 0) {
    const categoryLines = categoryAverages
      .map((c) => `- ${c.category}: ${c.avg}/5 (${c.count} entries)`)
      .join("\n")

    const highConfidenceCategories = categoryAverages
      .filter((c) => c.avg >= 4 && context.filter((e) => e.category === c.category && e.confidence != null).every((e) => e.confidence! >= 4))
      .map((c) => c.category)

    confidenceSection = `

## Confidence by Category
${categoryLines}

## Confidence-Aware Instructions
- BLIND SPOTS: Prioritize categories with average confidence 1–2 as primary blind spot candidates. These are the student's weakest areas.${highConfidenceCategories.length > 0 ? `\n- EXCLUDE from blind spot detection: ${highConfidenceCategories.join(", ")} (all entries are 4–5, student has strong mastery here)` : ""}
- ASSIGNMENT: Target the category with the lowest average confidence for the assignment. Design the challenge to strengthen understanding in that weak area.
- CONNECTIONS: When finding connections, highlight "confidence gaps" — pairs where one concept has confidence 4–5 and the connected concept has confidence 1–2. These gaps reveal where strong knowledge could help bootstrap weak areas.`
  }

  const contextText = context.map((c, i) => 
    `[${i}] ${c.text}`
  ).join('\n\n')

  const prompt = `You are a programming mentor. A student learning programming has written these journal entries about what they learned:

${contextText}
${confidenceSection}

Do three things and return ONLY valid JSON, no other text:

{
  "synthesis": "2-3 sentences connecting the concepts across all entries and what they reveal about the student's understanding",
  "blind_spots": ["list of 2-3 specific gaps or misconceptions detected from how they wrote"],
  "assignment": "one specific 15-minute coding challenge that targets the weakest concept detected — make it an edge case they would likely miss, be concrete and specific",
  "connections": [
    {
      "from": "concept name",
      "to": "concept name",
      "reason": "one sentence why these connect"
    }
  ]
}

CRITICAL RULES:
- synthesis: 2-3 sentences maximum, focus on cross-concept connections
- blind_spots: 2-3 items, be specific about what they're missing${categoryAverages.length > 0 ? ". Prioritize low-confidence categories (1–2) and exclude categories where all entries have confidence 4–5" : ""}
- assignment: One concrete 15-minute challenge targeting their weakest area${categoryAverages.length > 0 ? " (use the lowest-confidence category)" : ""}
- connections: Find 3-5 meaningful connections between concepts they wrote about${categoryAverages.length > 0 ? ". Flag confidence gaps where one concept is 4–5 and the connected concept is 1–2" : ""}
- Return ONLY the JSON object, no markdown formatting, no explanation`

  const MAX_SYNTHESIS_OUTPUT_TOKENS = 2000

  const baseUrl = getBaseUrl(config)
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: getProviderHeaders(config),
    body: JSON.stringify({
      model,
      max_tokens: MAX_SYNTHESIS_OUTPUT_TOKENS,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    throw new Error(await parseProviderError(response))
  }

  let data: Record<string, unknown>
  try {
    data = await response.json()
  } catch {
    throw new Error(
      `AI synthesis error (${config.provider}): response was not valid JSON. The provider may have timed out or returned a truncated response.`
    )
  }

  const rawContent = (data.choices as Array<{ message?: { content?: string } }>)?.[0]?.message?.content
  if (!rawContent) throw new Error("No content in AI response")

  // Extract JSON from the response — handle markdown fences and mixed content
  function extractJson(content: string): string {
    // Try fenced code block first
    const fenceMatch = content.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/)
    if (fenceMatch) return fenceMatch[1].trim()
    // Fall back to outermost { ... }
    const start = content.indexOf("{")
    const end = content.lastIndexOf("}")
    if (start !== -1 && end > start) return content.slice(start, end + 1).trim()
    return content.trim()
  }

  // Parse the JSON response
  try {
    const jsonStr = extractJson(rawContent)
    const result = JSON.parse(jsonStr) as SynthesisResult
    
    // Validate the structure
    if (!result.synthesis || !Array.isArray(result.blind_spots) || !result.assignment || !Array.isArray(result.connections)) {
      throw new Error("Invalid synthesis response structure")
    }
    
    return result
  } catch (e) {
    console.error("Failed to parse synthesis:", rawContent)
    throw new Error("Could not parse synthesis response — the model returned invalid JSON")
  }
}

