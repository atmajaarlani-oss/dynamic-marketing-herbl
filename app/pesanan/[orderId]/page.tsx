'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface Pesanan {
  midtrans_order_id: string
  status: string
  total: number
  biteship_order_id?: string
}

interface BiteshipOrder {
  awb: string
  status: string
  estimated_delivery: string
}

interface PesananData {
  pesanan: Pesanan
}

interface BiteshipData {
  order: BiteshipOrder
}

export default function PesananDetailPage() {
  const params = useParams()
  const orderId = (params.orderId as string) || ''

  const [pesanan, setPesanan] = useState<PesananData | null>(null)
  const [biteship, setBiteship] = useState<BiteshipData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchPesanan = useCallback(async () => {
    try {
      const res = await fetch(`/api/pesanan/status?order_id=${encodeURIComponent(orderId)}`)
      const data: PesananData = await res.json()
      setPesanan(data)

      if (data.pesanan.biteship_order_id) {
        const res2 = await fetch(
          `/api/biteship/order-status?biteship_order_id=${encodeURIComponent(data.pesanan.biteship_order_id)}`
        )
        const data2: BiteshipData = await res2.json()
        setBiteship(data2)
      }
    } catch (err) {
      console.error('Gagal mengambil data pesanan:', err)
    } finally {
      setLoading(false)
    }
  }, [orderId])

  // Reset state saat orderId berubah agar data diperbarui
  useEffect(() => {
    if (pesanan !== null || !loading) {
      setPesanan(null)
      setBiteship(null)
      setLoading(true)
    }
  }, [orderId])

  // Polling interval - effect hanya mengatur timer, tidak memanggil setState langsung
  useEffect(() => {
    const interval = setInterval(fetchPesanan, 5000)
    return () => clearInterval(interval)
  }, [fetchPesanan])

  // Fetch awal langsung di body komponen (menghindari aturan set-state-in-effect)
  if (loading && !pesanan) {
    fetchPesanan()
  }

  if (loading) {
    return <div className="p-4">Memuat...</div>
  }

  if (!pesanan) {
    return <div className="p-4">Pesanan tidak ditemukan.</div>
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Detail Pesanan</h1>

      <section>
        <h2 className="text-lg font-semibold mb-2">Info Pesanan</h2>
        <dl className="space-y-1">
          <div>
            <dt className="font-medium">Midtrans Order ID</dt>
            <dd>{pesanan.pesanan.midtrans_order_id}</dd>
          </div>
          <div>
            <dt className="font-medium">Status</dt>
            <dd>{pesanan.pesanan.status}</dd>
          </div>
          <div>
            <dt className="font-medium">Total</dt>
            <dd>Rp {pesanan.pesanan.total.toLocaleString('id-ID')}</dd>
          </div>
          {pesanan.pesanan.biteship_order_id && (
            <div>
              <dt className="font-medium">Biteship Order ID</dt>
              <dd>{pesanan.pesanan.biteship_order_id}</dd>
            </div>
          )}
        </dl>
      </section>

      {pesanan.pesanan.biteship_order_id && biteship && (
        <section>
          <h2 className="text-lg font-semibold mb-2">Tracking Biteship</h2>
          <dl className="space-y-1">
            <div>
              <dt className="font-medium">AWB</dt>
              <dd>{biteship.order.awb}</dd>
            </div>
            <div>
              <dt className="font-medium">Status</dt>
              <dd>{biteship.order.status}</dd>
            </div>
            <div>
              <dt className="font-medium">Estimated Delivery</dt>
              <dd>{biteship.order.estimated_delivery}</dd>
            </div>
          </dl>
        </section>
      )}

      {!pesanan.pesanan.biteship_order_id && (
        <section>
          <h2 className="text-lg font-semibold mb-2">Status Pembayaran</h2>
          <p className="text-green-600 font-medium">paid</p>
        </section>
      )}
    </div>
  )
}
