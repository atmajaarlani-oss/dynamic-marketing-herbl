'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ResumePage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const [snapToken, setSnapToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [snapReady, setSnapReady] = useState(false)
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    if (!orderId) {
      setError('Order ID tidak ditemukan.')
      setLoading(false)
      return
    }

    fetch(`/api/pesanan/resume?order_id=${encodeURIComponent(orderId)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Gagal mengambil token')
        const data = await res.json()
        if (data.snap_token) setSnapToken(data.snap_token)
        else throw new Error('Token tidak tersedia')
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [orderId])

  useEffect(() => {
    if (!snapToken) return

    const existing = document.getElementById('snap-script') as HTMLScriptElement | null
    if (existing) {
      if ((window as any).snap) setSnapReady(true)
      else existing.addEventListener('load', () => setSnapReady(true), { once: true })
      return
    }

    const script = document.createElement('script')
    script.id = 'snap-script'
    script.src = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true'
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js'
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '')
    script.async = true
    script.onload = () => setSnapReady(true)
    script.onerror = () => setError('Gagal memuat layanan pembayaran. Silakan muat ulang halaman.')
    document.body.appendChild(script)
  }, [snapToken])

  const goToStatus = () => {
    window.location.assign(`/pesanan/status?id=${encodeURIComponent(orderId || '')}`)
  }

  const handlePay = () => {
    const snap = (window as any).snap
    if (!snap || !snapToken || !orderId || paying) return
    setPaying(true)
    snap.pay(snapToken, {
      onSuccess: goToStatus,
      onPending: goToStatus,
      onError: () => {
        setPaying(false)
        setError('Pembayaran gagal. Silakan coba lagi atau hubungi WhatsApp.')
      },
      onClose: () => {
        setPaying(false)
        goToStatus()
      },
    })
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Memuat token pembayaran...</p>
        </div>
      </main>
    )
  }

  if (error || !snapToken) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-2xl border border-destructive/30 bg-card p-8 text-center shadow-sm">
          <p className="font-semibold text-destructive">{error ?? 'Tidak dapat memuat pembayaran.'}</p>
          <a href="/home" className="mt-4 inline-block text-sm text-primary underline">Kembali ke katalog</a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm text-center">
          <h1 className="text-2xl font-bold text-foreground">Lanjutkan Pembayaran</h1>
          <p className="mt-2 text-sm text-muted-foreground">Order ID: <span className="font-mono font-medium">{orderId}</span></p>
          <button
            onClick={handlePay}
            disabled={!snapReady || paying}
            className="mt-6 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {paying ? 'Membuka pembayaran...' : snapReady ? 'Bayar Sekarang' : 'Menyiapkan pembayaran...'}
          </button>
          <button
            type="button"
            onClick={goToStatus}
            className="mt-3 w-full rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground hover:bg-muted"
          >
            Lihat status pesanan
          </button>
        </div>
      </div>
    </main>
  )
}
