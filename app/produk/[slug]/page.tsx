export const runtime = "edge"

import { notFound } from "next/navigation"
import Hero from "@/components/landing/Hero"
import { ValidasiMasalah } from "@/components/landing/ValidasiMasalah"
import { EdukasiRingan } from "@/components/landing/EdukasiRingan"
import { SocialProof } from "@/components/landing/SocialProof"
import { PerbandinganNilai } from "@/components/landing/PerbandinganNilai"
import { DetailKandungan } from "@/components/landing/DetailKandungan"
import { CaraPakai } from "@/components/landing/CaraPakai"
import { KeunggulanInsani } from "@/components/landing/KeunggulanInsani"
import { TransaksiChat } from "@/components/landing/TransaksiChat"
import { RiskReversal } from "@/components/landing/RiskReversal"
import { createClient } from "@/lib/supabase"
import { PENGATURAN_GLOBAL } from "@/lib/pengaturan-global"
import { formatRupiah } from "@/lib/dummy-produk"
import { hitungPersenHemat } from "@/lib/harga"
import { getProductDetails, getProductImage, firstNonEmpty, formatStock, type ProdukRow } from "@/lib/produk-view-model"

export default async function ProdukDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: produk, error } = await supabase.from("produk").select("*").eq("slug", slug).eq("is_active", true).single()
  if (error || !produk) notFound()

  const product = produk as ProdukRow
  const details = getProductDetails(product)
  const painHeadline = firstNonEmpty(product.headline_pain, details.indikasi[0], product.nama_produk)
  const hopeStatement = firstNonEmpty(product.sub_headline_harapan, product.fungsi_utama, product.informasi, "Dukungan herbal untuk menemani ikhtiar harian Anda.")
  const whatsappNumber = PENGATURAN_GLOBAL.kontakWhatsapp.replace(/\D/g, "").replace(/^0/, "62")

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero painHeadline={painHeadline} hopeStatement={hopeStatement} namaProduk={product.nama_produk ?? slug} gambar={getProductImage(product.gambar)} hargaUtama={Number(product.harga_utama ?? 0)} hargaDiskon={Number(product.harga_diskon ?? 0)} hargaPerHari={details.hargaPerHari} persenHemat={hitungPersenHemat(Number(product.harga_utama ?? 0), Number(product.harga_diskon ?? 0))} nomorBpom={product.bpom ?? product.nomor_bpom} halalTersertifikasi={PENGATURAN_GLOBAL.halalTersertifikasi} />
      <ValidasiMasalah poinKeluhan={details.indikasi} />
      <EdukasiRingan penjelasan={details.edukasi} poin={details.edukasiPoin} />
      <SocialProof />
      <PerbandinganNilai />
      <DetailKandungan sections={details.detailSections} />
      <CaraPakai steps={details.aturanPakai} />
      {details.kontraindikasi.length > 0 && (
        <section className="bg-background px-4 py-14 sm:px-6 lg:px-8" aria-labelledby="kontraindikasi-title">
          <div className="mx-auto max-w-3xl rounded-2xl border border-amber-200 bg-card p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Kontraindikasi</p>
            <h2 id="kontraindikasi-title" className="mt-2 text-2xl font-semibold text-foreground">konsultasikan dahulu jika ada kondisi</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">{details.kontraindikasi.map((item) => <li key={item} className="rounded-xl border border-border bg-card p-4 text-sm leading-6">{item}</li>)}</ul>
          </div>
        </section>
      )}
      <KeunggulanInsani producerName="PT Insani" story={PENGATURAN_GLOBAL.keunggulanPtInsani} />
      <TransaksiChat whatsappNumber={whatsappNumber} />
      <RiskReversal policy={`${PENGATURAN_GLOBAL.syaratKetentuan} ${PENGATURAN_GLOBAL.disclaimerMedis}`} />
      <footer className="border-t border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
        <p>{product.nama_produk} · {formatStock(product.stok)} · {product.isi ? `Isi ${product.isi}` : formatRupiah(Number(product.harga_diskon ?? 0))}</p>
        <p className="mt-2">{PENGATURAN_GLOBAL.infoPengiriman}</p>
      </footer>
    </main>
  )
}
