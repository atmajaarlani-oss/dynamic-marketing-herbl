export const runtime = "edge"

import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { CaraPakai } from "@/components/landing/CaraPakai"
import { DetailKandungan } from "@/components/landing/DetailKandungan"
import { KeunggulanInsani } from "@/components/landing/KeunggulanInsani"
import { RiskReversal } from "@/components/landing/RiskReversal"
import { ValidasiMasalah } from "@/components/landing/ValidasiMasalah"
import { formatRupiah } from "@/lib/dummy-produk"

function splitText(value: string | null | undefined) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

export default async function ProdukDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: produk, error } = await supabase
    .from("produk")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (error || !produk) notFound()

  const indikasi = splitText(produk.indikasi)
  const kontraindikasi = splitText(produk.kontraindikasi)
  const kandungan = splitText(produk.kandungan)

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-2 lg:items-center lg:py-20">
        <div className="relative flex min-h-80 items-center justify-center overflow-hidden rounded-2xl bg-muted p-8 shadow-sm">
          {produk.gambar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={produk.gambar} alt={`Foto ${produk.nama_produk}`} className="max-h-96 w-full object-contain" />
          ) : (
            <span className="text-sm text-muted-foreground">Foto produk</span>
          )}
        </div>
        <section className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Herbal Insani</p>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">{produk.nama_produk}</h1>
          {produk.deskripsi && <p className="text-lg leading-8 text-muted-foreground">{produk.deskripsi}</p>}
          <ul className="grid gap-3 sm:grid-cols-2">
            {indikasi.map((item) => <li key={item} className="rounded-xl border bg-card p-4 text-sm shadow-sm">{item}</li>)}
          </ul>
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <p className="text-3xl font-bold text-primary">{formatRupiah(produk.harga_diskon)}</p>
            <p className="text-sm text-muted-foreground line-through">{formatRupiah(produk.harga_utama)}</p>
          </div>
        </section>
      </section>
      <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 sm:px-8">
        <ValidasiMasalah poinKeluhan={indikasi} />
        <DetailKandungan items={kandungan.map((nama) => ({ title: nama, content: "Kandungan pilihan yang digunakan dalam formula produk." }))} />
        <CaraPakai steps={[]} />
        <KeunggulanInsani />
        <RiskReversal />
        {kontraindikasi.length > 0 && <section className="rounded-2xl border bg-card p-6"><h2 className="font-semibold">Perhatian</h2><ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground">{kontraindikasi.map((item) => <li key={item}>{item}</li>)}</ul></section>}
      </div>
    </main>
  )
}
