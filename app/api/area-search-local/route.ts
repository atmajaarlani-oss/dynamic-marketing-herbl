import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')?.toLowerCase().trim() || ''

  if (!query || query.length < 2) {
    return NextResponse.json(
      { error: 'Query minimal 2 karakter' },
      { status: 400 }
    )
  }

  try {
    // Cari dari wilayah_cari (tabel lokal Anda yang sudah lengkap)
    const { data, error } = await supabase
      .from('wilayah_cari')
      .select('desa_id, kecamatan_id, desa, kecamatan, kabkota, provinsi, kode_pos, label')
      .or(
        `desa.ilike.%${query}%,kecamatan.ilike.%${query}%,kabkota.ilike.%${query}%,provinsi.ilike.%${query}%,kode_pos.ilike.%${query}%`
      )
      .limit(20)

    if (error) {
      console.error('Area search error:', error)
      throw error
    }

    const results = (data || []).map((area) => ({
      desa_id: area.desa_id,
      kecamatan_id: area.kecamatan_id,
      desa: area.desa,
      kecamatan: area.kecamatan,
      kabkota: area.kabkota,
      provinsi: area.provinsi,
      kode_pos: area.kode_pos,
      label: area.label,
    }))

    return NextResponse.json({
      success: true,
      areas: results,
      source: 'local_database',
      count: results.length,
    })
  } catch (e) {
    console.error('Area search error:', e)
    return NextResponse.json(
      { error: 'Gagal mencari area' },
      { status: 500 }
    )
  }
}
