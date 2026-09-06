import Link from "next/link"
import { ReactNode } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase"
import AdminNav from "@/components/admin/AdminNav"

export const dynamic = "force-dynamic"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const isAdmin = user.app_metadata?.role === "admin" || user.app_metadata?.is_admin === true

  if (!isAdmin) {
    await supabase.auth.signOut()
    redirect("/admin/login?error=not_admin")
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Herbal Insani</p>
            <Link href="/admin" className="text-lg font-semibold tracking-tight text-foreground">Ruang Admin</Link>
          </div>
          <AdminNav email={user.email ?? null} />
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  )
}
