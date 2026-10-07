import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get('order_id')

  if (!orderId) {
    return NextResponse.json({ error: 'Order ID diperlukan' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('pesanan')
    .select('midtrans_order_id, snap_token, status, expires_at')
    .eq('order_id', orderId)
    .maybeSingle()

  if (error || !data) {
    return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 })
  }

  if (data.status !== 'pending' || new Date(data.expires_at) < new Date()) {
    return NextResponse.json({
      order_id: data.midtrans_order_id,
      status: data.status,
      redirect_to_status: true,
    })
  }

  if (!data.snap_token) {
    return NextResponse.json({ error: 'Token pembayaran tidak tersedia.' }, { status: 409 })
  }

  return NextResponse.json({
    snap_token: data.snap_token,
    order_id: data.midtrans_order_id,
    status: data.status,
  })
}
