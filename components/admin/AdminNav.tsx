"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { createBrowserSupabase } from "@/lib/supabase-browser"

const links = [
  { href: "/admin", label: "Beranda" },
  { href: "/admin/produk", label: "Produk" },
  { href: "/admin/produk/tambah", label: "Tambah produk" },
]

export default function AdminNav({ email }: { email: string | null }) {
  const pathname = usePathname()
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)
  const supabase = createBrowserSupabase()

  async function handleSignOut() {
    setSigningOut(true)
    await supabase.auth.signOut()
    router.replace("/admin-login")
    router.refresh()
  }

  return (
    <nav aria-label="Navigasi admin" className="flex flex-wrap items-center gap-2">
      {links.map((link) => {
        const active = pathname === link.href || (link.href !== "/admin" && pathname?.startsWith(link.href))
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-background"}`}
          >
            {link.label}
          </Link>
        )
      })}
      <div className="ml-auto flex items-center gap-2">
        {email ? <span className="hidden text-xs text-muted-foreground sm:inline">{email}</span> : null}
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition hover:bg-card disabled:opacity-60"
        >
          {signingOut ? "Keluar..." : "Keluar"}
        </button>
      </div>
    </nav>
  )
}
