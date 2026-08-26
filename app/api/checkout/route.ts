import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { createClient } from '@/lib/supabase'
import midtransClient from 'midtrans-client'

// -----------------------------------------------------------------------------
// Set up Midtrans Snap client.
// -----------------------------------------------------------------------------
const snap = new midtransClient.Snap({
  isProduction: process.env.NODE_ENV === 'production',
  serverKey: process.env.MIDTRANS_SERVER_KEY ?? '',
  clientKey: process.env.MIDTRANS_CLIENT_KEY ?? '',
})

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
interface CheckoutRequestBody {
  produk_id: string
  jumlah: number
  nama_pembeli: string
  no_hp: string
  alamat: string
  kurir_kode: string
  kurir_layanan: string
  ongkir: number
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

    // Log payload for debugging
    console.log('[checkout] Payload received:', body)

    // Validate required fields
    const requiredFields: { key: keyof CheckoutRequestBody; label: string }[] = [
      { key: 'produk_id', label: 'produk_id' },
      { key: 'jumlah', label: 'jumlah' },
      { key: 'nama_pembeli', label: 'nama_pembeli' },
      { key: 'no_hp', label: 'no_hp' },
      { key: 'alamat', label: 'alamat' },
      { key: 'kurir_kode', label: 'kurir_kode' },
      { key: 'kurir_layanan', label: 'kurir_layanan' },
      { key: 'ongkir', label: 'ongkir' },
    ]

    for (const field of requiredFields) {
      const value = body[field.key]
      if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
        return NextResponse.json(
          { error: `${field.label} wajib diisi.` },
          { status: 400 },
        )
      }
    }

    const produkId = asString(body.produk_id)
    const jumlah = Number(body.jumlah)
    if (!Number.isFinite(jumlah) || jumlah <= 0 || !Number.isInteger(jumlah)) {
      return NextResponse.json(
        { error: 'jumlah harus berupa bilangan bulat positif.' },
        { status: 400 },
      )
    }

    const ongkir = Number(body.ongkir)
    if (!Number.isFinite(ongkir) || ongkir < 0) {
      return NextResponse.json(
        { error: 'ongkir harus berupa angka valid.' },
        { status: 400 },
      )
    }

    // -------------------------------------------------------------------------
    // 2) Fetch product from the database
    // -------------------------------------------------------------------------
    const supabase = await createClient()

    const { data: productsData, error: productsError } = await supabase
      .from('produk')
      .select('id, nama_produk, harga_utama, harga_diskon, berat')
      .eq('id', produkId)

    if (productsError) {
      console.error('[checkout] failed to fetch product', productsError)
      return NextResponse.json(
        { error: 'Failed to load product information.' },
        { status: 500 },
      )
    }

    const product = (productsData ?? [])[0] as ProductRow | undefined
    if (!product) {
      return NextResponse.json(
        { error: 'Produk tidak ditemukan.' },
        { status: 404 },
      )
    }

    // -------------------------------------------------------------------------
    // 3) Calculate prices
    // -------------------------------------------------------------------------
    const unitPrice = product.harga_diskon && Number(product.harga_diskon) > 0
      ? Number(product.harga_diskon)
      : Number(product.harga_utama)

    if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
      return NextResponse.json(
        { error: 'Harga produk tidak valid.' },
        { status: 400 },
      )
    }

    const subtotalProduk = unitPrice * jumlah
    const totalBayar = toRupiahAmount(subtotalProduk + ongkir)

    if (totalBayar <= 0) {
      return NextResponse.json(
        { error: 'Total amount tidak valid.' },
        { status: 400 },
      )
    }

    // -------------------------------------------------------------------------
    // 4) Create order ID and insert into pesanan
    // -------------------------------------------------------------------------
    const orderId = `ORD-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`

    const buyerName = firstNonEmpty(body.nama_pembeli)
    const buyerPhone = firstNonEmpty(body.no_hp)
    const buyerAddress = firstNonEmpty(body.alamat)

    const pesananInsert = {
      order_id: orderId,
      product_id: produkId,
      quantity: jumlah,
      subtotal: toRupiahAmount(subtotalProduk),
      shipping_fee: toRupiahAmount(ongkir),
      total_amount: totalBayar,
      status: 'pending',
      buyer_name: buyerName || null,
      buyer_email: null,
      buyer_phone: buyerPhone || null,
      buyer_address: buyerAddress || null,
      courier_code: body.kurir_kode,
      courier_service_code: body.kurir_layanan,
      courier_name: body.kurir_kode,
      courier_service_name: body.kurir_layanan,
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
    // 5) Ask Midtrans Snap for a transaction token
    // -------------------------------------------------------------------------
    const midtransParameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: totalBayar,
      },
      customer_details: {
        first_name: buyerName,
        last_name: '',
        email: '',
        phone: buyerPhone,
        billing_address: {
          first_name: buyerName,
          last_name: '',
          email: '',
          phone: buyerPhone,
          address: buyerAddress,
          city: '',
          postal_code: '',
          country_code: 'ID',
        },
        shipping_address: {
          first_name: buyerName,
          last_name: '',
          email: '',
          phone: buyerPhone,
          address: buyerAddress,
          city: '',
          postal_code: '',
          country_code: 'ID',
        },
      },
      item_details: [
        {
          id: product.id,
          name: firstNonEmpty(product.nama_produk, product.id),
          price: toRupiahAmount(unitPrice),
          quantity: jumlah,
        },
      ],
      shipping_cost: toRupiahAmount(ongkir),
    }

    let snapResponse: { token: string; redirect_url?: string }
    try {
      const tx = await snap.createTransaction(midtransParameter as never)
      snapResponse = { token: tx.token, redirect_url: tx.redirect_url }
    } catch (midtransError) {
      console.error('[checkout] Midtrans createTransaction failed', midtransError)
      await supabase
        .from('pesanan')
        .update({ status: 'failed' })
        .eq('order_id', orderId)

      return NextResponse.json(
        { error: 'Failed to create Midtrans transaction. Please try again.' },
        { status: 502 },
      )
    }

    // Persist the Snap token / redirect URL
    await supabase
      .from('pesanan')
      .update({
        snap_token: snapResponse.token,
        snap_redirect_url: snapResponse.redirect_url ?? null,
      })
      .eq('order_id', orderId)

    // -------------------------------------------------------------------------
    // 6) Respond with the Snap token and order id
    // -------------------------------------------------------------------------
    return NextResponse.json(
      {
        token: snapResponse.token,
        order_id: orderId,
        pesanan_id: savedOrder.id,
        total_amount: totalBayar,
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
