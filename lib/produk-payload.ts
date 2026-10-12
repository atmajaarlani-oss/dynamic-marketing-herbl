export function pilihFieldProduk(
  body: unknown,
): Record<string, string | number | boolean | null> | null {
  if (Object.prototype.toString.call(body) !== "[object Object]") return null

  const allowedText = new Set([
    "nama_produk",
    "slug",
    "bpom",
    "headline_pain",
    "sub_headline_harapan",
    "cerita_singkat",
    "informasi",
    "indikasi",
    "fungsi_utama",
    "mekanisme",
    "target_kerja",
    "kandungan_aktif",
    "komposisi",
    "isi",
    "aturan_pakai",
    "anjuran",
    "kontraindikasi",
    "gambar",
  ])
  const allowedNumber = new Set([
    "harga_utama",
    "harga_diskon",
    "jumlah_satuan",
    "dosis_harian_satuan",
    "berat_gram",
    "stok",
  ])
  const allowedBool = new Set(["is_active"])

  const result: Record<string, string | number | boolean | null> = {}

  for (const [key, value] of Object.entries(body)) {
    if (allowedText.has(key)) {
      if (value === null || typeof value === "string") {
        result[key] = value as string | null
      } else {
        return null
      }
    } else if (allowedNumber.has(key)) {
      if (value === null) {
        if (key === "harga_utama" || key === "harga_diskon") return null
        result[key] = null
      } else if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
        result[key] = value
      } else {
        return null
      }
    } else if (allowedBool.has(key)) {
      if (typeof value === "boolean") {
        result[key] = value
      } else {
        return null
      }
    }
    // field lain (id, created_at, updated_at, dst) dibuang diam-diam
  }

  return result
}
