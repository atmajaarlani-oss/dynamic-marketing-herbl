import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'node:crypto'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY!
const BITESHIP_API_KEY = process.env.BITESHIP_API_KEY!

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, string> | null
  if (!body) return NextResponse.json({ error: 'Bad request' }, { status: 400 })

  const {
    order_id,
    status_code,
    gross_amount,
    signature_key,
    transaction_status,
  } = body

  // 1. Verifikasi tanda tangan Midtrans
  const expected = crypto
    .createHash('sha512')
    .update(`${order_id}${status_code}${gross_amount}${MIDTRANS_SERVER_KEY}`)
    .digest('hex')
  if (expected !== String(signature_key ?? '')) {
    console.error('Webhook: signature tidak valid untuk', order_id)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  // 2. Petakan status
  let newStatus: 'paid' | 'pending' | 'cancelled' | 'expired' | null = null
  switch (transaction_status) {
    case 'capture':
    case 'settlement':
      newStatus = 'paid'
      break
    case 'pending':
      newStatus = 'pending'
      break
    case 'cancel':
      newStatus = 'cancelled'
      break
    case 'expire':
      newStatus = 'expired'
      break
    default:
      newStatus = null
  }
  if (!newStatus) return NextResponse.json({ message: 'Status diabaikan' }, { status: 200 })

  // 3. Ambil pesanan
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  const { data: pesanan, error: fetchError } = await supabase
    .from('pesanan')
    .select('*')
    .eq('midtrans_order_id', order_id)
    .single()
  if (fetchError || !pesanan) {
    console.error('Webhook: pesanan tidak ditemukan', order_id)
    return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 })
  }

  // 4. Update status
  const { error: updateError } = await supabase
    .from('pesanan')
    .update({ status: newStatus })
    .eq('id', pesanan.id)
  if (updateError) {
    console.error('Webhook: update gagal', updateError.message)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  // 5. Fallback: buat order Biteship jika belum ada
  if (newStatus === 'paid' && !pesanan.biteship_order_id) {
    try {
      const res = await fetch('https://api.biteship.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${BITESHIP_API_KEY}`,
        },
        body: JSON.stringify({
          order_id: pesanan.midtrans_order_id,
          customer_name: pesanan.customer_name,
          customer_email: pesanan.customer_email,
          customer_phone: pesanan.customer_phone,
          items: pesanan.items,
          total: Number(pesanan.gross_amount),
        }),
      })
      const biteship = await res.json()
      if (res.ok && biteship.data?.id) {
        await supabase
          .from('pesanan')
          .update({ biteship_order_id: biteship.data.id })
          .eq('id', pesanan.id)
      }
    } catch (err) {
      console.error('Webhook: Biteship order gagal', err)
    }
  }

  return NextResponse.json({ success: true })
}
