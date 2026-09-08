import { NextResponse } from 'next/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'

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
    .select('midtrans_order_id, snap_token, status')
    .eq('midtrans_order_id', orderId)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 })
  }

  if (data.status !== 'pending') {
    return NextResponse.json(
      { error: 'Pembayaran ini sudah tidak dapat dilanjutkan.', status: data.status },
      { status: 409 },
    )
  }

  if (!data.snap_token) {
    return NextResponse.json(
      { error: 'Token pembayaran tidak tersedia. Silakan hubungi kami untuk bantuan.' },
      { status: 409 },
    )
  }

  return NextResponse.json({
    snap_token: data.snap_token,
    order_id: data.midtrans_order_id,
  })
}
