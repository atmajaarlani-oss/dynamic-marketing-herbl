import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { verifyQuote } from '@/lib/quote'
import { createSnapTransaction } from '@/lib/midtrans'

type HasilPesanan = { pesanan_id: string; nama_produk: string; harga_satuan: number; subtotal: number; total: number }

const PESAN_RPC: Record<string, { status: number; pesan: string }> = {
  STOK_TIDAK_CUKUP: { status: 409, pesan: 'Maaf, stok tidak mencukupi. Kurangi jumlah atau coba lagi nanti.' },
  JUMLAH_TIDAK_VALID: { status: 400, pesan: 'Jumlah beli tidak valid.' },
  WILAYAH_TIDAK_DITEMUKAN: { status: 400, pesan: 'Wilayah tujuan tidak valid. Pilih ulang.' },
  ONGKIR_TIDAK_VALID: { status: 400, pesan: 'Ongkir tidak valid. Pilih ulang kurir.' },
}

function gagal(status: number, error: string) {
  return NextResponse.json({ success: false, error }, { status })
}

function normalisasiHp(raw: string): string | null {
  let d = raw.replace(/\D/g, '')
  if (d.startsWith('0')) d = '62' + d.slice(1)
  return /^628\d{8,11}$/.test(d) ? d : null
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) return gagal(400, 'Permintaan tidak valid.')

  const produkId = String(body.produk_id ?? '')
  const villageId = String(body.village_id ?? '')
  const jumlah = Number(body.jumlah)
  const nama = String(body.nama_pembeli ?? '').trim()
  const alamat = String(body.alamat ?? '').trim()
  const hp = normalisasiHp(String(body.no_hp ?? ''))
  const quoteToken = String(body.quote ?? '')

  if (!produkId || !villageId) return gagal(400, 'Data tidak lengkap.')
  if (!Number.isInteger(jumlah) || jumlah < 1 || jumlah > 20) return gagal(400, 'Jumlah beli tidak valid.')
  if (nama.length < 2 || nama.length > 100) return gagal(400, 'Nama tidak valid.')
  if (alamat.length < 10 || alamat.length > 300) return gagal(400, 'Alamat lengkap minimal 10 karakter.')
  if (!hp) return gagal(400, 'Nomor HP tidak valid. Contoh: 08123456789.')

  // 1. Ongkir: wajib quote bertanda tangan dari /api/ongkir, dan harus cocok dengan data di DB
  const quote = await verifyQuote(quoteToken)
  if (!quote) return gagal(400, 'Pilihan kurir kedaluwarsa. Silakan pilih kurir lagi.')

  const admin = createAdminClient()
  const [{ data: produk }, { data: desa }] = await Promise.all([
    admin.from('produk').select('berat_gram').eq('id', produkId).maybeSingle(),
    admin.from('wilayah_cari').select('kode_pos').eq('desa_id', villageId).maybeSingle(),
  ])
  if (!produk || !desa) return gagal(404, 'Produk atau wilayah tidak ditemukan.')
  if (quote.postal !== desa.kode_pos || quote.berat !== (produk.berat_gram ?? 0) * jumlah) {
    return gagal(409, 'Data pengiriman berubah. Silakan pilih kurir lagi.')
  }

  // 2. Kurangi stok + buat pesanan dalam satu transaksi database (atomik)
  const orderId = `ORD-${Date.now()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`
  const { data, error } = await admin.rpc('buat_pesanan', {
    p_produk_id: produkId, p_jumlah: jumlah, p_nama: nama, p_no_hp: hp, p_alamat: alamat,
    p_village_id: villageId, p_kurir_kode: quote.kurir, p_kurir_layanan: quote.layanan,
    p_ongkir: quote.harga, p_midtrans_order_id: orderId, p_menit: 60,
  })
  if (error) {
    const cocok = Object.entries(PESAN_RPC).find(([kode]) => error.message.includes(kode))
    if (cocok) return gagal(cocok[1].status, cocok[1].pesan)
    console.error('buat_pesanan gagal:', error.message)
    return gagal(500, 'Checkout gagal. Coba lagi.')
  }
  const pesanan = data as HasilPesanan

  // 3. Minta token Snap. Jika gagal, stok yang sudah ditahan langsung dikembalikan.
  try {
    const snap = await createSnapTransaction({
      transaction_details: { order_id: orderId, gross_amount: Math.round(pesanan.total) },
      item_details: [
        { id: produkId.slice(0, 50), price: Math.round(pesanan.harga_satuan), quantity: jumlah, name: pesanan.nama_produk.slice(0, 50) },
        { id: 'ONGKIR', price: Math.round(quote.harga), quantity: 1, name: `Ongkir ${quote.kurir.toUpperCase()} ${quote.layanan}`.slice(0, 50) },
      ],
      customer_details: {
        first_name: nama.slice(0, 50), phone: hp,
        shipping_address: { first_name: nama.slice(0, 50), phone: hp, address: alamat.slice(0, 200), postal_code: desa.kode_pos, country_code: 'IDN' },
      },
      expiry: { unit: 'minutes', duration: 60 },
    })
    await admin.from('pesanan').update({ snap_token: snap.token }).eq('id', pesanan.pesanan_id)
    return NextResponse.json({ success: true, token: snap.token, order_id: orderId })
  } catch (e) {
    console.error('Snap gagal:', e)
    await admin.rpc('update_status_pesanan', { p_order_id: orderId, p_status: 'cancelled' })
    return gagal(502, 'Pembayaran belum dapat diproses. Coba lagi sebentar.')
  }
}
