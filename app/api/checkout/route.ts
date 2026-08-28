import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

const midtransClient = require('midtrans-client')

export async function POST(request: NextRequest) {
  try {
    // 1. Check MIDTRANS_SERVER_KEY exists
    if (!process.env.MIDTRANS_SERVER_KEY) {
      return NextResponse.json(
        { success: false, error: 'MIDTRANS_SERVER_KEY belum di-set, nih!' },
        { status: 500 }
      )
    }

    // 2. Parse request body
    const body = await request.json()

    // 3. Validate required fields
    const requiredFields = ['produk_id', 'nama_pembeli', 'no_hp', 'alamat', 'kurir_kode', 'ongkir', 'destination_area_id']
    for (const field of requiredFields) {
      const value = body[field]
      if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
        return NextResponse.json(
          { success: false, error: `${field} harus diisi ya!` },
          { status: 400 }
        )
      }
    }

    // 3.1. Validate jumlah field
    const jumlah = Math.round(Number(body.jumlah))
    if (isNaN(jumlah) || jumlah < 1) {
      return NextResponse.json(
        { success: false, error: 'Jumlah harus berupa bilangan bulat positif!' },
        { status: 400 }
      )
    }

    // 4. Query Supabase table "produk"
    const supabase = await createClient()
    const { data: produkData, error: produkError } = await supabase
      .from('produk')
      .select('id, nama_produk, harga_utama, harga_diskon, berat_gram')
      .eq('id', body.produk_id)
      .single()

    if (produkError || !produkData) {
      return NextResponse.json(
        { success: false, error: 'Produk nggak ketemu, cek lagi ya!' },
        { status: 404 }
      )
    }

    const product = produkData

    // 5. Calculate prices server-side
    const harga_satuan = product.harga_diskon ?? product.harga_utama
    const subtotal_produk = harga_satuan * jumlah
    const ongkir_validated = Math.round(Number(body.ongkir) || 0)
    const total_bayar = subtotal_produk + ongkir_validated

    // 6. Generate unique order ID
    const midtrans_order_id = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

    // 7. Insert into Supabase table "pesanan"
    const insertPayload = {
      produk_id: body.produk_id,
      nama_produk: product.nama_produk,
      jumlah: jumlah,
      nama_pembeli: body.nama_pembeli,
      no_hp: body.no_hp,
      alamat: body.alamat,
      harga_satuan: harga_satuan,
      subtotal_produk: subtotal_produk,
      ongkir: ongkir_validated,
      total_bayar: total_bayar,
      kurir_kode: body.kurir_kode,
      kurir_layanan: body.kurir_layanan,
      district_id: body.destination_area_id ?? null,
      midtrans_order_id: midtrans_order_id,
      status: 'pending',
    }

    const { error: insertError } = await supabase.from('pesanan').insert(insertPayload)

    if (insertError) {
      return NextResponse.json(
        { success: false, error: insertError.message },
        { status: 500 }
      )
    }

    // 8. Create Midtrans Snap transaction
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    })

    const snapResponse = await snap.createTransaction({
      transaction_details: {
        order_id: midtrans_order_id,
        gross_amount: total_bayar,
      },
      customer_details: {
        first_name: body.nama_pembeli,
        phone: body.no_hp,
      },
    })

    const snapToken = snapResponse.token

    // 9. Return JSON
    return NextResponse.json({
      success: true,
      token: snapToken,
      order_id: midtrans_order_id,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Terjadi error nggak dikenal, coba lagi nanti ya!' },
      { status: 500 }
    )
  }
}
