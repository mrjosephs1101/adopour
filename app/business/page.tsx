import { BusinessContent } from "./business-content"
import { Navigation } from "@/components/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function BusinessPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
    profile = data
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation user={user} profile={profile} />
      <BusinessContent />
    </div>
  )
}
