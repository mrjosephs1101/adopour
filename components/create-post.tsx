"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon, Sparkles, AlertCircle, CheckCircle, Lightbulb } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface CreatePostProps {
  profile: {
    display_name: string
    avatar_url?: string
  }
  onPost: (content: string, communityId?: string) => Promise<void>
  communityId?: string
}

interface PostAnalysis {
  sentiment: string
  sentimentScore: number
  tags: string[]
  summary: string
  keyPoints: string[]
  moderationFlags: string[]
  isSafe: boolean
  suggestions: string[]
}

export function CreatePost({ profile, onPost, communityId }: CreatePostProps) {
  const [content, setContent] = useState("")
  const [isPosting, setIsPosting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<PostAnalysis | null>(null)
  const [showAnalysis, setShowAnalysis] = useState(false)

  const handleAnalyze = async () => {
    if (!content.trim()) return

    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/analyze-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })

      if (response.ok) {
        const data = await response.json()
        setAnalysis(data.analysis)
        setShowAnalysis(true)
      }
    } catch (error) {
      console.error("[v0] Error analyzing post:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handlePost = async () => {
    if (!content.trim()) return

    setIsPosting(true)
    try {
      await onPost(content, communityId)
      setContent("")
      setAnalysis(null)
      setShowAnalysis(false)
    } finally {
      setIsPosting(false)
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600 bg-green-50"
      case "negative":
        return "text-red-600 bg-red-50"
      case "neutral":
        return "text-gray-600 bg-gray-50"
      case "mixed":
        return "text-yellow-600 bg-yellow-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src={profile.avatar_url || "/placeholder.svg"} />
            <AvatarFallback className="bg-cyan-100 text-cyan-700">
              {profile.display_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => {
                setContent(e.target.value)
                setShowAnalysis(false)
              }}
              className="min-h-[100px] resize-none"
            />

            {/* AI Analysis Results */}
            {showAnalysis && analysis && (
              <div className="space-y-3 p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg border border-cyan-200">
                <div className="flex items-center gap-2 text-sm font-semibold text-cyan-700">
                  <Sparkles className="h-4 w-4" />
                  AI Analysis
                </div>

                {/* Sentiment */}
                <div className="flex items-center gap-2">
                  <Badge className={getSentimentColor(analysis.sentiment)}>
                    {analysis.sentiment.charAt(0).toUpperCase() + analysis.sentiment.slice(1)}(
                    {Math.round(analysis.sentimentScore * 100)}%)
                  </Badge>
                </div>

                {/* Tags */}
                {analysis.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {analysis.tags.map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Summary */}
                <p className="text-sm text-gray-700 italic">"{analysis.summary}"</p>

                {/* Moderation Warnings */}
                {!analysis.isSafe && analysis.moderationFlags.length > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Content concerns: {analysis.moderationFlags.join(", ")}</AlertDescription>
                  </Alert>
                )}

                {/* Suggestions */}
                {analysis.suggestions.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                      <Lightbulb className="h-3 w-3" />
                      Suggestions to improve:
                    </div>
                    <ul className="text-xs text-gray-600 space-y-1 pl-5">
                      {analysis.suggestions.map((suggestion, i) => (
                        <li key={i} className="list-disc">
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Safe to post indicator */}
                {analysis.isSafe && (
                  <div className="flex items-center gap-2 text-xs text-green-600">
                    <CheckCircle className="h-3 w-3" />
                    Content looks good to post!
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" disabled>
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Photo
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAnalyze}
                  disabled={!content.trim() || isAnalyzing}
                  className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isAnalyzing ? "Analyzing..." : "AI Analyze"}
                </Button>
              </div>
              <Button
                onClick={handlePost}
                disabled={!content.trim() || isPosting || (analysis && !analysis.isSafe)}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                {isPosting ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
