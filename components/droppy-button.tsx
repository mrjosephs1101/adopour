"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AdoAIChat } from "./droppy-chat"
import Image from "next/image"

export function AdoAIButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 h-16 w-16 rounded-full shadow-2xl bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 z-50"
          size="icon"
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/adopour-icon-J9OWJHTBfvSuH4nmDJVv4Y9T2mwHGP.png"
            alt="Chat with AdoAI"
            width={40}
            height={40}
          />
        </Button>
      )}
      {isOpen && <AdoAIChat onClose={() => setIsOpen(false)} />}
    </>
  )
}
