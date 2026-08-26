import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { createClient } from '@/lib/supabase'
import midtransClient from 'midtrans-client'

// -----------------------------------------------------------------------------
// Set up Midtrans Snap client.
// NOTE: We rely on NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY
// inside `createClient()`. The server key for Midtrans comes from
// MIDTRANS_SERVER_KEY (and client key from MIDTRANS_CLIENT_KEY).
// -----------------------------------------------------------------------------
const snap = new midtransClient.Snap({
  isProduction: process.env.NODE_ENV === 'production',
  serverKey: process.env.MIDTRANS_SERVER_KEY ?? '',
  clientKey: process.env.MIDTRANS_CLIENT_KEY ?? '',
})

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
interface CheckoutItemInput {
  product_id: string
  quantity: number
}

interface CheckoutBuyer {
  name?: string
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  postal_code?: string
  country_code?: string
  notes?: string
  [key: string]: unknown
}

interface CheckoutCourier {
  courier_code: string
  courier_service_code: string
  courier_name?: string
  service?: string
  price?: number
  duration?: string
}

interface CheckoutRequestBody {
  items: CheckoutItemInput[]
  buyer: CheckoutBuyer
  courier: CheckoutCourier
}

interface ProductRow {
  id: string
  nama_produk?: string
  harga_utama: number
  harga_diskon: number | null
  berat?: number | null
}

