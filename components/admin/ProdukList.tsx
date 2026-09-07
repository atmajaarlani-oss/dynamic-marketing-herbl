"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type Produk = {
  id: string
  nama_produk: string
  slug: string
  harga_utama: number | null
  harga_diskon: number | null
  is_active: boolean | null
  stok: number | null
  gambar: string | null
}

const formatRupiah = (n: number | null | undefined) =>
  typeof n === "number" ? `Rp${n.toLocaleString("id-ID")}` : "-"

export default function ProdukList({ produk }: { produk: Produk[] }) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [busyId, setBusyId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return produk
    return produk.filter((p) => p.nama_produk?.toLowerCase().includes(q))
  }, [produk, search])

  async function handleDelete(id: string) {
    if (!confirm("Yakin ingin menghapus produk ini?")) return
    setBusyId(id)
    const response = await fetch(`/api/admin/produk/${id}`, { method: "DELETE" })
    setBusyId(null)
    if (!response.ok) {
      alert("Produk belum berhasil dihapus.")
      return
    }
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Cari nama produk..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary sm:max-w-sm"
        />
        <p className="text-xs text-muted-foreground">
          {filtered.length} dari {produk.length} produk
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Produk</th>
              <th className="px-4 py-3 font-medium">Harga utama</th>
              <th className="px-4 py-3 font-medium">Harga diskon</th>
              <th className="px-4 py-3 font-medium">Stok</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Tidak ada produk yang cocok dengan pencarian.
                </td>
              </tr>
            ) : (
              filtered.map((p) => {
                const isBusy = busyId === p.id
                return (
                  <tr key={p.id} className="bg-card">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.gambar ? (
                          <img
                            src={p.gambar}
                            alt={p.nama_produk}
                            className="h-10 w-10 flex-none rounded-lg border border-border object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
                            N/A
                          </div>
                        )}
                        <div>
                          <Link
                            href={`/admin/produk/${p.id}/edit`}
                            className="font-medium text-foreground hover:underline"
                          >
                            {p.nama_produk}
                          </Link>
                          <p className="text-xs text-muted-foreground">/{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground">{formatRupiah(p.harga_utama)}</td>
                    <td className="px-4 py-3 text-foreground">{formatRupiah(p.harga_diskon)}</td>
                    <td className="px-4 py-3 text-foreground">{p.stok ?? 0}</td>
                    <td className="px-4 py-3">
                      {p.is_active ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                          Nonaktif
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/produk/${p.id}/edit`}
                        className="mr-3 text-sm font-medium text-foreground hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        disabled={isBusy}
                        className="text-sm font-medium text-destructive hover:underline disabled:opacity-50"
                      >
                        {isBusy ? "Menghapus..." : "Hapus"}
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
