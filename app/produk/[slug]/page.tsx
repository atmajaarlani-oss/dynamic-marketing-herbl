import { notFound } from "next/navigation"
import type { Metadata } from "next"
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: produk } = await supabase.from("produk").select("nama_produk, headline_pain, gambar, harga_diskon, indikasi").eq("slug", slug).eq("is_active", true).single()

  if (!produk) return {}

  const product = produk as ProdukRow
  const title = firstNonEmpty(product.nama_produk, slug)
  const description = firstNonEmpty(product.headline_pain, product.indikasi, PENGATURAN_GLOBAL.metaDescriptionDefault)
  const gambar = getProductImage(product.gambar)

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Herbal Insani`,
      description,
      type: 'website',
      locale: 'id_ID',
      images: [{ url: gambar, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Herbal Insani`,
      description,
      images: [gambar],
    },
  }
}

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

  const hargaDiskon = Number(product.harga_diskon ?? 0)
  const namaProduk = product.nama_produk ?? slug
  const gambarProduk = getProductImage(product.gambar)
  const nomorBpom = product.bpom ?? product.nomor_bpom
  const stok = product.stok
  const isAvailable = stok !== null && stok !== undefined && stok > 0

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: namaProduk,
    description: firstNonEmpty(product.headline_pain, product.informasi, PENGATURAN_GLOBAL.metaDescriptionDefault),
    image: gambarProduk,
    brand: { '@type': 'Brand', name: 'Herbal Insani' },
    offers: {
      '@type': 'Offer',
      price: hargaDiskon,
      priceCurrency: 'IDR',
      availability: isAvailable ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    ...(nomorBpom ? { identifier: `BPOM ${nomorBpom}` } : {}),
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero painHeadline={painHeadline} hopeStatement={hopeStatement} namaProduk={namaProduk} gambar={gambarProduk} hargaUtama={Number(product.harga_utama ?? 0)} hargaDiskon={hargaDiskon} hargaPerHari={details.hargaPerHari} persenHemat={hitungPersenHemat(Number(product.harga_utama ?? 0), Number(product.harga_diskon ?? 0))} nomorBpom={nomorBpom} halalTersertifikasi={PENGATURAN_GLOBAL.halalTersertifikasi} />
      <ValidasiMasalah poinKeluhan={details.indikasi} />
      <EdukasiRingan penjelasan={details.edukasi} namaProduk={namaProduk} poin={details.edukasiPoin} />
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
      <TransaksiChat
        whatsappNumber={whatsappNumber}
        hargaProduk={hargaDiskon}
        beratPerUnit={Number(product.berat_gram ?? 1000)}
        productId={String(product.id)}
      />
      <RiskReversal policy={`${PENGATURAN_GLOBAL.syaratKetentuan} ${PENGATURAN_GLOBAL.disclaimerMedis}`} />
      <footer className="border-t border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
        <p>{namaProduk} · {formatStock(product.stok)} · {product.isi ? `Isi ${product.isi}` : formatRupiah(hargaDiskon)}</p>
        <p className="mt-2">{PENGATURAN_GLOBAL.infoPengiriman}</p>
      </footer>
    </main>
  )
}
