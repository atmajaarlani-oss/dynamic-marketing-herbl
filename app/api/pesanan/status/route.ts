import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

function inisialNama(nama: string): string {
  const t = nama?.trim()
  if (!t) return 'Pembeli'
  return t.split(/\s+/).filter(Boolean).slice(0, 3).map(w => w[0] + '.').join(' ')
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get('order_id')

  if (!orderId || !orderId.startsWith('ORD-')) {
    return NextResponse.json(
      { success: false, error: 'Order ID tidak valid' },
      { status: 400 }
    )
  }

  const supabase = createAdminClient()

  try {
    const { data: pesanan, error } = await supabase
      .from('pesanan')
      .select(
        `midtrans_order_id,
        nama_pembeli,
        nama_produk,
        jumlah,
        harga_satuan,
        ongkir,
        total_bayar,
        kurir_kode,
        kurir_layanan,
        status,
        resi,
        tracking_link,
        status_pengiriman,
        created_at`
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

    return NextResponse.json({
      success: true,
      pesanan: {
        midtrans_order_id: pesanan.midtrans_order_id,
        nama_pembeli: inisialNama(pesanan.nama_pembeli),
        nama_produk: pesanan.nama_produk,
        jumlah: pesanan.jumlah,
        harga_satuan: Number(pesanan.harga_satuan ?? 0),
        ongkir: Number(pesanan.ongkir ?? 0),
        total_bayar: Number(pesanan.total_bayar ?? 0),
        kurir,
        status: pesanan.status,
        resi: pesanan.resi || null,
        tracking_link: typeof pesanan.tracking_link === 'string' && pesanan.tracking_link.startsWith('https://')
          ? pesanan.tracking_link
          : null,
        status_pengiriman: pesanan.status_pengiriman || null,
        created_at: pesanan.created_at ? new Date(pesanan.created_at).toISOString() : null,
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
