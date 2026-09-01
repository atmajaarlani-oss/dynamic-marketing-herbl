"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createBrowserSupabase } from "@/lib/supabase-browser"

export const runtime = "nodejs"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setLoading(true)

    const supabase = createBrowserSupabase()
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError || !data.user) {
      setError("Email atau kata sandi tidak valid.")
      setLoading(false)
      return
    }

    const isAdmin = data.user.app_metadata?.role === "admin" || data.user.app_metadata?.is_admin === true
    if (!isAdmin) {
      await supabase.auth.signOut()
      setError("Akun ini tidak memiliki akses admin.")
      setLoading(false)
      return
    }

    router.replace("/admin")
    router.refresh()
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Herbal Insani</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">Masuk ke ruang admin</h1>
        <p className="mt-3 leading-6 text-muted-foreground">Kelola katalog produk dan informasi legalitas dengan aman.</p>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2"><label htmlFor="email" className="text-sm font-medium">Email</label><input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary" /></div>
          <div className="space-y-2"><label htmlFor="password" className="text-sm font-medium">Kata sandi</label><input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary" /></div>
          {error ? <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p> : null}
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-60">{loading ? "Memeriksa..." : "Masuk"}</button>
        </form>
        <Link href="/home" className="mt-6 block text-center text-sm text-primary underline underline-offset-4">Kembali ke katalog</Link>
      </section>
    </main>
  )
}
