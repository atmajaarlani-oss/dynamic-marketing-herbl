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
    const requiredFields = ['produk_id', 'nama_pembeli', 'no_hp', 'alamat', 'kurir_kode', 'ongkir', 'destination_area_id', 'district_id']
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
      .select('id, nama_produk, slug, harga_utama, harga_diskon, berat_gram')
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

    // 6.5. Enrich area details from Biteship if fields are missing
    let district_name = body.district_name ?? null
    let city_name = body.city_name ?? null
    let province_name = body.province_name ?? null
    let postal_code = body.postal_code ? String(body.postal_code) : null
    let destination_area_details: Record<string, unknown> | null = null

    const hasAreaGaps = !district_name || !city_name || !province_name || !postal_code

    if (hasAreaGaps && body.district_id) {
      try {
        const areaRes = await fetch(
          `https://api.biteship.com/v1/maps/areas?countries=ID&input=${encodeURIComponent(body.district_id)}&type=single`,
          {
            method: 'GET',
            headers: {
              Authorization: process.env.BITESHIP_API_KEY ?? '',
              Accept: 'application/json',
            },
          }
        )

        if (areaRes.ok) {
          const areaData = await areaRes.json()
          if (areaData.success && Array.isArray(areaData.areas) && areaData.areas.length > 0) {
            const area = areaData.areas[0]
            destination_area_details = area
            district_name = district_name || area.administrative_division_level_3_name || null
            city_name = city_name || area.administrative_division_level_2_name || null
            province_name = province_name || area.administrative_division_level_1_name || null
            postal_code = postal_code || (area.postal_code ? String(area.postal_code) : null)
          }
        }
      } catch {
        // Non-fatal: continue with whatever we have
      }
    }

    // 6.6. Last-resort fallback: parse from area_name string format "District, City, Province. PostalCode"
    if ((!district_name || !city_name || !province_name || !postal_code) && body.area_name) {
      const match = body.area_name.match(/^(.+?),\s*(.+?),\s*(.+?)\.\s*(\d+)$/)
      if (match) {
        district_name = district_name || match[1].trim()
        city_name = city_name || match[2].trim()
        province_name = province_name || match[3].trim()
        postal_code = postal_code || match[4].trim()
      }
    }

    // 7. Insert into Supabase table "pesanan"
    const insertPayload = {
      produk_id: body.produk_id,
      nama_produk: product.nama_produk,
      produk_slug: product.slug,
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
      district_id: body.district_id,
      district_name: district_name,
      city_name: city_name,
      province_name: province_name,
      postal_code: postal_code,
      destination_area_details: destination_area_details,
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
