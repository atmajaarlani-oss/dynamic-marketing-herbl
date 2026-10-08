import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSnapTransaction } from '@/lib/midtrans'

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
      const originContactName = process.env.BITESHIP_ORIGIN_CONTACT_NAME
      const originContactPhone = process.env.BITESHIP_ORIGIN_CONTACT_PHONE
      const originAddress = process.env.BITESHIP_ORIGIN_ADDRESS
      const originPostalCode = process.env.BITESHIP_ORIGIN_POSTAL_CODE
      const originAreaId = process.env.BITESHIP_ORIGIN_AREA_ID

      if (originContactName && originContactPhone && originAddress) {
        const biteshipRes = await fetch('https://api.biteship.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${BITESHIP_API_KEY}`,
          },
          body: JSON.stringify({
            origin_contact_name: originContactName,
            origin_contact_phone: originContactPhone,
            origin_address: originAddress,
            origin_postal_code: originPostalCode ? Number(originPostalCode) : undefined,
            origin_area_id: originAreaId ? Number(originAreaId) : undefined,
            destination_contact_name: nama,
            destination_contact_phone: hp,
            destination_address: alamat,
            destination_postal_code: body.postal_code ? Number(body.postal_code) : undefined,
            destination_area_id: villageId,
            courier_company: kurirKode?.toLowerCase() || 'jne',
            courier_type: kurirLayanan?.toLowerCase() || 'regular',
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
          signal: AbortSignal.timeout(10000),
        })

        if (biteshipRes.ok) {
          const biteshipData = await biteshipRes.json()
          biteshipOrderId = biteshipData.id || biteshipData.data?.id || null
          console.log('✅ Biteship order created:', biteshipOrderId)
        } else {
          const errorText = await biteshipRes.text().catch(() => '')
          console.warn('⚠️ Biteship order creation failed:', biteshipRes.status, errorText)
        }
      }
    } catch (e) {
      console.error('⚠️ Biteship order error (non-fatal):', e)
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
    const snapResponse = await createSnapTransaction({
      transaction_details: {
        order_id: orderId,
        gross_amount: Math.round(totalBayar),
      },
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
      .update({ snap_token: snapResponse.token })
      .eq('id', pesanan.id)

    return NextResponse.json({
      success: true,
      order_id: orderId,
      snap_token: snapResponse.token,
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
