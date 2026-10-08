import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  const q = (new URL(request.url).searchParams.get('q') ?? '').trim().slice(0, 80)
  
  if (q.length < 3) {
    return NextResponse.json({ success: true, data: [] })
  }

  try {
    // Cari dari wilayah_cari menggunakan teks_cari (sudah dioptimalkan)
    const { data, error } = await supabase
      .from('wilayah_cari')
      .select('desa_id, kecamatan_id, desa, kecamatan, kabkota, provinsi, kode_pos, label')
      .ilike('teks_cari', `%${q}%`)
      .limit(8)

    if (error) {
      console.error('cari_wilayah gagal:', error.message)
      return NextResponse.json(
        { success: false, message: 'Pencarian wilayah gagal.' },
        { status: 500 }
      )
    }

    // Transform ke format yang diexpect frontend
    const results = (data || []).map((item) => ({
      desa_id: item.desa_id,
      kecamatan_id: item.kecamatan_id,
      desa: item.desa,
      kecamatan: item.kecamatan,
      kabkota: item.kabkota,
      provinsi: item.provinsi,
      kode_pos: item.kode_pos,
      label: item.label,
    }))

    return NextResponse.json(
      { success: true, data: results },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
        },
      }
    )
  } catch (e) {
    console.error('cari_wilayah error:', e)
    return NextResponse.json(
      { success: false, message: 'Pencarian wilayah gagal.' },
      { status: 500 }
    )
  }
}
