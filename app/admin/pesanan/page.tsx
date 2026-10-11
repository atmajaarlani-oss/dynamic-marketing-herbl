import Link from "next/link"
import { createClient } from "@/lib/supabase"
import KirimUlangButton from "@/components/admin/KirimUlangButton"

export default async function AdminPesananPage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("pesanan")
    .select("midtrans_order_id, nama_pembeli, nama_produk, jumlah, total_bayar, status, status_pengiriman, resi, pengiriman_error, created_at")
    .order("created_at", { ascending: false })
    .limit(50)

  const pesanan = error ? [] : (data ?? [])

  const badgeClass = (status: string) => {
    switch (status) {
      case "dibuat":
        return "bg-emerald-100 text-emerald-700"
      case "gagal":
        return "bg-red-100 text-red-700"
      case "memproses":
        return "bg-yellow-100 text-yellow-700"
      case "belum_dibuat":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Daftar Pesanan</h1>
          <p className="text-sm text-muted-foreground">Riwayat pesanan dan status pengiriman.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin" className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:bg-background">Kembali</Link>
        </div>
      </header>

      {error ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">Data pesanan belum bisa dimuat. Coba muat ulang halaman.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Pembeli</th>
                <th className="px-4 py-3 font-medium">Produk</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Pengiriman</th>
                <th className="px-4 py-3 font-medium">Resi</th>
                <th className="px-4 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pesanan.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    Tidak ada pesanan.
                  </td>
                </tr>
              ) : (
                pesanan.map((p) => (
                  <tr key={p.midtrans_order_id} className="bg-card">
                    <td className="px-4 py-3 text-foreground">{p.midtrans_order_id}</td>
                    <td className="px-4 py-3 text-foreground">{p.nama_pembeli}</td>
                    <td className="px-4 py-3 text-foreground">{p.nama_produk}</td>
                    <td className="px-4 py-3 text-foreground">
                      {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(p.total_bayar ?? 0)}
                    </td>
                    <td className="px-4 py-3 text-foreground">{p.status}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass(p.status_pengiriman)}`}>
                        {p.status_pengiriman}
                      </span>
                      {p.pengiriman_error ? (
                        <p className="mt-1 text-xs text-destructive">{p.pengiriman_error}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-foreground">{p.resi ?? "-"}</td>
                    <td className="px-4 py-3 text-right">
                      {p.status === "paid" && p.status_pengiriman !== "dibuat" ? (
                        <KirimUlangButton orderId={p.midtrans_order_id} />
                      ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
