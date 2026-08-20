import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Membuat client Supabase untuk Server Component dan Route Handler.
 * Cookie session dibaca dari request saat ini.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Cookie tidak dapat ditulis dari Server Component; aman diabaikan.
          }
        },
      },
    },
  )
}
