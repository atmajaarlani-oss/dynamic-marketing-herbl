import { NextResponse } from 'next/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'

const supabase = createSupabaseAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get('id')

  if (!orderId || !orderId.startsWith('ORD-')) {
    return NextResponse.json({ error: 'Hey, that order ID looks off!' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from('pesanan')
      .select('midtrans_order_id, nama_pembeli, nama_produk, jumlah, harga_satuan, ongkir, total_bayar, kurir_kode, kurir_layanan, status, resi, catatan, created_at')
      .eq('midtrans_order_id', orderId)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Sorry, we couldn\'t find that order.' }, { status: 404 })
    }

    const kurirParts = [data.kurir_kode, data.kurir_layanan].filter(Boolean)
    const kurir = kurirParts.map(p => p!.toUpperCase()).join(' ')

    return NextResponse.json({
      order_id: data.midtrans_order_id,
      nama_pembeli: data.nama_pembeli,
      nama_produk: data.nama_produk,
      jumlah: data.jumlah,
      harga_satuan: data.harga_satuan,
      ongkir: data.ongkir,
      total_bayar: data.total_bayar,
      kurir,
      status: data.status,
      resi: data.resi,
      tracking_link: data.catatan,
      created_at: new Date(data.created_at).toISOString(),
    })
  } catch (err) {
    return NextResponse.json({ error: 'Oops, something went wrong on our end.' }, { status: 500 })
  }
}
