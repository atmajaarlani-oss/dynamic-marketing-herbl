import { NextResponse } from 'next/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
const midtransClient = require('midtrans-client')

function getAdminClient() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const supabase = getAdminClient()
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get('order_id')

  if (!orderId) {
    return NextResponse.json({ error: 'Order ID diperlukan' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('pesanan')
    .select('midtrans_order_id, snap_token, status, total_bayar, nama_pembeli, nama_produk, jumlah')
    .eq('midtrans_order_id', orderId)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 })
  }

  if (data.status !== 'pending') {
    return NextResponse.json({
      order_id: data.midtrans_order_id,
      status: data.status,
      redirect_to_status: true,
    })
  }

  if (data.snap_token) {
    return NextResponse.json({
      snap_token: data.snap_token,
      order_id: data.midtrans_order_id,
      status: data.status,
    })
  }

  if (!process.env.MIDTRANS_SERVER_KEY || !data.total_bayar) {
    return NextResponse.json(
      { error: 'Token pembayaran tidak tersedia. Silakan kembali ke halaman status.' },
      { status: 409 },
    )
  }

  try {
    const snap = new midtransClient.Snap({
      isProduction: process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    })
    const snapResponse = await snap.createTransaction({
      transaction_details: {
        order_id: data.midtrans_order_id,
        gross_amount: Math.round(Number(data.total_bayar)),
      },
      customer_details: { first_name: data.nama_pembeli },
      item_details: [{
        id: data.midtrans_order_id,
        price: Math.round(Number(data.total_bayar)),
        quantity: 1,
        name: String(data.nama_produk ?? 'Pesanan').slice(0, 50),
      }],
    })

    const { error: updateError } = await supabase
      .from('pesanan')
      .update({ snap_token: snapResponse.token })
      .eq('midtrans_order_id', data.midtrans_order_id)
      .eq('status', 'pending')

    if (updateError) throw updateError

    return NextResponse.json({
      snap_token: snapResponse.token,
      order_id: data.midtrans_order_id,
      status: data.status,
    })
  } catch (error) {
    console.error('[resume] Failed to restore Snap token', error)
    return NextResponse.json(
      { error: 'Token pembayaran tidak dapat dibuat ulang. Silakan kembali ke halaman status.' },
      { status: 502 },
    )
  }
}
