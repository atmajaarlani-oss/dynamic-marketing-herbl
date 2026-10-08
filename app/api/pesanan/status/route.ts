import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get('order_id')

  if (!orderId || !orderId.startsWith('ORD-')) {
    return NextResponse.json(
      { success: false, error: 'Order ID tidak valid' },
      { status: 400 }
    )
  }

  try {
    const { data: pesanan, error } = await supabase
      .from('pesanan')
      .select(
        `id,
        midtrans_order_id,
        nama_pembeli,
        no_hp,
        alamat,
        nama_produk,
        produk_slug,
        jumlah,
        harga_satuan,
        subtotal_produk,
        ongkir,
        total_bayar,
        kurir_kode,
        kurir_layanan,
        status,
        resi,
        catatan,
        biteship_order_id,
        destination_area_details,
        created_at,
        updated_at`
      )
      .eq('midtrans_order_id', orderId)
      .maybeSingle()

    if (error) {
      console.error('Status query error:', error)
      return NextResponse.json(
        { success: false, error: 'Gagal mengambil data pesanan' },
        { status: 500 }
      )
    }

    if (!pesanan) {
      return NextResponse.json(
        { success: false, error: 'Pesanan tidak ditemukan' },
        { status: 404 }
      )
    }

    const kurirParts = [pesanan.kurir_kode, pesanan.kurir_layanan].filter(Boolean)
    const kurir = kurirParts.length > 0 ? kurirParts.join(' - ').toUpperCase() : 'Belum ditentukan'

    let destinationAreaDetails = null
    try {
      if (pesanan.destination_area_details && typeof pesanan.destination_area_details === 'string') {
        destinationAreaDetails = JSON.parse(pesanan.destination_area_details)
      } else if (pesanan.destination_area_details) {
        destinationAreaDetails = pesanan.destination_area_details
      }
    } catch (e) {
      console.warn('Failed to parse destination_area_details:', e)
    }

    return NextResponse.json({
      success: true,
      pesanan: {
        id: pesanan.id,
        midtrans_order_id: pesanan.midtrans_order_id,
        nama_pembeli: pesanan.nama_pembeli,
        no_hp: pesanan.no_hp,
        alamat: pesanan.alamat,
        nama_produk: pesanan.nama_produk,
        produk_slug: pesanan.produk_slug,
        jumlah: pesanan.jumlah,
        harga_satuan: Number(pesanan.harga_satuan ?? 0),
        subtotal_produk: Number(pesanan.subtotal_produk ?? 0),
        ongkir: Number(pesanan.ongkir ?? 0),
        total_bayar: Number(pesanan.total_bayar ?? 0),
        kurir,
        resi: pesanan.resi || null,
        status: pesanan.status,
        tracking_link: pesanan.catatan || null,
        biteship_order_id: pesanan.biteship_order_id || null,
        destination_area_details: destinationAreaDetails,
        created_at: pesanan.created_at ? new Date(pesanan.created_at).toISOString() : null,
        updated_at: pesanan.updated_at ? new Date(pesanan.updated_at).toISOString() : null,
      },
    })
  } catch (e) {
    console.error('Pesanan status error:', e)
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}