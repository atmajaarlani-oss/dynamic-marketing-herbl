"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

type KirimUlangButtonProps = {
  orderId: string
}

type ApiResponse = {
  success?: boolean
  error?: string
  hasil?: 'dibuat' | 'gagal' | 'dilewati'
}

export default function KirimUlangButton({ orderId }: KirimUlangButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")

  async function handleClick() {
    if (!confirm("Buat ulang pengiriman untuk " + orderId + "?")) return
    setLoading(true)
    setMsg("")
    let data: ApiResponse
    try {
      const res = await fetch("/api/admin/pesanan/" + encodeURIComponent(orderId) + "/kirim", { method: "POST" })
      data = await res.json()
    } catch {
      setMsg("Gagal: respons tidak valid")
      setLoading(false)
      return
    }
    setLoading(false)
    if (data.hasil === 'dibuat') {
      router.refresh()
      setMsg("Berhasil")
    } else if (data.hasil === 'gagal') {
      router.refresh()
      setMsg("Gagal: lihat pesan error di kolom Pengiriman")
    } else if (data.hasil === 'dilewati') {
      setMsg("Sedang diproses atau tidak memenuhi syarat")
    } else {
      setMsg("Gagal: " + (data.error ?? "tidak diketahui"))
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-card disabled:opacity-60"
      >
        {loading ? "Memproses..." : "Buat ulang"}
      </button>
      {msg ? <span className={`text-xs ${msg.startsWith("Gagal") ? "text-destructive" : "text-emerald-700"}`}>{msg}</span> : null}
    </div>
  )
}
