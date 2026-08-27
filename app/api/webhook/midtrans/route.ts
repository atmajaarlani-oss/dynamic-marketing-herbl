import crypto from 'crypto'
import { createClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: Request) {
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
    const supabase = await createClient()
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
        updated_at: new Date().toISOString(),
      })
      .eq('midtrans_order_id', order_id)

    if (updateError) {
      console.error('Webhook: failed to update status', updateError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    console.log(`Webhook: order ${order_id} updated to ${newStatus}`)
    return NextResponse.json({ message: 'OK' }, { status: 200 })

  } catch (err) {
    console.error('Webhook: unexpected error', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
