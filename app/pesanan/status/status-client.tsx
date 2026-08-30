'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, Clock, Truck, Copy, MessageCircle, XCircle, Package } from 'lucide-react'

interface OrderStatus {
  order_id: string
  nama_pembeli: string
  nama_produk: string
  jumlah: number
  harga_satuan: number
  ongkir: number
  total_bayar: number
  kurir: string
  status: string
  resi: string | null
  tracking_link: string | null
  created_at: string
}

function formatRupiah(value: number | string) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}

export default function StatusClient({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<OrderStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [debugInfo, setDebugInfo] = useState('')

  useEffect(() => {
    setDebugInfo(`orderId received: "${orderId}"`)

    if (!orderId || orderId.trim() === '') {
      setError('Order ID tidak ditemukan di URL.')
      setLoading(false)
      return
    }

    let cancelled = false

    async function load() {
      try {
        setDebugInfo(`Fetching: /api/pesanan/status?id=${orderId}`)
        const res = await fetch(`/api/pesanan/status?id=${orderId}`)
        setDebugInfo(`Response: ${res.status}`)

        if (cancelled) return

        if (!res.ok) {
          const text = await res.text()
          setDebugInfo(`Error body: ${text}`)
          setError(res.status === 404 ? 'Pesanan tidak ditemukan.' : `Error ${res.status}`)
          setLoading(false)
          return
        }

        const data: OrderStatus = await res.json()
        setDebugInfo(`Got data: status=${data.status}, resi=${data.resi}`)
        setOrder(data)
        setLoading(false)
      } catch (err) {
        if (!cancelled) {
          setDebugInfo(`Exception: ${String(err)}`)
          setError('Gagal terhubung ke server.')
          setLoading(false)
        }
      }
    }

    load()

    return () => { cancelled = true }
  }, [orderId])

  // Polling for pending/paid without resi
  useEffect(() => {
    if (!order) return
    if (order.status === 'paid' && order.resi) return
    if (order.status === 'cancelled' || order.status === 'expired') return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/pesanan/status?id=${orderId}`)
        if (res.ok) {
          const data: OrderStatus = await res.json()
          setOrder(data)
        }
      } catch {
        // silent - keep polling
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [order, orderId])

  const copyResi = () => {
    if (!order?.resi) return
    navigator.clipboard.writeText(order.resi)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const waLink = () => {
    const msg = encodeURIComponent(
      `Hai Herbal Insani 👋\nOrder: ${order?.order_id ?? orderId}\nProduk: ${order?.nama_produk ?? '-'} ×${order?.jumlah ?? '-'}\nResi: ${order?.resi ?? 'belum ada'}`
    )
    return `https://wa.me/6287824611695?text=${msg}`
  }

  // DEV DEBUG PANEL — shows what is happening
  const debugPanel = process.env.NODE_ENV === 'development' ? (
    <div className="fixed bottom-4 right-4 max-w-sm rounded-xl bg-black/80 p-3 text-xs text-green-400 font-mono z-50">
      <p className="font-bold mb-1">DEBUG</p>
      <p>orderId: {orderId || '(empty)'}</p>
      <p>loading: {String(loading)}</p>
      <p>error: {error ?? 'none'}</p>
      <p>status: {order?.status ?? 'no order'}</p>
      <p>resi: {order?.resi ?? 'none'}</p>
      <p className="mt-1 text-yellow-300">{debugInfo}</p>
    </div>
  ) : null

  if (loading) {
    return (
      <>
        <main className="flex min-h-screen items-center justify-center bg-background px-4">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">Mengambil data pesanan...</p>
            <p className="mt-2 text-xs text-muted-foreground font-mono">{orderId}</p>
          </div>
        </main>
        {debugPanel}
      </>
    )
  }

  if (error || !order) {
    return (
      <>
        <main className="flex min-h-screen items-center justify-center bg-background px-4">
          <div className="w-full max-w-md rounded-2xl border border-destructive/30 bg-card p-8 text-center shadow-sm">
            <XCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
            <p className="font-semibold">{error ?? 'Pesanan tidak ditemukan.'}</p>
            <p className="mt-2 text-xs text-muted-foreground font-mono">{orderId}</p>
            <div className="mt-6 flex flex-col gap-3">
              <a href={waLink()} target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">
                <MessageCircle className="h-4 w-4" />
                Hubungi WhatsApp
              </a>
              <a href="/home" className="text-sm text-primary underline">Kembali ke katalog</a>
            </div>
          </div>
        </main>
        {debugPanel}
      </>
    )
  }

  const isPaid = order.status === 'paid'
  const isCancelled = order.status === 'cancelled' || order.status === 'expired'

  return (
    <>
      <main className="min-h-screen bg-background px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-lg">
          <div className="mb-8 text-center">
            {isPaid
              ? <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"><CheckCircle className="h-8 w-8 text-primary" /></div>
              : isCancelled
              ? <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10"><XCircle className="h-8 w-8 text-destructive" /></div>
              : <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100"><Clock className="h-8 w-8 text-amber-600" /></div>
            }
            <h1 className="text-2xl font-bold text-foreground">
              {isPaid ? 'Pembayaran Berhasil!' : isCancelled ? 'Pesanan Dibatalkan' : 'Menunggu Konfirmasi'}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {isPaid ? 'Pesanan dikonfirmasi dan sedang disiapkan.'
                : isCancelled ? 'Pesanan dibatalkan atau kedaluwarsa.'
                : 'Halaman ini otomatis update setiap 5 detik...'}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-4">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-mono break-all">{order.order_id}</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Penerima</span><span className="font-medium">{order.nama_pembeli}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Produk</span><span className="font-medium">{order.nama_produk} ×{order.jumlah}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Ongkir ({order.kurir})</span><span>{formatRupiah(order.ongkir)}</span></div>
              <div className="flex justify-between border-t border-border pt-3 font-semibold">
                <span>Total Bayar</span>
                <span className="text-primary">{formatRupiah(order.total_bayar)}</span>
              </div>
            </div>
          </div>

          {isPaid && (
            <div className="mt-4 rounded-2xl border border-primary/30 bg-primary/5 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="h-5 w-5 text-primary" />
                <p className="font-semibold">Info Pengiriman</p>
              </div>
              {order.resi ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-xl bg-background border border-border px-4 py-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Nomor Resi</p>
                      <p className="font-mono font-semibold">{order.resi}</p>
                    </div>
                    <button onClick={copyResi}
                      className="flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/20">
                      <Copy className="h-3 w-3" />
                      {copied ? 'Tersalin!' : 'Salin'}
                    </button>
                  </div>
                  {order.tracking_link && (
                    <a href={order.tracking_link} target="_blank" rel="noreferrer"
                      className="block w-full rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground hover:opacity-90">
                      Lacak Paket Sekarang →
                    </a>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  Nomor resi sedang diproses, otomatis update...
                </div>
              )}
            </div>
          )}

          <div className="mt-4">
            <a href={waLink()} target="_blank" rel="noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary px-4 py-3 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition">
              <MessageCircle className="h-4 w-4" />
              Ada pertanyaan? Chat WhatsApp
            </a>
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Simpan halaman ini untuk melacak pesanan kamu.
          </p>
        </div>
      </main>
      {debugPanel}
    </>
  )
}
