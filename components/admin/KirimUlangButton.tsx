"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

type KirimUlangButtonProps = {
  orderId: string
}

type ApiResponse = {
  success?: boolean
  error?: string
}

export default function KirimUlangButton({ orderId }: KirimUlangButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")

  async function handleClick() {
    if (!confirm("Buat ulang pengiriman untuk " + orderId + "?")) return
    setLoading(true)
    setMsg("")
    const res = await fetch("/api/admin/pesanan/" + encodeURIComponent(orderId) + "/kirim", { method: "POST" })
    const data: ApiResponse = await res.json()
    setLoading(false)
    if (res.ok && data.success) {
      router.refresh()
      setMsg("Berhasil")
    } else {
      setMsg("Gagal: " + (data.error || "Error"))
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
