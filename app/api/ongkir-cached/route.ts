import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const CACHE_TTL_MS = 24 * 60 * 60 * 1000

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) {
    return NextResponse.json(
      { success: false, message: 'Permintaan tidak valid.' },
      { status: 400 }
    )
  }

  const produkId = String(body.produk_id ?? '').trim()
  const villageId = String(body.village_id ?? '').trim()
  const jumlah = Number(body.jumlah ?? 0)

  if (!produkId || !villageId || !Number.isInteger(jumlah) || jumlah < 1 || jumlah > 20) {
    return NextResponse.json(
      { success: false, message: 'Data tidak lengkap.' },
      { status: 400 }
    )
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const originPostal = process.env.BITESHIP_ORIGIN_POSTAL_CODE
  const apiKey = process.env.BITESHIP_API_KEY
  if (!originPostal || !apiKey) {
    return NextResponse.json(
      { success: false, message: 'Layanan ongkir belum dikonfigurasi.' },
      { status: 500 }
    )
  }

  // Cek cache terlebih dahulu
  const { data: cacheRows, error: cacheError } = await supabase
    .from('ongkir_cache')
    .select('*')
    .eq('destination_area_id', villageId)
    .gt('expires_at', new Date().toISOString())
    .limit(10)

  if (!cacheError && Array.isArray(cacheRows) && cacheRows.length > 0) {
    const data = cacheRows.map((row) => ({
      courier_code: row.courier_id,
      courier_name: row.courier_name,
      service_code: 'default',
      service: 'Reguler',
      harga: Number(row.cost ?? 0),
      estimasi: String(row.estimated_days ?? 0),
    }))

    return NextResponse.json({ success: true, data, source: 'cache' })
  }

  // Cache miss: ambil dari DB dan Biteship
  const { data: produk, error: produkError } = await supabase
    .from('produk')
    .select('id, nama_produk, harga_utama, harga_diskon, stok, berat_gram')
    .eq('id', produkId)
    .maybeSingle()

  if (produkError || !produk) {
    return NextResponse.json(
      { success: false, message: 'Produk tidak ditemukan.' },
      { status: 404 }
    )
  }

  const { data: desa, error: desaError } = await supabase
    .from('wilayah_cari')
    .select('kode_pos')
    .eq('desa_id', villageId)
    .maybeSingle()

  if (desaError || !desa?.kode_pos) {
    return NextResponse.json(
      { success: false, message: 'Wilayah tidak ditemukan.' },
      { status: 404 }
    )
  }

  const stok = Number(produk.stok ?? 0)
  if (stok < jumlah) {
    return NextResponse.json(
      { success: false, message: 'Stok tidak mencukupi.' },
      { status: 409 }
    )
  }

  const hargaJual = Number(produk.harga_diskon ?? produk.harga_utama ?? 0)
  const berat = (Number(produk.berat_gram ?? 0) || 0) * jumlah
  if (berat <= 0) {
    return NextResponse.json(
      { success: false, message: 'Berat produk belum diisi.' },
      { status: 422 }
    )
  }

  const res = await fetch('https://api.biteship.com/v1/rates', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      origin_postal_code: Number(originPostal),
      destination_postal_code: Number(desa.kode_pos),
      couriers: 'jne,jnt',
      items: [
        {
          name: produk.nama_produk,
          value: Math.round(hargaJual),
          weight: berat,
          quantity: 1,
        },
      ],
    }),
    signal: AbortSignal.timeout(10000),
  }).catch((e: unknown) => {
    console.error('Biteship rates error:', e)
    return null
  })

  if (!res || !res.ok) {
    if (res) {
      const text = await res.text().catch(() => '')
      console.error('Biteship rates gagal:', res.status, text)
    }
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil ongkir. Coba lagi sebentar.' },
      { status: 502 }
    )
  }

  const json = (await res.json()) as {
    pricing?: Array<{
      courier_code: string
      courier_name: string
      courier_service_code: string
      courier_service_name: string
      price: number
      duration: string
      shipping_type: string
    }>
  }

  const daftar = (json.pricing ?? []).filter(
    (p) =>
      ['jne', 'jnt'].includes((p.courier_code ?? '').toLowerCase()) &&
      p.shipping_type === 'parcel' &&
      Number(p.price ?? 0) > 0
  )

  const rates = daftar.map((p) => ({
    courier_code: p.courier_code,
    courier_name: p.courier_name,
    service_code: p.courier_service_code,
    service: p.courier_service_name,
    harga: Number(p.price ?? 0),
    estimasi: String(p.duration ?? '0'),
  }))

  // Simpan ke cache
  if (rates.length > 0) {
    for (const rate of rates) {
      await supabase
        .from('ongkir_cache')
        .insert({
          destination_area_id: villageId,
          courier_id: rate.courier_code,
          courier_name: rate.courier_name,
          cost: Number(rate.harga),
          estimated_days: Number(String(rate.estimasi).replace(/\D/g, '') || 0),
          cached_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + CACHE_TTL_MS).toISOString(),
        })
    }
  }

  return NextResponse.json({ success: true, data: rates, source: 'api' })
}
