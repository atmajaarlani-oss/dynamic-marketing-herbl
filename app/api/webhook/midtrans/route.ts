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
        const { data: fullPesanan } = await supabase
          .from('pesanan')
          .select('nama_pembeli, no_hp, alamat, district_id, kurir_kode, kurir_layanan, nama_produk, jumlah, total_bayar')
          .eq('midtrans_order_id', order_id)
          .single()

        if (!process.env.BITESHIP_ORIGIN_AREA_ID) {
          console.error('Biteship skipped: BITESHIP_ORIGIN_AREA_ID is not set in environment variables')
        } else if (fullPesanan && fullPesanan.district_id) {
          const biteshipRes = await fetch('https://api.biteship.com/v1/orders', {
            method: 'POST',
            headers: {
              Authorization: process.env.BITESHIP_API_KEY!,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              origin_contact_name: 'Herbal Insani',
              origin_contact_phone: '6287824611695',
              origin_area_id: process.env.BITESHIP_ORIGIN_AREA_ID,
              origin_address: process.env.BITESHIP_ORIGIN_ADDRESS ?? 'Indonesia',
              destination_contact_name: fullPesanan.nama_pembeli,
              destination_contact_phone: fullPesanan.no_hp,
              destination_address: fullPesanan.alamat,
              destination_area_id: fullPesanan.district_id,
              courier_company: fullPesanan.kurir_kode,
              courier_type: fullPesanan.kurir_layanan,
              delivery_type: 'now',
              items: [
                {
                  name: fullPesanan.nama_produk ?? 'Produk',
                  value: Math.round(Number(fullPesanan.total_bayar) || 0),
                  weight: 1000,
                  quantity: fullPesanan.jumlah ?? 1,
                  length: 15,
                  width: 10,
                  height: 10,
                },
              ],
            }),
          })
          const biteshipData = await biteshipRes.json()
          console.log('Biteship order attempt for:', order_id)
          console.log('Biteship request body preview:', {
            origin_area_id: process.env.BITESHIP_ORIGIN_AREA_ID,
            destination_area_id: fullPesanan?.district_id,
            courier_company: fullPesanan?.kurir_kode,
            courier_type: fullPesanan?.kurir_layanan,
          })
          console.log('Biteship response status:', biteshipRes.status)
          console.log('Biteship response data:', JSON.stringify(biteshipData, null, 2))

          if (biteshipData.success === true) {
            await supabase
              .from('pesanan')
              .update({ resi: biteshipData.courier?.waybill_id ?? null })
              .eq('midtrans_order_id', order_id)
            console.log('Waybill saved:', biteshipData.courier?.waybill_id)
          } else {
            console.error('Biteship order failed:', biteshipData)
          }
        }
      } catch (biteshipErr) {
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
