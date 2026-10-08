import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Midtrans from 'midtrans-client'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const BiteshipApiKey = process.env.BITESHIP_API_KEY!


function gagal(status: number, error: string) {
  return NextResponse.json({ success: false, error }, { status })
}

function normalisasiHp(raw: string): string | null {
  let d = raw.replace(/\D/g, '')
  if (d.startsWith('0')) d = '62' + d.slice(1)
  return /^628\d{8,11}$/.test(d) ? d : null
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) return gagal(400, 'Permintaan tidak valid.')

  const produkId = String(body.produk_id ?? '')
  const villageId = String(body.village_id ?? '')
  const jumlah = Number(body.jumlah)
  const nama = String(body.nama_pembeli ?? '').trim()
  const alamat = String(body.alamat ?? '').trim()
  const hp = normalisasiHp(String(body.no_hp ?? ''))

  if (!produkId || !villageId) return gagal(400, 'Data tidak lengkap.')
  if (!Number.isInteger(jumlah) || jumlah < 1 || jumlah > 20) return gagal(400, 'Jumlah beli tidak valid.')
  if (nama.length < 2 || nama.length > 100) return gagal(400, 'Nama tidak valid.')
  if (alamat.length < 10 || alamat.length > 300) return gagal(400, 'Alamat lengkap minimal 10 karakter.')
  if (!hp) return gagal(400, 'Nomor HP tidak valid. Contoh: 08123456789.')

  // 1. Validasi produk dari DB dan hitung subtotal/total server-side
  const { data: produk, error: produkError } = await supabase
    .from('produk')
    .select('id, nama, harga_satuan, berat_gram, stok')
    .eq('id', produkId)
    .maybeSingle()
  if (produkError || !produk) return gagal(404, 'Produk tidak ditemukan.')
  if (produk.stok < jumlah) return gagal(409, 'Maaf, stok tidak mencukupi.')

  const subtotal = produk.harga_satuan * jumlah
  const total = subtotal

  // 2. Buat order Biteship sebelum insert DB (non-fatal jika gagal)
  const orderId = `ORD-${Date.now()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`
  let biteshipOrderId: string | null = null
  try {
    const biteshipRes = await fetch('https://api.biteship.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BiteshipApiKey}`,
      },
      body: JSON.stringify({
        order_id: orderId,
        items: [
          {
            id: produkId.slice(0, 50),
            name: produk.nama.slice(0, 100),
            price: Math.round(subtotal),
            quantity: jumlah,
          },
        ],
        shipping_address: {
          first_name: nama.slice(0, 50),
          phone: hp,
          address: alamat.slice(0, 200),
          postal_code: '',
          country_code: 'IDN',
        },
      }),
    })
    if (biteshipRes.ok) {
      const biteshipData = await biteshipRes.json()
      biteshipOrderId = String((biteshipData as Record<string, unknown>).id ?? null) as string | null
    }
  } catch (e) {
    console.error('Biteship order gagal (non-fatal):', e)
  }

  // 3. Insert pesanan ke DB
  const { data: pesanan, error: insertError } = await supabase
    .from('pesanan')
    .insert({
      pesanan_id: orderId,
      produk_id: produkId,
      village_id: villageId,
      jumlah: jumlah,
      nama_pembeli: nama,
      no_hp: hp,
      alamat: alamat,
      subtotal: Math.round(subtotal),
      total: Math.round(total),
      midtrans_order_id: orderId,
      biteship_order_id: biteshipOrderId,
      status: 'pending',
      cached_at: new Date().toISOString(),
    })
    .select()
    .maybeSingle()
  if (insertError || !pesanan) {
    console.error('Insert pesanan gagal:', insertError)
    return gagal(500, 'Checkout gagal. Coba lagi.')
  }

  // 4. Buat Snap dan simpan token ke DB
  const snap = new Midtrans.Snap({
    isProduction: false,
    clientKey: process.env.MIDTRANS_CLIENT_KEY!,
  })
  try {
    const snapToken = await snap.createTransaction({
      transaction_details: { order_id: orderId, gross_amount: Math.round(total) },
      item_details: [
        { id: produkId.slice(0, 50), price: Math.round(subtotal), quantity: jumlah, name: produk.nama.slice(0, 50) },
        { id: 'ONGKIR', price: 0, quantity: 1, name: 'Ongkos Kirim' },
      ],
      customer_details: {
        first_name: nama.slice(0, 50),
        phone: hp,
        shipping_address: {
          first_name: nama.slice(0, 50),
          phone: hp,
          address: alamat.slice(0, 200),
          postal_code: '',
          country_code: 'IDN',
        },
      },
      expiry: { unit: 'minutes', duration: 60 },
    })
    await supabase.from('pesanan').update({ snap_token: snapToken }).eq('pesanan_id', pesanan.pesanan_id)
    return NextResponse.json({
      success: true,
      order_id: orderId,
      snap_token: snapToken,
      biteship_order_id: biteshipOrderId,
      total: Math.round(total),
    })
  } catch (e) {
    console.error('Snap gagal:', e)
    await supabase.from('pesanan').update({ status: 'cancelled' }).eq('pesanan_id', pesanan.pesanan_id)
    return gagal(502, 'Pembayaran belum dapat diproses. Coba lagi sebentar.')
  }
}
