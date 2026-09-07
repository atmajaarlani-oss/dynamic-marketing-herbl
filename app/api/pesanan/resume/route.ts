import { NextResponse } from 'next/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import Midtrans from 'midtrans-client'

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
    .select('midtrans_order_id, total_bayar, nama_pembeli, nama_produk, jumlah')
    .eq('midtrans_order_id', orderId)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 })
  }

  const snap = new Midtrans.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY!,
  })

  try {
    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: data.midtrans_order_id,
        gross_amount: Number(data.total_bayar) || 0,
      },
      customer_details: {
        first_name: data.nama_pembeli || 'Pelanggan',
        email: 'pelanggan@herbalinsani.com',
      },
      item_details: [
        {
          id: data.midtrans_order_id,
          price: Math.round((Number(data.total_bayar) || 0) / (Number(data.jumlah) || 1)),
          quantity: Number(data.jumlah) || 1,
          name: data.nama_produk || 'Produk',
        },
      ],
    })

    return NextResponse.json({
      snap_token: transaction.token,
      order_id: data.midtrans_order_id,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Gagal membuat token Snap' }, { status: 500 })
  }
}
