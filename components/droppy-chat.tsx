"use client"
import { useChat } from "ai/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Send, Loader2 } from "lucide-react"
import Image from "next/image"

interface AdoAIChatProps {
  onClose: () => void
}

export function AdoAIChat({ onClose }: AdoAIChatProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
  })

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[600px] shadow-2xl z-50 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/adopour-icon-J9OWJHTBfvSuH4nmDJVv4Y9T2mwHGP.png"
            alt="AdoAI"
            width={32}
            height={32}
          />
          <CardTitle className="text-lg">Chat with AdoAI</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/adopour-icon-J9OWJHTBfvSuH4nmDJVv4Y9T2mwHGP.png"
                  alt="AdoAI"
                  width={64}
                  height={64}
                  className="mx-auto mb-3"
                />
                <p className="font-semibold">Hi! I'm AdoAI!</p>
                <p className="text-sm mt-1">How can I help you today?</p>
              </div>
            )}
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user" ? "bg-cyan-600 text-white" : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-cyan-600" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask AdoAI anything..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={!input.trim() || isLoading} className="bg-cyan-600 hover:bg-cyan-700">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
