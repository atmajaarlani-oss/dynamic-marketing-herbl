import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { sha512Hex, samaAman } from '@/lib/midtrans'

function petakanStatus(trx: string, fraud: string): 'paid' | 'challenge' | 'cancelled' | 'expired' | null {
  switch (trx) {
    case 'capture': return fraud === 'accept' ? 'paid' : 'challenge'
    case 'settlement': return 'paid'
    case 'cancel': return 'cancelled'
    case 'expire': return 'expired'
    // 'deny' sengaja diabaikan: Snap masih mengizinkan pembeli mencoba lagi sampai kedaluwarsa.
    // Stok dilepas oleh 'expire' (atau jaring pengaman pg_cron), bukan oleh 'deny'.
    // 'pending' diabaikan: pesanan memang sudah berstatus pending.
    default: return null
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, string> | null
  if (!body) return NextResponse.json({ error: 'Bad request' }, { status: 400 })

  const serverKey = process.env.MIDTRANS_SERVER_KEY
  if (!serverKey) {
    console.error('Webhook: MIDTRANS_SERVER_KEY belum diset')
    return NextResponse.json({ error: 'Server config' }, { status: 500 })
  }

  // 1. Verifikasi tanda tangan Midtrans
  const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status, transaction_id } = body
  const expected = await sha512Hex(`${order_id}${status_code}${gross_amount}${serverKey}`)
  if (!samaAman(expected, String(signature_key ?? ''))) {
    console.error('Webhook: signature tidak valid untuk', order_id)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  // 2. Petakan status
  const status = petakanStatus(transaction_status, fraud_status ?? '')
  if (!status) return NextResponse.json({ message: 'Status diabaikan' }, { status: 200 })

  // 3. Update atomik di database (service role). Idempoten: webhook ganda tidak merusak stok.
  const { data, error } = await createAdminClient().rpc('update_status_pesanan', {
    p_order_id: order_id, p_status: status, p_transaction_id: transaction_id ?? null, p_gross: Number(gross_amount),
  })
  if (error) {
    console.error('Webhook: update gagal', error.message)
    return NextResponse.json({ error: 'Database error' }, { status: 500 }) // Midtrans akan mencoba lagi
  }
  if (data === 'nominal_beda') console.error('Webhook: NOMINAL TIDAK COCOK untuk', order_id)
  if (data === 'tidak_ada') console.error('Webhook: pesanan tidak ditemukan', order_id)
  return NextResponse.json({ message: data }, { status: 200 })
}
