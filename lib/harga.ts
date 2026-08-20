export function hitungHargaPerHari(
  hargaDiskon: number,
  jumlahSatuan?: number | null,
  dosisHarianSatuan?: number | null,
) {
  if (!jumlahSatuan || !dosisHarianSatuan) return null

  const jumlahHari = Math.floor(jumlahSatuan / dosisHarianSatuan)
  if (jumlahHari <= 0) return null

  return Math.round(hargaDiskon / jumlahHari)
}

export function hitungPersenHemat(hargaUtama: number, hargaDiskon: number) {
  if (!hargaUtama || hargaDiskon >= hargaUtama) return 0
  return Math.round(((hargaUtama - hargaDiskon) / hargaUtama) * 100)
}

export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value)
}

