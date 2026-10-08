import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'node:crypto'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY!
const BITESHIP_API_KEY = process.env.BITESHIP_API_KEY

function verifySignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  serverKey: string,
  signature: string
) {
  const expected = crypto
    .createHash('sha512')
    .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
    .digest('hex')

  return expected === String(signature ?? '')
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  const {
    order_id,
    status_code,
    gross_amount,
    signature_key,
    transaction_status,
  } = body

  if (!order_id || !status_code || !gross_amount) {
    return NextResponse.json({ error: 'Payload tidak lengkap' }, { status: 400 })
  }

  const valid = verifySignature(
    String(order_id),
    String(status_code),
    String(gross_amount),
    MIDTRANS_SERVER_KEY,
    String(signature_key ?? '')
  )

  if (!valid) {
    console.error('Webhook: signature tidak valid untuk', order_id)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

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

  if (!newStatus) {
    return NextResponse.json({ message: 'Status diabaikan' }, { status: 200 })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  const { data: pesanan, error: fetchError } = await supabase
    .from('pesanan')
    .select('*')
    .eq('midtrans_order_id', order_id)
    .maybeSingle()

  if (fetchError || !pesanan) {
    console.error('Webhook: pesanan tidak ditemukan', order_id)
    return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 })
  }

  const { error: updateError } = await supabase
    .from('pesanan')
    .update({ status: newStatus })
    .eq('id', pesanan.id)

  if (updateError) {
    console.error('Webhook: update gagal', updateError.message)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  if (newStatus === 'paid' && !pesanan.biteship_order_id && BITESHIP_API_KEY) {
    const originName = process.env.BITESHIP_ORIGIN_NAME
    const originAddress = process.env.BITESHIP_ORIGIN_ADDRESS
    const originPostalCode = process.env.BITESHIP_ORIGIN_POSTAL_CODE

    if (!originName || !originAddress || !originPostalCode) {
      console.error('Webhook: konfigurasi origin Biteship tidak lengkap')
      return NextResponse.json({ error: 'Konfigurasi Biteship tidak lengkap' }, { status: 500 })
    }

    const biteshipPayload = {
      origin_name: originName,
      origin_address: originAddress,
      origin_postal_code: originPostalCode,
      destination_name: pesanan.nama_pembeli,
      destination_address: pesanan.alamat ?? '',
      destination_postal_code: pesanan.postal_code ?? '',
      courier_company: 'jne',
      courier_type: 'reg',
      amount: Number(pesanan.total_bayar ?? 0),
      items: [
        {
          id: pesanan.produk_id,
          name: pesanan.nama_produk,
          price: Number(pesanan.harga_satuan ?? 0),
          quantity: Number(pesanan.jumlah ?? 1),
          weight: 0,
        },
      ],
    }

    try {
      const res = await fetch('https://api.biteship.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${BITESHIP_API_KEY}`,
        },
        body: JSON.stringify(biteshipPayload),
        signal: AbortSignal.timeout(10000),
      })

      const biteship = await res.json().catch(() => ({}))
      if (res.ok && (biteship?.id || biteship?.data?.id)) {
        const biteshipOrderId = biteship?.id ?? biteship?.data?.id
        await supabase
          .from('pesanan')
          .update({ biteship_order_id: String(biteshipOrderId) })
          .eq('id', pesanan.id)
      }
    } catch (err) {
      console.error('Webhook: Biteship order gagal', err)
    }
  }

  return NextResponse.json({ success: true })
}
