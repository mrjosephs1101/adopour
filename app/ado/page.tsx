import { createServerClient } from "@/lib/supabase/server"
import { AdoAIChat } from "./ado-chat"

export default async function AdoAIPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <AdoAIChat user={user} />
}
