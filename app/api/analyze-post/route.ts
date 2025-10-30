import { generateObject } from "ai"
import { z } from "zod"

const postAnalysisSchema = z.object({
  sentiment: z.enum(["positive", "negative", "neutral", "mixed"]).describe("Overall emotional tone of the post"),
  sentimentScore: z.number().min(0).max(1).describe("Confidence score for sentiment (0-1)"),
  tags: z.array(z.string()).describe("Relevant tags or categories (3-5 tags)"),
  summary: z.string().describe("Brief one-sentence summary of the post"),
  keyPoints: z.array(z.string()).describe("Main points or topics discussed (2-4 points)"),
  moderationFlags: z
    .array(z.string())
    .describe("Any content concerns: hate-speech, violence, spam, nsfw, etc. Empty if safe"),
  isSafe: z.boolean().describe("Whether the content is appropriate for the platform"),
  suggestions: z.array(z.string()).describe("Suggestions to improve the post (2-3 suggestions)"),
})

export async function POST(req: Request) {
  try {
    const { content } = await req.json()

    if (!content || typeof content !== "string") {
      return Response.json({ error: "Content is required" }, { status: 400 })
    }

    const { object } = await generateObject({
      model: "openai/gpt-4o-mini",
      schema: postAnalysisSchema,
      prompt: `Analyze this social media post and provide comprehensive insights:

Post content: "${content}"

Provide:
1. Sentiment analysis (positive/negative/neutral/mixed) with confidence score
2. Relevant tags/categories (3-5 tags)
3. A brief one-sentence summary
4. Key points or main topics (2-4 points)
5. Content moderation flags (hate-speech, violence, spam, nsfw, etc.) - empty array if safe
6. Whether the content is safe for the platform
7. Constructive suggestions to improve the post (2-3 suggestions)

Be helpful and constructive in your analysis.`,
    })

    return Response.json({ analysis: object })
  } catch (error) {
    console.error("[v0] Error analyzing post:", error)
    return Response.json({ error: "Failed to analyze post" }, { status: 500 })
  }
}
