export type DummyProduk = {
  slug: string
  nama_produk: string
  tagline: string
  deskripsi: string
  indikasi: string[]
  harga_utama: number
  harga_diskon: number
  satuan: string
  gambar: string
  kandungan: Array<{
    nama: string
    deskripsi: string
  }>
  cara_pakai: string[]
  stok: number
}

export const dummyProduk: DummyProduk = {
  slug: "herbal-pegal-linu",
  nama_produk: "Insani Rileks",
  tagline: "Teman alami untuk tubuh yang ingin kembali rileks.",
  deskripsi:
    "Formula herbal pilihan untuk menemani rutinitas harian dan membantu tubuh terasa lebih nyaman setelah beraktivitas.",
  indikasi: [
    "membantu meredakan pegal",
    "mendukung kelenturan sendi",
    "menemani tubuh tetap aktif",
  ],
  harga_utama: 150000,
  harga_diskon: 99000,
  satuan: "1 botol isi 60 kapsul",
  gambar: "/produk/insani-rileks.png",
  kandungan: [
    {
      nama: "Bahan herbal pilihan",
      deskripsi: "Dipilih untuk mendukung rasa nyaman dan kebugaran tubuh sehari-hari.",
    },
    {
      nama: "Ekstrak alami",
      deskripsi: "Diolah dengan perhatian agar praktis dikonsumsi dalam rutinitas harian.",
    },
  ],
  cara_pakai: [
    "Minum 2 kapsul setelah makan.",
    "Konsumsi dengan air putih yang cukup.",
    "Simpan di tempat sejuk dan kering.",
  ],
  stok: 24,
}

export const dummyProdukKedua: DummyProduk = {
  ...dummyProduk,
  slug: "herbal-jaga-stamina",
  nama_produk: "Insani Fit",
  tagline: "Dukungan herbal untuk menemani hari yang padat.",
  harga_utama: 175000,
  harga_diskon: 119000,
  satuan: "1 botol isi 60 kapsul",
}

export const dummyProdukKetiga: DummyProduk = {
  ...dummyProduk,
  slug: "herbal-jaga-lambung",
  nama_produk: "Insani Sejuk",
  tagline: "Teman herbal untuk rutinitas yang lebih nyaman.",
  harga_utama: 165000,
  harga_diskon: 109000,
  indikasi: [
    "membantu menjaga kenyamanan lambung",
    "menemani pola makan harian",
  ],
}

export const dummyProdukKeempat: DummyProduk = {
  ...dummyProduk,
  slug: "herbal-jaga-imun",
  nama_produk: "Insani Imun",
  tagline: "Dukungan alami untuk menjaga daya tahan tubuh.",
  harga_utama: 185000,
  harga_diskon: 129000,
  indikasi: [
    "mendukung daya tahan tubuh",
    "menemani aktivitas harian",
  ],
}

export const dummyProdukList = [
  dummyProduk,
  dummyProdukKedua,
  dummyProdukKetiga,
  dummyProdukKeempat,
]

export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value)
}

export function getDummyProdukBySlug(slug: string) {
  return dummyProdukList.find((produk) => produk.slug === slug)
}

// Fase 2: ganti data dummy ini dengan query ke Supabase.
// Jangan gunakan data ini sebagai sumber data produksi.
