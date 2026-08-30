'use client'

import { useEffect, useState, useCallback } from 'react'
import { CheckCircle, Clock, Package, Truck, Copy, MessageCircle, XCircle } from 'lucide-react'

interface OrderStatus {
  order_id: string
  nama_pembeli: string
  namaProduk: string
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

export default function StatusClient({ orderId }: { orderId: string | null }) {
  console.log('[StatusClient] Component mounted, orderId prop:', orderId)
  const [order, setOrder] = useState<OrderStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const fetchStatus = useCallback(async () => {
    console.log('[StatusClient] fetchStatus called, orderId:', orderId)
    if (!orderId) return
    try {
      console.log('[StatusClient] About to fetch:', `/api/pesanan/status?id=${orderId}`)
      const res = await fetch(`/api/pesanan/status?id=${orderId}`)
      if (!res.ok) {
        setError(res.status === 404
          ? 'Pesanan tidak ditemukan.'
          : 'Gagal memuat status. Coba refresh halaman.')
        setLoading(false)
        return
      }
      const data: OrderStatus = await res.json()
      setOrder(data)
      setLoading(false)
    } catch {
      setError('Koneksi gagal. Coba refresh halaman.')
      setLoading(false)
    }
  }, [orderId])

  useEffect(() => {
    console.log('[StatusClient] Main useEffect fired, orderId:', orderId)
    if (!orderId) {
      setError('Order ID tidak ditemukan di URL.')
      setLoading(false)
      return
    }
    fetchStatus()
  }, [fetchStatus, orderId])

  // Poll every 5 seconds if pending or paid without resi yet
  useEffect(() => {
    if (!order) return
    if (order.status === 'paid' && order.resi) return
    if (order.status === 'cancelled' || order.status === 'expired') return

    const interval = setInterval(fetchStatus, 5000)
    return () => clearInterval(interval)
  }, [order, fetchStatus])

  const handleCopyResi = () => {
    if (!order?.resi) return
    navigator.clipboard.writeText(order.resi)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const whatsappLink = () => {
    const phone = '6287824611695'
    const msg = encodeURIComponent(
      `Hai, ada yang bisa dibantu nih 👋\n\nSaya ingin menanyakan pesanan:\n\n` +
      `Order ID: ${order?.order_id ?? orderId}\n` +
      `Produk: ${order?.namaProduk ?? '-'} ×${order?.jumlah ?? '-'}\n` +
      `Resi: ${order?.resi ?? 'sedang diproses'}\n\nTerima kasih.`
    )
    return `https://wa.me/${phone}?text=${msg}`
  }

  if (!orderId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-2xl border border-destructive/30 bg-card p-8 text-center">
          <XCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
          <p className="font-semibold">Link tidak valid — tidak ada Order ID.</p>
          <a href="/home" className="mt-4 inline-block text-sm text-primary underline">Kembali ke katalog</a>
        </div>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Mengambil data pesanan...</p>
          <p className="mt-2 text-xs text-muted-foreground font-mono">{orderId}</p>
        </div>
      </main>
    )
  }

  if (error || !order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-2xl border border-destructive/30 bg-card p-8 text-center">
          <XCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
          <p className="font-semibold">{error ?? 'Pesanan tidak ditemukan.'}</p>
          <p className="mt-2 text-xs text-muted-foreground font-mono">{orderId}</p>
          <div className="mt-6 flex flex-col gap-3">
            <a href={whatsappLink()} target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">
              <MessageCircle className="h-4 w-4" />
              Hubungi Kami via WhatsApp
            </a>
            <a href="/home" className="text-sm text-primary underline">Kembali ke katalog</a>
          </div>
        </div>
      </main>
    )
  }

  const isPaid = order.status === 'paid'
  const isCancelled = order.status === 'cancelled' || order.status === 'expired'

  return (
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
            {isPaid
              ? 'Pesanan dikonfirmasi dan sedang disiapkan.'
              : isCancelled
              ? 'Pesanan ini telah dibatalkan atau kedaluwarsa.'
              : 'Pembayaran sedang diverifikasi, halaman ini otomatis update...'}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-4">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-mono break-all">{order.order_id}</span>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Penerima</span>
              <span className="font-medium">{order.nama_pembeli}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Produk</span>
              <span className="font-medium">{order.namaProduk} ×{order.jumlah}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatRupiah(Number(order.harga_satuan) * order.jumlah)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ongkir ({order.kurir})</span>
              <span>{formatRupiah(order.ongkir)}</span>
            </div>
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
                    <p className="text-xs text-muted-foreground mb-1">Nomor Resi ({order.kurir})</p>
                    <p className="font-mono font-semibold">{order.resi}</p>
                  </div>
                  <button onClick={handleCopyResi}
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
          <a href={whatsappLink()} target="_blank" rel="noreferrer"
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
  )
}
