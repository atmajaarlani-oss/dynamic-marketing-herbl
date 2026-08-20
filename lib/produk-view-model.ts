export type ProdukRow = Record<string, unknown> & {
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
  return String(value ?? "").split(",").map((item) => item.trim()).filter(Boolean)
}

export function firstNonEmpty(...values: unknown[]): string {
  return values.map((value) => String(value ?? "").trim()).find(Boolean) ?? ""
}

export function hitungHargaPerHari(harga: number, isi?: number | null, dosis?: number | null) {
  const hari = (isi ?? 0) / (dosis ?? 0)
  return hari > 0 ? harga / hari : null
}

export function getProductImage(value: unknown): string {
  return splitComma(value)[0] ?? "/placeholder.svg"
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
    detailKandungan: [
      ...kandungan.map((item) => ({ title: item, content: "Kandungan aktif yang tercantum pada formula produk." })),
      ...komposisi.map((item) => ({ title: `Komposisi: ${item}`, content: "Bagian dari komposisi produk yang diinformasikan secara transparan." })),
      ...targetKerja.map((item) => ({ title: `Target kerja: ${item}`, content: "Area dukungan formula yang dijelaskan dalam data produk." })),
      ...mekanisme.map((item) => ({ title: "Mekanisme kerja", content: item })),
    ],
    edukasi: firstNonEmpty(product.informasi, product.fungsi_utama, "Produk ini dirancang untuk menemani ikhtiar harian secara bertahap."),
    edukasiPoin: mekanisme.length ? mekanisme : indikasi.slice(0, 3),
    aturanPakai: splitComma(firstNonEmpty(product.aturan_pakai, product.anjuran)),
    hargaPerHari: hitungHargaPerHari(hargaDiskon, isi, product.dosis_harian_satuan),
  }
}
