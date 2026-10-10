import { createAdminClient } from './supabase-admin'

type KlaimPengirimanRow = {
  pesanan_id: string
  nama_pembeli: string
  no_hp: string
  alamat: string
  postal_code: string | number
  kurir_kode: string
  kurir_layanan: string
  nama_produk: string
  harga_satuan: number | string
  jumlah: number | string
  berat_gram: number | string
}

type BiteshipOrderResponse = {
  id?: string
  success?: boolean
  message?: string
  courier?: {
    waybill_id?: string
    link?: string
  }
}

export async function buatOrderBiteship(
  midtransOrderId: string
): Promise<'dibuat' | 'gagal' | 'dilewati'> {
  const apiKey = process.env.BITESHIP_API_KEY
  const originName = process.env.BITESHIP_ORIGIN_CONTACT_NAME
  const originPhone = process.env.BITESHIP_ORIGIN_CONTACT_PHONE
  const originAddress = process.env.BITESHIP_ORIGIN_ADDRESS
  const originPostal = process.env.BITESHIP_ORIGIN_POSTAL_CODE

  const supabase = createAdminClient()

  if (!apiKey || !originName || !originPhone || !originAddress || !originPostal) {
    console.error('Biteship: konfigurasi belum lengkap')
    try {
      await supabase.from('pesanan').update({
        status_pengiriman: 'gagal',
        pengiriman_error: 'Konfigurasi Biteship belum lengkap',
      }).eq('midtrans_order_id', midtransOrderId)
    } catch {
      // abaikan kegagalan update
    }
    return 'gagal'
  }

  let pesanan_id = ''
  let rowData: KlaimPengirimanRow | null = null

  try {
    const rpcRes = await supabase.rpc('klaim_pengiriman', { p_order_id: midtransOrderId })
    const rawData = rpcRes.data as unknown
    const rows = Array.isArray(rawData) ? rawData : []
    if (rows.length === 0) return 'dilewati'

    const first = rows[0] as unknown
    if (typeof first !== 'object' || first === null) return 'dilewati'

    rowData = first as KlaimPengirimanRow
    pesanan_id = typeof rowData.pesanan_id === 'string' ? rowData.pesanan_id : String(rowData.pesanan_id ?? '')
    if (!pesanan_id) return 'dilewati'
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'RPC klaim_pengiriman gagal'
    try {
      await supabase.from('pesanan').update({
        status_pengiriman: 'gagal',
        pengiriman_error: msg.slice(0, 300),
      }).eq('midtrans_order_id', midtransOrderId)
    } catch {
      // abaikan
    }
    return 'gagal'
  }

  const nama_pembeli = typeof rowData.nama_pembeli === 'string' ? rowData.nama_pembeli : String(rowData.nama_pembeli ?? '')
  const no_hp = typeof rowData.no_hp === 'string' ? rowData.no_hp : String(rowData.no_hp ?? '')
  const alamat = typeof rowData.alamat === 'string' ? rowData.alamat : String(rowData.alamat ?? '')
  const postal_code = typeof rowData.postal_code === 'string' ? rowData.postal_code : String(rowData.postal_code ?? '')
  const kurir_kode = typeof rowData.kurir_kode === 'string' ? rowData.kurir_kode : String(rowData.kurir_kode ?? '')
  const kurir_layanan = typeof rowData.kurir_layanan === 'string' ? rowData.kurir_layanan : String(rowData.kurir_layanan ?? '')
  const nama_produk = typeof rowData.nama_produk === 'string' ? rowData.nama_produk : String(rowData.nama_produk ?? '')
  const harga_satuan = typeof rowData.harga_satuan === 'number' ? rowData.harga_satuan : Number(rowData.harga_satuan ?? 0)
  const jumlah = typeof rowData.jumlah === 'number' ? rowData.jumlah : Number(rowData.jumlah ?? 0)
  const berat_gram = typeof rowData.berat_gram === 'number' ? rowData.berat_gram : Number(rowData.berat_gram ?? 0)

  const payload = {
    reference_id: midtransOrderId,
    origin_contact_name: originName,
    origin_contact_phone: originPhone,
    origin_address: originAddress,
    origin_postal_code: Number(originPostal),
    destination_contact_name: nama_pembeli,
    destination_contact_phone: no_hp,
    destination_address: alamat,
    destination_postal_code: Number(postal_code),
    courier_company: kurir_kode,
    courier_type: kurir_layanan,
    delivery_type: 'now' as const,
    items: [
      {
        name: nama_produk,
        value: Math.round(Number(harga_satuan)),
        quantity: Math.round(Number(jumlah)),
        weight: Math.round(Number(berat_gram)),
      },
    ],
  }

  try {
    const res = await fetch('https://api.biteship.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    })

    let responseData: unknown = null
    try {
      responseData = await res.json()
    } catch {
      responseData = null
    }

    const data = (typeof responseData === 'object' && responseData !== null)
      ? (responseData as BiteshipOrderResponse)
      : null

    if (!res.ok || !data || data.success !== true) {
      const msg = (data && typeof data.message === 'string' ? data.message : `HTTP ${res.status}`) || 'Gagal membuat order Biteship'
      await supabase.from('pesanan').update({
        status_pengiriman: 'gagal',
        pengiriman_error: msg.slice(0, 300),
      }).eq('id', pesanan_id)
      return 'gagal'
    }

    const biteshipId = typeof data.id === 'string' ? data.id : ''
    const courierObj = (typeof data.courier === 'object' && data.courier !== null)
      ? (data.courier as { waybill_id?: unknown; link?: unknown })
      : null
    const resi = courierObj && typeof courierObj.waybill_id === 'string' ? courierObj.waybill_id : ''
    const tracking_link = courierObj && typeof courierObj.link === 'string' ? courierObj.link : ''

    await supabase.from('pesanan').update({
      biteship_order_id: biteshipId,
      resi,
      tracking_link,
      status_pengiriman: 'dibuat',
      pengiriman_error: null,
    }).eq('id', pesanan_id)

    return 'dibuat'
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Exception saat membuat order Biteship'
    try {
      await supabase.from('pesanan').update({
        status_pengiriman: 'gagal',
        pengiriman_error: msg.slice(0, 300),
      }).eq('id', pesanan_id)
    } catch {
      // abaikan
    }
    return 'gagal'
  }
}
