"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Sparkles } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface AdoAIChatProps {
  user: {
    id: string
    email?: string
  } | null
}

export function AdoAIChat({ user }: AdoAIChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ""
      const assistantId = (Date.now() + 1).toString()

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("0:")) {
              try {
                const jsonStr = line.slice(2).trim()
                if (jsonStr) {
                  const parsed = JSON.parse(jsonStr)
                  if (parsed.content) {
                    assistantMessage += parsed.content
                    setMessages((prev) => {
                      const existing = prev.find((m) => m.id === assistantId)
                      if (existing) {
                        return prev.map((m) => (m.id === assistantId ? { ...m, content: assistantMessage } : m))
                      }
                      return [
                        ...prev,
                        {
                          id: assistantId,
                          role: "assistant" as const,
                          content: assistantMessage,
                        },
                      ]
                    })
                  }
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("[v0] Chat error:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/adopour-icon-J9OWJHTBfvSuH4nmDJVv4Y9T2mwHGP.png"
                alt="AdoAI"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="absolute -bottom-1 -right-1 bg-cyan-500 rounded-full p-1">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                AdoAI
              </h1>
              <p className="text-xs text-muted-foreground">Your AI assistant</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="container max-w-3xl mx-auto py-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-12">
              <div className="relative">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/adopour-icon-J9OWJHTBfvSuH4nmDJVv4Y9T2mwHGP.png"
                  alt="AdoAI"
                  width={80}
                  height={80}
                  className="rounded-full"
                />
                <div className="absolute -bottom-2 -right-2 bg-cyan-500 rounded-full p-2">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Welcome to AdoAI
                </h2>
                <p className="text-muted-foreground max-w-md">
                  Your friendly AI assistant for Adopour. Ask me anything about the platform, get social media tips, or
                  just chat!
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                {[
                  "How do I create a post?",
                  "What makes Adopour unique?",
                  "Tips for growing my network",
                  "How do I customize my profile?",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="p-4 text-left rounded-lg border bg-card hover:bg-accent transition-colors"
                  >
                    <p className="text-sm">{suggestion}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex gap-4", message.role === "user" ? "justify-end" : "justify-start")}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/adopour-icon-J9OWJHTBfvSuH4nmDJVv4Y9T2mwHGP.png"
                          alt="AdoAI"
                          width={36}
                          height={36}
                          className="rounded-full"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 bg-cyan-500 rounded-full p-0.5">
                          <Sparkles className="h-2.5 w-2.5 text-white" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 max-w-[80%]",
                      message.role === "user" ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white" : "bg-muted",
                    )}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="flex-shrink-0 h-9 w-9">
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm">
                        {user?.email?.[0].toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4 justify-start">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/adopour-icon-J9OWJHTBfvSuH4nmDJVv4Y9T2mwHGP.png"
                        alt="AdoAI"
                        width={36}
                        height={36}
                        className="rounded-full"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 bg-cyan-500 rounded-full p-0.5">
                        <Sparkles className="h-2.5 w-2.5 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl px-4 py-3 bg-muted">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-background">
        <div className="container max-w-3xl mx-auto py-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message AdoAI..."
              className="min-h-[60px] max-h-[200px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="h-[60px] w-[60px] bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-2">
            AdoAI can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  )
}
