import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export async function getAdminUser(): Promise<User | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const isAdmin = user.app_metadata?.role === 'admin' || user.app_metadata?.is_admin === true
  return isAdmin ? user : null
}
