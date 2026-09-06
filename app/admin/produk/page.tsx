import Link from "next/link"
import { createClient } from "@/lib/supabase"
import ProdukList from "@/components/admin/ProdukList"

export default async function AdminProdukPage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("produk")
    .select("id, nama_produk, slug, is_active, harga_utama, harga_diskon, stok, gambar")
    .order("nama_produk", { ascending: true })

  const produk = error ? [] : (data ?? [])

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Daftar Produk</h1>
          <p className="text-sm text-muted-foreground">Cari dan pilih produk untuk diedit.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin" className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:bg-background">Kembali</Link>
          <Link href="/admin/produk/baru" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90">Tambah produk</Link>
        </div>
      </header>

      {error ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">Data produk belum bisa dimuat. Coba muat ulang halaman.</p>
      ) : (
        <ProdukList produk={produk} />
      )}
    </section>
  )
}
