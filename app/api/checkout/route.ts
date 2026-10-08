import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSnapTransaction } from '../../../lib/midtrans'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const BITESHIP_API_KEY = process.env.BITESHIP_API_KEY

function gagal(status: number, message: string) {
  return NextResponse.json({ success: false, error: message }, { status })
}

function normalisasiHp(raw: string): string | null {
  let d = raw.replace(/\D/g, '')
  if (!d) return null
  if (d.startsWith('0')) d = '62' + d.slice(1)
  return /^628\d{8,11}$/.test(d) ? d : null
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) return gagal(400, 'Permintaan tidak valid.')

  const produkId = String(body.produk_id ?? '').trim()
  const villageId = String(body.village_id ?? '').trim()
  const jumlah = Number(body.jumlah ?? 0)
  const nama = String(body.nama_pembeli ?? '').trim()
  const alamat = String(body.alamat ?? '').trim()
  const hp = normalisasiHp(String(body.no_hp ?? ''))
  const ongkir = Number(body.ongkir ?? 0)
  const kurirKode = String(body.kurir_kode ?? '').trim()
  const kurirLayanan = String(body.kurir_layanan ?? '').trim()

  if (!produkId || !villageId) return gagal(400, 'Data tidak lengkap.')
  if (!Number.isInteger(jumlah) || jumlah < 1 || jumlah > 20) {
    return gagal(400, 'Jumlah beli tidak valid.')
  }
  if (nama.length < 2 || nama.length > 100) {
    return gagal(400, 'Nama tidak valid.')
  }
  if (alamat.length < 10 || alamat.length > 300) {
    return gagal(400, 'Alamat lengkap minimal 10 karakter.')
  }
  if (!hp) return gagal(400, 'Nomor HP tidak valid. Contoh: 08123456789.')

  const { data: produk, error: produkError } = await supabase
    .from('produk')
    .select('id, slug, nama_produk, harga_utama, harga_diskon, stok, berat_gram')
    .eq('id', produkId)
    .maybeSingle()

  if (produkError || !produk) return gagal(404, 'Produk tidak ditemukan.')
  if ((produk.stok ?? 0) < jumlah) return gagal(409, 'Maaf, stok tidak mencukupi.')

  const hargaJual = Number(produk.harga_diskon ?? produk.harga_utama ?? 0)
  const subtotalProduk = hargaJual * jumlah
  const totalBayar = subtotalProduk + ongkir

  const orderId = `ORD-${Date.now()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`

  let biteshipOrderId: string | null = null
  if (BITESHIP_API_KEY) {
    try {
      const biteshipRes = await fetch('https://api.biteship.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${BITESHIP_API_KEY}`,
        },
        signal: AbortSignal.timeout(10000),
        body: JSON.stringify({
          order_id: orderId,
          origin: {
            contact_name: process.env.BITESHIP_ORIGIN_CONTACT_NAME ?? '',
            contact_phone: process.env.BITESHIP_ORIGIN_CONTACT_PHONE ?? '',
            address: process.env.BITESHIP_ORIGIN_ADDRESS ?? '',
            postal_code: process.env.BITESHIP_ORIGIN_POSTAL_CODE ?? '',
            area_id: process.env.BITESHIP_ORIGIN_AREA_ID ?? '',
          },
          destination: {
            contact_name: nama,
            contact_phone: hp,
            address: alamat,
            postal_code: Number(body.postal_code ?? ''),
            area_id: villageId,
          },
          courier: {
            company: kurirKode?.toLowerCase() || 'jne',
            type: kurirLayanan?.toLowerCase() || 'regular',
          },
          amount: Math.round(totalBayar),
          items: [
            {
              name: produk.nama_produk,
              value: Math.round(hargaJual),
              quantity: jumlah,
              weight: (Number(produk.berat_gram ?? 0) || 0) * jumlah,
            },
          ],
        }),
      })

      if (biteshipRes.ok) {
        const biteshipData = await biteshipRes.json().catch(() => ({}))
        biteshipOrderId = biteshipData.id || biteshipData.data?.id || null
      }
    } catch (e) {
      console.error('Biteship order gagal (non-fatal):', e)
    }
  }

  const { data: pesanan, error: insertError } = await supabase
    .from('pesanan')
    .insert({
      nama_pembeli: nama,
      no_hp: hp,
      alamat: alamat,
      produk_id: produkId,
      produk_slug: produk.slug,
      nama_produk: produk.nama_produk,
      village_id: villageId,
      jumlah,
      harga_satuan: hargaJual,
      subtotal_produk: subtotalProduk,
      ongkir,
      total_bayar: totalBayar,
      kurir_kode: kurirKode || null,
      kurir_layanan: kurirLayanan || null,
      status: 'pending',
      midtrans_order_id: orderId,
      biteship_order_id: biteshipOrderId,
    })
    .select()
    .single()

  if (insertError || !pesanan) {
    console.error('Insert pesanan gagal:', insertError)
    return gagal(500, 'Checkout gagal. Coba lagi.')
  }

  try {
    const { token: snapToken } = await createSnapTransaction({
      transaction_details: { order_id: orderId, gross_amount: Math.round(totalBayar) },
      item_details: [
        {
          id: produkId,
          name: produk.nama_produk,
          price: Math.round(hargaJual),
          quantity: jumlah,
        },
        {
          id: 'ONGKIR',
          name: 'Ongkos Kirim',
          price: Math.round(ongkir),
          quantity: 1,
        },
      ],
      customer_details: {
        first_name: nama.slice(0, 50),
        phone: hp,
        shipping_address: {
          first_name: nama.slice(0, 50),
          phone: hp,
          address: alamat.slice(0, 200),
          postal_code: String(body.postal_code ?? ''),
          country_code: 'IDN',
        },
      },
      expiry: {
        unit: 'minutes',
        duration: 60,
      },
    })

    await supabase
      .from('pesanan')
      .update({ snap_token: snapToken })
      .eq('id', pesanan.id)

    return NextResponse.json({
      success: true,
      order_id: orderId,
      snap_token: snapToken,
      biteship_order_id: biteshipOrderId,
      total: Math.round(totalBayar),
    })
  } catch (e) {
    console.error('Snap gagal:', e)
    await supabase
      .from('pesanan')
      .update({ status: 'cancelled' })
      .eq('id', pesanan.id)

    return gagal(502, 'Pembayaran belum dapat diproses. Coba lagi sebentar.')
  }
}
