export const runtime = "edge"

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Leaf } from "lucide-react"
import { createClient } from "@/lib/supabase"

function formatRupiah(value: number | null) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value ?? 0)
}

const ITEMS_PER_PAGE = 8

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ halaman?: string }>
}) {
  const halaman = Math.max(1, Number((await searchParams).halaman) || 1)
  const from = (halaman - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1
  const supabase = await createClient()
  const { data: produkList, count, error } = await supabase
    .from("produk")
    .select("slug, nama_produk, harga_utama, harga_diskon, gambar, indikasi", { count: "exact" })
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .range(from, to)

  const products = produkList ?? []
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / ITEMS_PER_PAGE))
  const hasPrevious = halaman > 1
  const hasNext = halaman < totalPages

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-10 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
            <Leaf aria-hidden="true" className="size-4" />
            Pilihan herbal Insani
          </div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            Temukan teman alami untuk rutinitas harian.
          </h1>
          <p className="mt-4 max-w-xl text-pretty leading-7 text-muted-foreground">
            Produk herbal pilihan yang dibuat untuk menemani tubuh tetap nyaman dan aktif.
          </p>
        </div>

        {error ? (
          <p className="rounded-2xl border border-destructive/30 bg-destructive/10 p-5 text-sm text-destructive">
            Produk belum dapat dimuat saat ini.
          </p>
        ) : products.length === 0 ? (
          <p className="rounded-2xl border bg-card p-8 text-center text-muted-foreground">
            Belum ada produk aktif.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((produk) => {
              const indikasi = (produk.indikasi ?? "")
                .split(",")
                .map((item: string) => item.trim())
                .filter(Boolean)

              return (
                <Link
                  key={produk.slug}
                  href={`/produk/${produk.slug}`}
                  className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="relative aspect-square overflow-hidden bg-secondary">
                    {produk.gambar ? (
                      <Image
                        src={produk.gambar}
                        alt={`Foto ${produk.nama_produk}`}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        Foto produk
                      </div>
                    )}
                  </div>
                  <div className="space-y-4 p-5">
                    <div>
                      <h2 className="text-lg font-semibold">{produk.nama_produk}</h2>
                      {indikasi[0] && (
                        <span className="mt-3 inline-block rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                          {indikasi[0]}
                        </span>
                      )}
                    </div>
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground line-through">
                          {formatRupiah(produk.harga_utama)}
                        </p>
                        <p className="text-xl font-bold text-primary">
                          {formatRupiah(produk.harga_diskon)}
                        </p>
                      </div>
                      <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <ArrowUpRight aria-hidden="true" className="size-4" />
                        <span className="sr-only">Lihat {produk.nama_produk}</span>
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {!error && totalPages > 1 && (
          <nav className="mt-10 flex items-center justify-between gap-4" aria-label="Navigasi halaman produk">
            {hasPrevious ? (
              <Link
                href={`/home?halaman=${halaman - 1}`}
                className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Sebelumnya
              </Link>
            ) : (
              <span aria-hidden="true" className="rounded-xl border border-border/50 px-4 py-2 text-sm text-muted-foreground/50">
                Sebelumnya
              </span>
            )}
            <p className="text-sm text-muted-foreground">
              Halaman <span className="font-semibold text-foreground">{halaman}</span> dari {totalPages}
            </p>
            {hasNext ? (
              <Link
                href={`/home?halaman=${halaman + 1}`}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Berikutnya
              </Link>
            ) : (
              <span aria-hidden="true" className="rounded-xl bg-primary/40 px-4 py-2 text-sm font-semibold text-primary-foreground/70">
                Berikutnya
              </span>
            )}
          </nav>
        )}
      </section>
    </main>
  )
}
