import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const CACHE_TTL_MS = 24 * 60 * 60 * 1000

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  const produkId = String(body?.produk_id ?? '')
  const villageId = String(body?.village_id ?? '')
  const jumlah = Number(body?.jumlah)
  if (!produkId || !villageId || !Number.isInteger(jumlah) || jumlah < 1 || jumlah > 20) {
    return NextResponse.json({ success: false, message: 'Data tidak lengkap.' }, { status: 400 })
  }

  const originPostal = process.env.BITESHIP_ORIGIN_POSTAL_CODE
  const apiKey = process.env.BITESHIP_API_KEY
  if (!originPostal || !apiKey) {
    console.error('BITESHIP_ORIGIN_POSTAL_CODE / BITESHIP_API_KEY belum diset')
    return NextResponse.json({ success: false, message: 'Layanan ongkir belum dikonfigurasi.' }, { status: 500 })
  }

  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

  // Cek cache terlebih dahulu
  const { data: cache } = await supabase
    .from('ongkir_cache')
    .select('*')
    .eq('produk_id', produkId)
    .eq('village_id', villageId)
    .eq('jumlah', jumlah)
    .gt('expires_at', new Date())
    .maybeSingle()

  if (cache) {
    return NextResponse.json({ success: true, data: cache.rates, source: 'cache' })
  }

  // Cache miss: ambil data dari database
  const [{ data: produk }, { data: desa }] = await Promise.all([
    supabase.from('produk').select('berat_gram, stok').eq('id', produkId).eq('is_active', true).maybeSingle(),
    supabase.from('wilayah_cari').select('kode_pos').eq('desa_id', villageId).maybeSingle(),
  ])
  if (!produk) return NextResponse.json({ success: false, message: 'Produk tidak ditemukan.' }, { status: 404 })
  if (!desa) return NextResponse.json({ success: false, message: 'Wilayah tidak ditemukan.' }, { status: 404 })
  if ((produk.stok ?? 0) < jumlah) return NextResponse.json({ success: false, message: 'Stok tidak mencukupi.' }, { status: 409 })
  const berat = (produk.berat_gram ?? 0) * jumlah
  if (berat <= 0) return NextResponse.json({ success: false, message: 'Berat produk belum diisi.' }, { status: 422 })

  // Hit Biteship
  const res = await fetch('https://api.biteship.com/v1/rates', {
    method: 'POST',
    headers: { Authorization: apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      origin_postal_code: Number(originPostal),
      destination_postal_code: Number(desa.kode_pos),
      couriers: 'jne,jnt',
      items: [{ name: 'Produk', value: 0, weight: berat, quantity: 1 }],
    }),
    signal: AbortSignal.timeout(10000),
  }).catch((e: unknown) => {
    console.error('Biteship rates error:', e)
    return null
  })
  if (!res || !res.ok) {
    if (res) console.error('Biteship rates', res.status, await res.text())
    return NextResponse.json({ success: false, message: 'Gagal mengambil ongkir. Coba lagi sebentar.' }, { status: 502 })
  }

  const json = await res.json() as { success: boolean; pricing?: { courier_code: string; courier_name: string; courier_service_name: string; courier_service_code: string; shipping_type: string; price: number; duration: string }[] }
  const daftar = (json.pricing ?? []).filter(
    (p) => ['jne', 'jnt'].includes(p.courier_code) && p.shipping_type === 'parcel' && p.price > 0,
  )

  const rates = daftar.map((p) => ({
    courier_code: p.courier_code,
    courier_name: p.courier_name,
    service_code: p.courier_service_code,
    service: p.courier_service_name,
    harga: p.price,
    estimasi: p.duration,
  }))

  // Simpan ke cache
  await supabase.from('ongkir_cache').insert({
    produk_id: produkId,
    village_id: villageId,
    jumlah,
    berat,
    rates,
    expires_at: new Date(Date.now() + CACHE_TTL_MS),
  })

  return NextResponse.json({ success: true, data: rates, source: 'api' })
}
