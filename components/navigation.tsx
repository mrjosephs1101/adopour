"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, MessageCircle, Bell, LogOut, UserCog, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface NavigationProps {
  user?: {
    id: string
    email?: string
  } | null
  profile?: {
    username: string
    display_name: string
    avatar_url?: string
    is_developer?: boolean
  } | null
}

export function Navigation({ user, profile }: NavigationProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const navItems =
    user && profile
      ? [
          { href: "/communities", icon: Users, label: "Communities" },
          { href: `/profile/${profile.username}`, icon: User, label: "Profile" },
          { href: "/messages", icon: MessageCircle, label: "Messages" },
          { href: "/notifications", icon: Bell, label: "Notifications" },
          ...(profile.is_developer ? [{ href: "/admin", icon: UserCog, label: "Admin" }] : []),
        ]
      : []

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={isActive ? "bg-cyan-100 text-cyan-700" : ""}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => router.push("/auth/login")}>
                Sign In
              </Button>
              <Button onClick={() => router.push("/auth/sign-up")} className="bg-cyan-600 hover:bg-cyan-700">
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
