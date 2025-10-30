"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle2, Search, UserCog } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface User {
  id: string
  username: string
  display_name: string
  avatar_url?: string
  email?: string
  is_developer?: boolean
  is_admin?: boolean
  is_verified?: boolean
  created_at: string
}

interface AdminContentProps {
  users: User[]
  currentUserId: string
}

export function AdminContent({ users: initialUsers, currentUserId }: AdminContentProps) {
  const [users, setUsers] = useState(initialUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const router = useRouter()

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleRole = async (userId: string, role: "is_admin" | "is_verified") => {
    setIsUpdating(userId)
    const supabase = createClient()

    const user = users.find((u) => u.id === userId)
    if (!user) return

    const newValue = !user[role]

    const { error } = await supabase
      .from("profiles")
      .update({ [role]: newValue })
      .eq("id", userId)

    if (!error) {
      setUsers(users.map((u) => (u.id === userId ? { ...u, [role]: newValue } : u)))
    }

    setIsUpdating(null)
  }

  return (
    <main className="container max-w-6xl py-8 space-y-6">
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <UserCog className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Developer Admin Panel</CardTitle>
              <p className="text-sm text-muted-foreground">Manage user roles and verification status</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by username, display name, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="outline" className="text-sm">
              {filteredUsers.length} users
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback className="bg-cyan-100 text-cyan-700">
                        {user.display_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold truncate">{user.display_name}</p>
                        {user.is_developer && (
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Developer
                          </Badge>
                        )}
                        {user.is_admin && (
                          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                        {user.is_verified && (
                          <Badge className="bg-blue-500 text-white text-xs">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
                      {user.email && <p className="text-xs text-muted-foreground truncate">{user.email}</p>}
                    </div>
                    {user.id !== currentUserId && !user.is_developer && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={user.is_admin ? "default" : "outline"}
                          onClick={() => toggleRole(user.id, "is_admin")}
                          disabled={isUpdating === user.id}
                          className={
                            user.is_admin
                              ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                              : ""
                          }
                        >
                          <Shield className="h-4 w-4 mr-1" />
                          {user.is_admin ? "Remove Admin" : "Make Admin"}
                        </Button>
                        <Button
                          size="sm"
                          variant={user.is_verified ? "default" : "outline"}
                          onClick={() => toggleRole(user.id, "is_verified")}
                          disabled={isUpdating === user.id}
                          className={user.is_verified ? "bg-blue-500 hover:bg-blue-600" : ""}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          {user.is_verified ? "Unverify" : "Verify"}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredUsers.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No users found matching your search.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