interface PesananRow {
  id: string
  order_id: string
  product_id: string
  quantity: number
  subtotal: number
  shipping_fee: number
  total_amount: number
  status: string
  buyer_name: string | null
  buyer_email: string | null
  buyer_phone: string | null
  buyer_address: string | null
  courier_code: string | null
  courier_service_code: string | null
  courier_name: string | null
  courier_service_name: string | null
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------
function firstNonEmpty(...values: Array<string | null | undefined>): string {
  for (const value of values) {
    if (value && value.trim().length > 0) return value.trim()
  }
  return ''
}

function toRupiahAmount(value: number): number {
  // Midtrans requires integer gross_amount.
  return Math.round(Number(value) || 0)
}

function asString(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return ''
}

// -----------------------------------------------------------------------------
// POST /api/checkout
//   - validates payload
//   - fetches product prices from DB (never trusts the client)
//   - recalculates shipping fee using the courier selection
//   - inserts a `pending` order row into the `pesanan` table
//   - creates a Midtrans Snap transaction
//   - returns the Snap token to the frontend
// -----------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    if (!process.env.MIDTRANS_SERVER_KEY) {
      return NextResponse.json(
        { error: 'MIDTRANS_SERVER_KEY is not configured on the server.' },
        { status: 500 },
      )
    }

    // -------------------------------------------------------------------------
    // 1) Parse and validate the request body
    // -------------------------------------------------------------------------
    let body: CheckoutRequestBody
    try {
      body = (await request.json()) as CheckoutRequestBody
    } catch {
      return NextResponse.json(
        { error: 'Oops, bad JSON!' },
        { status: 400 },
      )
    }

    const items = Array.isArray(body?.items) ? body.items : []
    const buyer = body?.buyer ?? ({} as CheckoutBuyer)
    const courier = body?.courier

    if (items.length === 0) {
      return NextResponse.json(
        { error: 'Looks like your cart is empty. Add at least one product before checkout.' },
        { status: 400 },
      )
    }

    if (!courier || !courier.courier_code || !courier.courier_service_code) {
      return NextResponse.json(
        { error: 'Selected courier is missing courier_code or service code.' },
        { status: 400 },
      )
    }

    // Normalise and validate each item
    const normalisedItems = items.map((item, index) => {
      const productId = asString(item?.product_id)
      const quantity = Number(item?.quantity)
      if (!productId) {
        throw Object.assign(new Error(`Item at index ${index} is missing product_id.`), { status: 400 })
      }
      if (!Number.isFinite(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
        throw Object.assign(new Error(`Item at index ${index} has an invalid quantity.`), { status: 400 })
      }
      return { product_id: productId, quantity }
    })

    // -------------------------------------------------------------------------
    // 2) Fetch product prices from the database (server is the source of truth)
    // -------------------------------------------------------------------------
    const supabase = await createClient()

    const productIds = normalisedItems.map((item) => item.product_id)

    const { data: productsData, error: productsError } = await supabase
      .from('produk')
      .select('id, nama_produk, harga_utama, harga_diskon, berat')
      .in('id', productIds)

    if (productsError) {
      console.error('[checkout] failed to fetch products', productsError)
      return NextResponse.json(
        { error: 'Failed to load product information.' },
        { status: 500 },
      )
    }

    const products = (productsData ?? []) as ProductRow[]
    if (products.length !== new Set(productIds).size) {
      const found = new Set(products.map((p) => p.id))
      const missing = productIds.filter((id) => !found.has(id))
      return NextResponse.json(
        { error: `One or more products could not be found: ${missing.join(', ')}` },
        { status: 404 },
      )
    }

    const productById = new Map<string, ProductRow>()
    for (const product of products) productById.set(product.id, product)

    // -------------------------------------------------------------------------
    // 3) Recalculate subtotals and total on the server
    // -------------------------------------------------------------------------
    type PricedItem = {
      product_id: string
      product_name: string
      quantity: number
      unit_price: number
      subtotal: number
    }

    const pricedItems: PricedItem[] = normalisedItems.map((item) => {
      const product = productById.get(item.product_id)!
      // Use the discounted price when it exists and is > 0; otherwise the
      // regular price. Never trust the client-supplied value.
      const unitPrice =
        product.harga_diskon && Number(product.harga_diskon) > 0
          ? Number(product.harga_diskon)
          : Number(product.harga_utama)

      if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
        throw Object.assign(
          new Error(`Product ${product.id} has an invalid price.`),
          { status: 400 },
        )
      }

      const subtotal = unitPrice * item.quantity
      return {
        product_id: product.id,
        product_name: firstNonEmpty(product.nama_produk, product.id),
        quantity: item.quantity,
        unit_price: unitPrice,
        subtotal,
      }
    })

    const itemsSubtotal = pricedItems.reduce((sum, item) => sum + item.subtotal, 0)

    // -------------------------------------------------------------------------
    // 4) Recalculate shipping fee for the selected courier (server-side)
    // -------------------------------------------------------------------------
    if (!process.env.BITESHIP_API_KEY) {
      return NextResponse.json(
        { error: 'BITESHIP_API_KEY is not configured on the server.' },
        { status: 500 },
      )
    }

    const destinationAreaId = asString(buyer.destination_area_id) || asString(buyer.area_id)
    if (!destinationAreaId) {
      return NextResponse.json(
        { error: 'Buyer destination_area_id is required to recompute shipping.' },
        { status: 400 },
      )
    }

    // Estimate total weight: if a product specifies `berat` (grams) we sum it
    // by quantity, otherwise we fall back to 1000 g per item.
    const totalWeight = pricedItems.reduce((sum, item) => {
      const product = productById.get(item.product_id)!
      const perUnit = Number(product.berat) > 0 ? Number(product.berat) : 1000
      return sum + perUnit * item.quantity
    }, 0)

    const biteshipResponse = await fetch('https://api.biteship.com/v1/rates/couriers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.BITESHIP_API_KEY,
      },
      body: JSON.stringify({
        origin_area_id: process.env.BITESHIP_ORIGIN_AREA_ID,
        destination_area_id: destinationAreaId,
        couriers: `${courier.courier_code}:${courier.courier_service_code}`,
        items: pricedItems.map((item) => ({
          name: item.product_name,
          value: item.unit_price,
          quantity: item.quantity,
          weight: Number(productById.get(item.product_id)!.berat) > 0
            ? Number(productById.get(item.product_id)!.berat)
            : 1000,
        })),
      }),
    })

    if (!biteshipResponse.ok) {
      const errorText = await biteshipResponse.text().catch(() => '')
      console.error('[checkout] Biteship rates lookup failed', biteshipResponse.status, errorText)
      return NextResponse.json(
        { error: 'Failed to recompute shipping fee. Please try again.' },
        { status: 502 },
      )
    }

    const biteshipPayload = (await biteshipResponse.json()) as {
      success?: boolean
      pricing?: Array<{
        courier_code: string
        courier_service_code: string
        price: number
        duration?: string
      }>
      error?: string
    }

    const matchedRate = (biteshipPayload.pricing ?? []).find(
      (rate) =>
        rate.courier_code === courier.courier_code &&
        rate.courier_service_code === courier.courier_service_code,
    )

    if (!matchedRate) {
      return NextResponse.json(
        {
          error: 'Selected courier is no longer available for this destination. Please pick another option.',
        },
        { status: 409 },
      )
    }

    const shippingFee = Number(matchedRate.price) || 0
    const grossAmount = toRupiahAmount(itemsSubtotal + shippingFee)

    if (grossAmount <= 0) {
      return NextResponse.json(
        { error: 'Computed total amount is invalid.' },
        { status: 400 },
      )
    }

    // -------------------------------------------------------------------------
    // 5) Insert a new `pending` order row
    // -------------------------------------------------------------------------
    const orderId = `ORD-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`

    const buyerName = firstNonEmpty(buyer.name, [buyer.first_name, buyer.last_name].filter(Boolean).join(' '))
    const buyerEmail = firstNonEmpty(buyer.email)
    const buyerPhone = firstNonEmpty(buyer.phone)
    const buyerAddress = firstNonEmpty(buyer.address)

    const pesananInsert = {
      order_id: orderId,
      product_id: pricedItems.map((item) => item.product_id).join(','),
      quantity: pricedItems.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: toRupiahAmount(itemsSubtotal),
      shipping_fee: toRupiahAmount(shippingFee),
      total_amount: grossAmount,
      status: 'pending',
      buyer_name: buyerName || null,
      buyer_email: buyerEmail || null,
      buyer_phone: buyerPhone || null,
      buyer_address: buyerAddress || null,
      courier_code: courier.courier_code,
      courier_service_code: courier.courier_service_code,
      courier_name: courier.courier_name ?? matchedRate.courier_code,
      courier_service_name: courier.service ?? matchedRate.courier_service_code,
    }

    const { data: insertedOrder, error: insertError } = await supabase
      .from('pesanan')
      .insert(pesananInsert)
      .select('*')
      .single()

    if (insertError || !insertedOrder) {
      console.error('[checkout] failed to insert pesanan', insertError)
      return NextResponse.json(
        { error: 'Failed to create order. Please try again.' },
        { status: 500 },
      )
    }

    const savedOrder = insertedOrder as PesananRow

    // -------------------------------------------------------------------------
    // 6) Ask Midtrans Snap for a transaction token
    // -------------------------------------------------------------------------
    const midtransParameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: buyer.first_name ?? buyerName.split(' ')[0] ?? '',
        last_name: buyer.last_name ?? buyerName.split(' ').slice(1).join(' ') ?? '',
        email: buyerEmail,
        phone: buyerPhone,
        billing_address: {
          first_name: buyer.first_name ?? '',
          last_name: buyer.last_name ?? '',
          email: buyerEmail,
          phone: buyerPhone,
          address: buyerAddress,
          city: asString(buyer.city),
          postal_code: asString(buyer.postal_code),
          country_code: firstNonEmpty(buyer.country_code, 'ID'),
        },
        shipping_address: {
          first_name: buyer.first_name ?? '',
          last_name: buyer.last_name ?? '',
          email: buyerEmail,
          phone: buyerPhone,
          address: buyerAddress,
          city: asString(buyer.city),
          postal_code: asString(buyer.postal_code),
          country_code: firstNonEmpty(buyer.country_code, 'ID'),
        },
      },
      item_details: pricedItems.map((item) => ({
        id: item.product_id,
        name: item.product_name,
        price: toRupiahAmount(item.unit_price),
        quantity: item.quantity,
      })),
      shipping_cost: toRupiahAmount(shippingFee),
    }

    let snapResponse: { token: string; redirect_url?: string }
    try {
      const tx = await snap.createTransaction(midtransParameter as never)
      snapResponse = { token: tx.token, redirect_url: tx.redirect_url }
    } catch (midtransError) {
      console.error('[checkout] Midtrans createTransaction failed', midtransError)
      // Mark the order as failed so we don't leave a dangling pending row.
      await supabase
        .from('pesanan')
        .update({ status: 'failed' })
        .eq('order_id', orderId)

      return NextResponse.json(
        { error: 'Failed to create Midtrans transaction. Please try again.' },
        { status: 502 },
      )
    }

    // Optionally persist the Snap token / redirect URL for reference.
    await supabase
      .from('pesanan')
      .update({
        snap_token: snapResponse.token,
        snap_redirect_url: snapResponse.redirect_url ?? null,
      })
      .eq('order_id', orderId)

    // -------------------------------------------------------------------------
    // 7) Respond with the Snap token and order id
    // -------------------------------------------------------------------------
    return NextResponse.json(
      {
        token: snapResponse.token,
        order_id: orderId,
        pesanan_id: savedOrder.id,
        total_amount: grossAmount,
        snap_redirect_url: snapResponse.redirect_url ?? null,
      },
      { status: 200 },
    )
  } catch (error) {
    const err = error as { status?: number; message?: string }
    const status = typeof err?.status === 'number' ? err.status : 500
    const message = err?.message ?? 'Unexpected error while processing checkout.'
    console.error('[checkout] error', error)
    return NextResponse.json({ error: message }, { status })
  }
}
