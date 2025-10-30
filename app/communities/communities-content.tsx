"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Users, Plus, TrendingUp } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Community {
  id: string
  name: string
  display_name: string
  description: string | null
  avatar_url: string | null
  member_count: number
  post_count: number
  creator: {
    username: string
    display_name: string
    avatar_url: string | null
  } | null
}

interface CommunitiesContentProps {
  communities: Community[]
  joinedCommunityIds: Set<string>
  userId: string
}

export function CommunitiesContent({
  communities: initialCommunities,
  joinedCommunityIds,
  userId,
}: CommunitiesContentProps) {
  const [communities, setCommunities] = useState(initialCommunities)
  const [searchQuery, setSearchQuery] = useState("")
  const [joinedIds, setJoinedIds] = useState(joinedCommunityIds)
  const [isJoining, setIsJoining] = useState<string | null>(null)
  const router = useRouter()

  const filteredCommunities = communities.filter(
    (community) =>
      community.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleJoinLeave = async (communityId: string, isJoined: boolean) => {
    setIsJoining(communityId)
    const supabase = createClient()

    if (isJoined) {
      // Leave community
      const { error } = await supabase
        .from("community_members")
        .delete()
        .eq("community_id", communityId)
        .eq("user_id", userId)

      if (!error) {
        setJoinedIds((prev) => {
          const newSet = new Set(prev)
          newSet.delete(communityId)
          return newSet
        })
        setCommunities((prev) =>
          prev.map((c) => (c.id === communityId ? { ...c, member_count: c.member_count - 1 } : c)),
        )
      }
    } else {
      // Join community
      const { error } = await supabase.from("community_members").insert({
        community_id: communityId,
        user_id: userId,
        role: "member",
      })

      if (!error) {
        setJoinedIds((prev) => new Set(prev).add(communityId))
        setCommunities((prev) =>
          prev.map((c) => (c.id === communityId ? { ...c, member_count: c.member_count + 1 } : c)),
        )
      }
    }

    setIsJoining(null)
  }

  return (
    <main className="container max-w-6xl py-8 space-y-6">
      <Card className="border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Communities</CardTitle>
                <p className="text-sm text-muted-foreground">Discover and join communities that match your interests</p>
              </div>
            </div>
            <Button
              onClick={() => router.push("/communities/create")}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Community
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search communities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="outline" className="text-sm">
              {filteredCommunities.length} communities
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {filteredCommunities.map((community) => {
              const isJoined = joinedIds.has(community.id)
              return (
                <Card key={community.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={community.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gradient-to-br from-cyan-100 to-blue-100 text-cyan-700 text-xl">
                          {community.display_name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <Link href={`/communities/${community.name}`}>
                          <h3 className="font-semibold text-lg hover:text-cyan-600 transition-colors">
                            {community.display_name}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground line-clamp-2">{community.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{community.member_count.toLocaleString()} members</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>{community.post_count.toLocaleString()} posts</span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <Button
                            size="sm"
                            variant={isJoined ? "outline" : "default"}
                            onClick={() => handleJoinLeave(community.id, isJoined)}
                            disabled={isJoining === community.id}
                            className={
                              !isJoined
                                ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                                : ""
                            }
                          >
                            {isJoined ? "Leave" : "Join"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          {filteredCommunities.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No communities found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
