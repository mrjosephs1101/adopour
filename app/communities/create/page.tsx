import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { CreateCommunityForm } from "./create-community-form"
import { redirect } from "next/navigation"

export default async function CreateCommunityPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-cyan-50/50">
      <Navigation user={user} profile={profile} />
      <CreateCommunityForm userId={user.id} />
    </div>
  )
}
