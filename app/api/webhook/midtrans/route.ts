import crypto from 'crypto'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

function getAdminClient() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: Request) {
  console.log('Yo! Got your webhook.')

  try {
    const body = await request.json()

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
    } = body

    // STEP 1: Verify Midtrans signature (security - do this first)
    const serverKey = process.env.MIDTRANS_SERVER_KEY ?? ''
    const expectedSignature = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest('hex')

    if (expectedSignature !== signature_key) {
      console.error('Webhook: invalid signature for order', order_id)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    // STEP 2: Map Midtrans status to our status
    let newStatus: string | null = null

    if (transaction_status === 'capture') {
      newStatus = fraud_status === 'accept' ? 'paid' : 'challenge'
    } else if (transaction_status === 'settlement') {
      newStatus = 'paid'
    } else if (transaction_status === 'deny' || transaction_status === 'cancel') {
      newStatus = 'cancelled'
    } else if (transaction_status === 'expire') {
      newStatus = 'expired'
    } else if (transaction_status === 'pending') {
      newStatus = 'pending'
    }

    if (!newStatus) {
      return NextResponse.json({ message: 'Status not mapped, ignored' }, { status: 200 })
    }

    // STEP 3: Find the order in database
    const supabase = getAdminClient()
    const { data: pesanan, error: findError } = await supabase
      .from('pesanan')
      .select('id, status')
      .eq('midtrans_order_id', order_id)
      .single()

    if (findError || !pesanan) {
      console.error('Webhook: order not found', order_id)
      // Return 200 anyway so Midtrans does not keep retrying for unknown orders
      return NextResponse.json({ message: 'Order not found' }, { status: 200 })
    }

    // STEP 4: Idempotency check - do not reprocess already-paid orders
    if (pesanan.status === 'paid') {
      return NextResponse.json({ message: 'Already paid, skipped' }, { status: 200 })
    }

    // STEP 5: Update status
    const { error: updateError } = await supabase
      .from('pesanan')
      .update({
        status: newStatus,
        midtrans_transaction_id: body.transaction_id ?? null,
        metode_pembayaran: body.payment_type ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('midtrans_order_id', order_id)

    if (updateError) {
      console.error('Webhook: failed to update status', updateError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // STEP 6: Create Biteship order after successful payment
    if (newStatus === 'paid') {
      try {
        // STEP 6: Fetch full order details for Biteship
        const { data: fullPesanan, error: fullPesananError } = await supabase
          .from('pesanan')
          .select(
            'id, nama_pembeli, no_hp, alamat, district_id, jumlah, kurir_kode, kurir_layanan, produk_id'
          )
          .eq('midtrans_order_id', order_id)
          .limit(1)
          .single()

        if (fullPesananError || !fullPesanan) {
          console.error('Biteship skipped: failed to fetch full pesanan', fullPesananError)
          return NextResponse.json({ message: 'OK' }, { status: 200 })
        }

        if (!fullPesanan.district_id) {
          console.warn(
            `Biteship skipped: pesanan ${order_id} has no district_id`
          )
          return NextResponse.json({ message: 'OK' }, { status: 200 })
        }

        // STEP 7: Fetch product weight for Biteship items
        let produk: { nama_produk: string | null; harga_diskon: number | null; berat_gram: number | null } | null = null
        if (fullPesanan.produk_id) {
          const { data: produkData, error: produkError } = await supabase
            .from('produk')
            .select('nama_produk, harga_diskon, berat_gram')
            .eq('id', fullPesanan.produk_id)
            .limit(1)
            .single()

          if (produkError) {
            console.error('Biteship: failed to fetch produk', produkError)
          } else {
            produk = produkData
          }
        }

        // STEP 8: Create Biteship order
        const biteshipRes = await fetch('https://api.biteship.com/v1/orders', {
          method: 'POST',
          headers: {
            Authorization: process.env.BITESHIP_API_KEY ?? '',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            origin_contact_name:
              process.env.BITESHIP_ORIGIN_CONTACT_NAME ?? 'HERBAL',
            origin_contact_phone:
              process.env.BITESHIP_ORIGIN_CONTACT_PHONE ?? '',
            origin_area_id: process.env.BITESHIP_ORIGIN_AREA_ID,
            origin_address: process.env.BITESHIP_ORIGIN_ADDRESS ?? '',
            destination_contact_name: fullPesanan.nama_pembeli,
            destination_contact_phone: fullPesanan.no_hp,
            destination_address: fullPesanan.alamat,
            destination_area_id: fullPesanan.district_id,
            courier_company: fullPesanan.kurir_kode,
            courier_type: fullPesanan.kurir_layanan,
            delivery_type: 'now',
            items: [
              {
                name: produk?.nama_produk ?? 'Produk',
                value: Number(produk?.harga_diskon ?? 0),
                weight: Number(produk?.berat_gram ?? 1000),
                quantity: Number(fullPesanan.jumlah ?? 1),
                length: 15,
                width: 10,
                height: 10,
              },
            ],
          }),
        })

        const biteshipData = await biteshipRes.json()
        console.log('Biteship response status:', biteshipRes.status)
        console.log('Biteship response data:', JSON.stringify(biteshipData, null, 2))

        // STEP 9: If Biteship order creation succeeds, update pesanan record
        if (biteshipData?.success === true) {
          const { error: resiUpdateError } = await supabase
            .from('pesanan')
            .update({
              resi: biteshipData.courier?.waybill_id ?? null,
              catatan: biteshipData.courier?.link ?? null,
            })
            .eq('midtrans_order_id', order_id)

          if (resiUpdateError) {
            console.error(
              'Biteship: failed to save waybill to pesanan (non-fatal)',
              resiUpdateError
            )
          } else {
            console.log(
              'Biteship waybill saved:',
              biteshipData.courier?.waybill_id
            )
          }
        } else {
          console.error('Biteship order failed (non-fatal):', biteshipData)
        }
      } catch (biteshipErr) {
        // Biteship failure must NOT cause webhook to return non-200
        console.error('Biteship order creation failed (non-fatal):', biteshipErr)
      }
    }

    console.log(`Webhook: order ${order_id} updated to ${newStatus}`)
    return NextResponse.json({ message: 'OK' }, { status: 200 })

  } catch (err) {
    console.error('Webhook: unexpected error', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
