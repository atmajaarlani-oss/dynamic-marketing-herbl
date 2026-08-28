export const runtime = "edge"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Leaf, MessageCircle } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { PENGATURAN_GLOBAL } from "@/lib/pengaturan-global"

function formatRupiah(value: number | null) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value ?? 0)
}

const ITEMS_PER_PAGE = 8

export default async function HomePage({ searchParams }: { searchParams: Promise<{ halaman?: string }> }) {
  const halaman = Math.max(1, Number((await searchParams).halaman) || 1)
  const from = (halaman - 1) * ITEMS_PER_PAGE
  const supabase = await createClient()
  const { data: produkList, count, error } = await supabase.from("produk").select("slug, nama_produk, harga_utama, harga_diskon, gambar, indikasi", { count: "exact" }).eq("is_active", true).order("created_at", { ascending: false }).range(from, from + ITEMS_PER_PAGE - 1)
  const products = produkList ?? []
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / ITEMS_PER_PAGE))

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/70 bg-background/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/home" className="flex items-center gap-2 font-semibold tracking-tight text-primary"><span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Leaf aria-hidden="true" className="size-5" /></span>Herbal Insani</Link>
          <nav className="flex items-center gap-3 text-sm"><a href="#produk" className="hidden text-muted-foreground transition hover:text-foreground sm:inline">Produk</a><a href={PENGATURAN_GLOBAL.kontakWhatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 font-semibold text-primary-foreground transition hover:opacity-90"><MessageCircle aria-hidden="true" className="size-4" /> Chat</a></nav>
        </div>
      </header>

      <section className="border-b border-border/60 bg-secondary/45 px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl"><p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">Pilihan herbal untuk keseharian</p><h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">Temukan dukungan alami yang terasa dekat.</h1><p className="mt-5 max-w-xl text-pretty leading-7 text-muted-foreground">{PENGATURAN_GLOBAL.deskripsiSingkat}</p></div>
          <Link href="#produk" className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary">Lihat koleksi <ArrowRight aria-hidden="true" className="size-4" /></Link>
        </div>
      </section>

      <section id="produk" className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Koleksi kami</p><h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Pilih yang sesuai kebutuhanmu</h2></div><span className="hidden text-sm text-muted-foreground sm:block">{count ?? 0} produk aktif</span></div>
        {error ? <p className="rounded-2xl border border-destructive/30 bg-destructive/10 p-5 text-sm text-destructive">Produk belum dapat dimuat saat ini.</p> : products.length === 0 ? <p className="rounded-2xl border bg-card p-8 text-center text-muted-foreground">Belum ada produk aktif.</p> : <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map((produk) => { const indikasi = (produk.indikasi ?? "").split(",").map((item: string) => item.trim()).filter(Boolean); return <Link key={produk.slug} href={`/produk/${produk.slug}`} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><div className="relative aspect-square overflow-hidden bg-secondary">{produk.gambar ? <Image src={produk.gambar} alt={`Foto ${produk.nama_produk}`} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Foto produk</div>}</div><div className="space-y-4 p-5"><div><h3 className="text-lg font-semibold">{produk.nama_produk}</h3>{indikasi[0] && <span className="mt-3 inline-block rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">{indikasi[0]}</span>}</div><div className="flex items-end justify-between gap-3"><div><p className="text-xs text-muted-foreground line-through">{formatRupiah(produk.harga_utama)}</p><p className="text-xl font-bold text-primary">{formatRupiah(produk.harga_diskon)}</p></div><span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground"><ArrowUpRight aria-hidden="true" className="size-4" /></span></div></div></Link> })}</div>}
        {!error && totalPages > 1 && <nav className="mt-10 flex items-center justify-between gap-4" aria-label="Navigasi halaman produk"><Link aria-disabled={halaman === 1} className={`rounded-xl border border-border px-4 py-2 text-sm font-semibold ${halaman === 1 ? "pointer-events-none opacity-40" : "hover:bg-secondary"}`} href={`/home?halaman=${Math.max(1, halaman - 1)}`}>Sebelumnya</Link><p className="text-sm text-muted-foreground">Halaman <strong className="text-foreground">{halaman}</strong> dari {totalPages}</p><Link aria-disabled={halaman === totalPages} className={`rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground ${halaman === totalPages ? "pointer-events-none opacity-40" : "hover:opacity-90"}`} href={`/home?halaman=${Math.min(totalPages, halaman + 1)}`}>Berikutnya</Link></nav>}
      </section>

      <footer className="border-t border-border bg-secondary/35 px-5 py-10 sm:px-8"><div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between"><div className="max-w-sm"><Link href="/home" className="font-semibold text-primary">Herbal Insani</Link><p className="mt-3 text-sm leading-6 text-muted-foreground">{PENGATURAN_GLOBAL.tagline}. Kami hadir dengan informasi yang jujur agar kamu bisa memilih dengan tenang.</p></div><div className="flex flex-col gap-2 text-sm text-muted-foreground"><span className="font-semibold text-foreground">Butuh bantuan?</span><a className="transition hover:text-primary" href={PENGATURAN_GLOBAL.kontakWhatsapp} target="_blank" rel="noreferrer">Chat melalui WhatsApp</a><a className="transition hover:text-primary" href={`mailto:${PENGATURAN_GLOBAL.kontakEmail}`}>Email kami</a></div></div><div className="mx-auto mt-8 max-w-6xl border-t border-border pt-5 text-xs leading-5 text-muted-foreground">{PENGATURAN_GLOBAL.disclaimerMedis}</div></footer>
    </main>
  )
}
