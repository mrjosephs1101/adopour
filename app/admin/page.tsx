import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { redirect } from "next/navigation"
import { AdminContent } from "./admin-content"

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile?.is_developer) {
    redirect("/feed")
  }

  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-cyan-50/50">
      <Navigation user={user} profile={profile} />
      <AdminContent users={users || []} currentUserId={user.id} />
    </div>
  )
}
