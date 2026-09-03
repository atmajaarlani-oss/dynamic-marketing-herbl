import { notFound } from "next/navigation"
import Link from "next/link"
import { Truck, MessageCircle, Home as HomeIcon, Package, CheckCircle2, Clock, XCircle, MapPin, ExternalLink } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { formatRupiah } from "@/lib/harga"
import { PENGATURAN_GLOBAL } from "@/lib/pengaturan-global"

export const runtime = 'nodejs'

type PesananRow = {
  midtrans_order_id: string
  status: string
  nama_produk: string
  jumlah: number
  nama_pembeli: string
  no_hp: string
  alamat: string
  district_name?: string | null
  city_name?: string | null
  province_name?: string | null
  postal_code?: string | number | null
  kurir_kode?: string | null
  kurir_layanan?: string | null
  ongkir: number
  total_bayar: number
  resi?: string | null
  catatan?: string | null
}

function StatusBadge({ status }: { status: string }) {
  const s = status?.toLowerCase() ?? ""
  let label = status
  let classes = "bg-muted text-muted-foreground border-border"
  let Icon: typeof Clock = Clock

  if (s === "paid" || s === "settlement" || s === "capture") {
    label = "Paid"
    classes = "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700"
    Icon = CheckCircle2
  } else if (s === "pending") {
    label = "Pending"
    classes = "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700"
    Icon = Clock
  } else if (s === "cancelled" || s === "cancel" || s === "expire" || s === "failure" || s === "deny") {
    label = "Cancelled"
    classes = "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700"
    Icon = XCircle
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${classes}`}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground break-words sm:text-right">{value || "—"}</dd>
    </div>
  )
}

export default async function PesananDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await params
  const supabase = await createClient()

  const { data: pesanan, error } = await supabase
    .from("pesanan")
    .select("*")
    .eq("midtrans_order_id", orderId)
    .maybeSingle()

  if (error || !pesanan) notFound()

  const order = pesanan as PesananRow
  const catatanUrl = order.catatan && /^https?:\/\//i.test(order.catatan) ? order.catatan : null

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-6 flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Detail Pesanan</h1>
        </div>

        {/* Status + Order ID header */}
        <section className="mb-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Order ID</p>
              <p className="mt-1 font-mono text-sm font-semibold text-foreground sm:text-base">
                {order.midtrans_order_id}
              </p>
            </div>
            <StatusBadge status={order.status} />
          </div>
        </section>

        {/* Resi highlight (only if present) */}
        {order.resi && (
          <section className="mb-6 rounded-2xl border border-primary/30 bg-primary/5 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">Nomor Resi</p>
                <p className="mt-1 break-all font-mono text-lg font-bold text-foreground sm:text-xl">
                  {order.resi}
                </p>
              </div>
            </div>
            {catatanUrl && (
              <div className="mt-4">
                <a
                  href={catatanUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 sm:w-auto"
                >
                  <ExternalLink className="h-4 w-4" />
                  Track Package
                </a>
              </div>
            )}
          </section>
        )}

        {/* Product */}
        <section className="mb-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Produk</h2>
          <dl className="space-y-3">
            <Row label="Nama Produk" value={order.nama_produk} />
            <Row label="Jumlah" value={`${order.jumlah} pcs`} />
          </dl>
        </section>

        {/* Buyer */}
        <section className="mb-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Pembeli</h2>
          <dl className="space-y-3">
            <Row label="Nama" value={order.nama_pembeli} />
            <Row label="No. HP" value={order.no_hp} />
            <Row label="Alamat" value={order.alamat} />
          </dl>
        </section>

        {/* Shipping area */}
        <section className="mb-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <MapPin className="h-4 w-4" />
            Area Pengiriman
          </h2>
          <dl className="space-y-3">
            <Row label="Kecamatan" value={order.district_name} />
            <Row label="Kota/Kabupaten" value={order.city_name} />
            <Row label="Provinsi" value={order.province_name} />
            <Row label="Kode Pos" value={order.postal_code} />
          </dl>
        </section>

        {/* Courier + Costs */}
        <section className="mb-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Pengiriman & Pembayaran</h2>
          <dl className="space-y-3">
            <Row
              label="Kurir"
              value={
                <span>
                  <span className="font-mono font-semibold">
                    {(order.kurir_kode || "").toUpperCase()}
                  </span>
                  {order.kurir_layanan && (
                    <span className="text-muted-foreground"> · {order.kurir_layanan}</span>
                  )}
                </span>
              }
            />
            <Row label="Ongkir" value={formatRupiah(order.ongkir)} />
            <Row
              label="Total Bayar"
              value={<span className="text-base font-bold text-primary">{formatRupiah(order.total_bayar)}</span>}
            />
          </dl>
        </section>

        {/* Footer actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/home"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            <HomeIcon className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
          <a
            href={PENGATURAN_GLOBAL.kontakWhatsapp}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" />
            Butuh bantuan? Chat WhatsApp
          </a>
        </div>
      </div>
    </main>
  )
}
