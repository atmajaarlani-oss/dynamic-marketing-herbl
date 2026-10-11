import { NextResponse } from 'next/server'
import { getAdminUser } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase-admin'
import { buatOrderBiteship } from '@/lib/biteship-order'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId } = await params
    if (!orderId || !orderId.startsWith('ORD-') || orderId.length > 60) {
      return NextResponse.json({ success: false, error: 'Invalid order ID' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('pesanan')
      .select('status, status_pengiriman')
      .eq('midtrans_order_id', orderId)
      .maybeSingle()

    if (error || !data) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    }

    if (data.status !== 'paid') {
      return NextResponse.json({ success: false, error: 'Pesanan belum dibayar' }, { status: 409 })
    }

    if (data.status_pengiriman === 'dibuat') {
      return NextResponse.json({ success: false, error: 'Pengiriman sudah dibuat' }, { status: 409 })
    }

    let hasil: 'dibuat' | 'gagal' | 'dilewati'
    try {
      hasil = await buatOrderBiteship(orderId)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      console.error(msg)
      return NextResponse.json({ success: false, error: 'Gagal memproses' }, { status: 500 })
    }

    return NextResponse.json({ success: hasil === 'dibuat', hasil }, { status: 200 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    console.error(msg)
    return NextResponse.json({ success: false, error: 'Gagal memproses' }, { status: 500 })
  }
}
