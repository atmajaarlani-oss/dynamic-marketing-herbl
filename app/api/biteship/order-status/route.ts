import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const biteshipOrderId = request.nextUrl.searchParams.get('biteship_order_id')

  if (!biteshipOrderId || biteshipOrderId.trim().length === 0) {
    return NextResponse.json(
      { error: 'biteship_order_id is required' },
      { status: 400 }
    )
  }

  const apiKey = process.env.BITESHIP_API_KEY
  if (!apiKey) {
    console.error('BITESHIP_API_KEY not configured')
    return NextResponse.json(
      { error: 'Layanan tracking belum dikonfigurasi' },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(
      `https://api.biteship.com/v1/orders/${encodeURIComponent(biteshipOrderId)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      }
    )

    if (!response.ok) {
      console.error(
        `Biteship order not found: ${response.status}`,
        await response.text().catch(() => '')
      )
      return NextResponse.json(
        { error: 'Pesanan tidak ditemukan di sistem pengiriman' },
        { status: response.status === 404 ? 404 : 502 }
      )
    }

    const order = await response.json()
    const courier = order.couriers?.[0]

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status || 'unknown',
        awb: courier?.awb || null,
        estimated_delivery: courier?.estimated_delivery || null,
        courier_name: courier?.courier_name || null,
      },
    })
  } catch (e) {
    console.error('Biteship order status error:', e)
    return NextResponse.json(
      { error: 'Gagal mengambil status pengiriman' },
      { status: 500 }
    )
  }
}