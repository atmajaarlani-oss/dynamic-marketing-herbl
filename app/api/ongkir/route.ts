import { NextResponse } from 'next/server'
import { createPublicClient } from '@/lib/supabase-public'
import { signQuote } from '@/lib/quote'

type BiteshipPricing = {
  courier_code: string
  courier_name: string
  courier_service_name: string
  courier_service_code: string
  shipping_type: string
  price: number
  duration: string
}
type BiteshipRates = { success: boolean; pricing?: BiteshipPricing[] }

const KURIR_DIIZINKAN = ['jne', 'jnt']
const QUOTE_MENIT = 30

function gagal(status: number, message: string) {
  return NextResponse.json({ success: false, message }, { status })
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  const produkId = String(body?.produk_id ?? '')
  const villageId = String(body?.village_id ?? '')
  const jumlah = Number(body?.jumlah)
  if (!produkId || !villageId || !Number.isInteger(jumlah) || jumlah < 1 || jumlah > 20) {
    return gagal(400, 'Data tidak lengkap.')
  }

  const originPostal = process.env.BITESHIP_ORIGIN_POSTAL_CODE
  const apiKey = process.env.BITESHIP_API_KEY
  if (!originPostal || !apiKey) {
    console.error('BITESHIP_ORIGIN_POSTAL_CODE / BITESHIP_API_KEY belum diset')
    return gagal(500, 'Layanan ongkir belum dikonfigurasi.')
  }

  // Berat dan kode pos diambil dari DATABASE, bukan dari browser
  const supabase = createPublicClient()
  const [{ data: produk }, { data: desa }] = await Promise.all([
    supabase.from('produk').select('berat_gram, stok').eq('id', produkId).eq('is_active', true).maybeSingle(),
    supabase.from('wilayah_cari').select('kode_pos').eq('desa_id', villageId).maybeSingle(),
  ])
  if (!produk) return gagal(404, 'Produk tidak ditemukan.')
  if (!desa) return gagal(404, 'Wilayah tidak ditemukan.')
  if ((produk.stok ?? 0) < jumlah) return gagal(409, 'Stok tidak mencukupi.')
  const berat = (produk.berat_gram ?? 0) * jumlah
  if (berat <= 0) return gagal(422, 'Berat produk belum diisi.')

  const res = await fetch('https://api.biteship.com/v1/rates/couriers', {
    method: 'POST',
    headers: { Authorization: apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      origin_postal_code: Number(originPostal),
      destination_postal_code: Number(desa.kode_pos),
      couriers: KURIR_DIIZINKAN.join(','),
      items: [{ name: 'Produk', value: 0, weight: berat, quantity: 1 }],
    }),
    signal: AbortSignal.timeout(10000),
  }).catch((e: unknown) => {
    console.error('Biteship rates error:', e)
    return null
  })
  if (!res || !res.ok) {
    if (res) console.error('Biteship rates', res.status, await res.text())
    return gagal(502, 'Gagal mengambil ongkir. Coba lagi sebentar.')
  }

  const json = (await res.json()) as BiteshipRates
  // Hanya paket reguler: layanan 'freight' (mis. JNE Trucking, min. 10 kg) disaring
  const daftar = (json.pricing ?? []).filter(
    (p) => KURIR_DIIZINKAN.includes(p.courier_code) && p.shipping_type === 'parcel' && p.price > 0,
  )

  const exp = Date.now() + QUOTE_MENIT * 60 * 1000
  const data = await Promise.all(
    daftar
      .sort((a, b) => a.price - b.price)
      .map(async (p) => ({
        courier_code: p.courier_code,
        courier_name: p.courier_name,
        service_code: p.courier_service_code,
        service: p.courier_service_name,
        harga: p.price,
        estimasi: p.duration,
        quote: await signQuote({
          postal: desa.kode_pos, berat, kurir: p.courier_code, layanan: p.courier_service_code,
          harga: p.price, estimasi: p.duration, exp,
        }),
      })),
  )
  return NextResponse.json({ success: true, data })
}
