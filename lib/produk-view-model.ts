export type ProdukRow = Record<string, unknown> & {
  id?: string | null
  nama_produk?: string | null
  indikasi?: string | null
  kontraindikasi?: string | null
  kandungan?: string | null
  kandungan_aktif?: string | null
  komposisi?: string | null
  mekanisme?: string | null
  target_kerja?: string | null
  informasi?: string | null
  fungsi_utama?: string | null
  aturan_pakai?: string | null
  anjuran?: string | null
  gambar?: string | null
  harga_utama?: number | null
  harga_diskon?: number | null
  jumlah_satuan?: number | null
  dosis_harian_satuan?: number | null
  isi?: string | null
  stok?: number | null
  berat_gram?: number | null
  headline_pain?: string | null
  sub_headline_harapan?: string | null
  bpom?: string | null
  nomor_bpom?: string | null
}

export function splitComma(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean)
  return String(value ?? "").split(/[,+]/).map((item) => item.trim()).filter(Boolean)
}

export function firstNonEmpty(...values: unknown[]): string {
  return values.map((value) => String(value ?? "").trim()).find(Boolean) ?? ""
}

import { hitungHargaPerHari } from "@/lib/harga"


export function getProductImage(value: unknown): string {
  return splitComma(value)[0] ?? "/icon.svg"
}

export function formatStock(stok?: number | null): string {
  if (stok !== null && stok !== undefined && stok <= 5) return "Stok terbatas"
  return "Tersedia"
}

export function getProductDetails(product: ProdukRow) {
  const indikasi = splitComma(product.indikasi)
  const kontraindikasi = splitComma(product.kontraindikasi)
  const kandungan = splitComma(product.kandungan_aktif || product.kandungan)
  const komposisi = splitComma(product.komposisi)
  const mekanisme = splitComma(product.mekanisme)
  const targetKerja = splitComma(product.target_kerja)
  const isi = typeof product.jumlah_satuan === "number" ? product.jumlah_satuan : null
  const hargaDiskon = Number(product.harga_diskon ?? product.harga_utama ?? 0)

  return {
    indikasi,
    kontraindikasi,
    kandungan,
    komposisi,
    mekanisme,
    targetKerja,
    detailSections: [
      {
        title: "Target kerja",
        items: targetKerja.map((item) => ({ title: item, content: "" })),
      },
      {
        title: "Komposisi",
        items: komposisi.map((item) => ({ title: item, content: "" })),
      },
      {
        title: "Kandungan aktif",
        items: kandungan.map((item) => ({ title: item, content: "" })),
      },
      {
        title: "Mekanisme kerja",
        items: mekanisme.map((item) => ({ title: item, content: "" })),
      },
    ].filter((section) => section.items.length > 0),
    edukasi: firstNonEmpty(product.informasi, product.fungsi_utama, "Produk ini dirancang untuk menemani ikhtiar harian secara bertahap."),
    edukasiPoin: mekanisme.length ? mekanisme : indikasi.slice(0, 3),
    aturanPakai: splitComma(firstNonEmpty(product.aturan_pakai, product.anjuran)),
    hargaPerHari: hitungHargaPerHari(hargaDiskon, isi, product.dosis_harian_satuan),
  }
}
