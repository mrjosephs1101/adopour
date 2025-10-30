"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Users, ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface CreateCommunityFormProps {
  userId: string
}

export function CreateCommunityForm({ userId }: CreateCommunityFormProps) {
  const [displayName, setDisplayName] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleDisplayNameChange = (value: string) => {
    setDisplayName(value)
    // Auto-generate URL-friendly name
    const urlName = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
    setName(urlName)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsCreating(true)

    const supabase = createClient()

    // Create community
    const { data: community, error: createError } = await supabase
      .from("communities")
      .insert({
        name,
        display_name: displayName,
        description,
        creator_id: userId,
      })
      .select()
      .single()

    if (createError) {
      setError(createError.message)
      setIsCreating(false)
      return
    }

    // Auto-join as admin
    const { error: joinError } = await supabase.from("community_members").insert({
      community_id: community.id,
      user_id: userId,
      role: "admin",
    })

    if (joinError) {
      setError(joinError.message)
      setIsCreating(false)
      return
    }

    router.push(`/communities/${name}`)
  }

  return (
    <main className="container max-w-2xl py-8 space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Card className="border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Create a Community</CardTitle>
              <p className="text-sm text-muted-foreground">Build a space for people with shared interests</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleCreate} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="displayName">Community Name</Label>
              <Input
                id="displayName"
                placeholder="e.g., Dog Lovers"
                value={displayName}
                onChange={(e) => handleDisplayNameChange(e.target.value)}
                required
                maxLength={50}
              />
              <p className="text-xs text-muted-foreground">This is how your community will appear to others</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">URL Name</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">/communities/</span>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  pattern="[a-z0-9-]+"
                  maxLength={50}
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Only lowercase letters, numbers, and hyphens. Auto-generated from community name.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What is your community about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">{description.length}/500 characters</p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isCreating}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating || !displayName || !name || !description}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                {isCreating ? "Creating..." : "Create Community"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
