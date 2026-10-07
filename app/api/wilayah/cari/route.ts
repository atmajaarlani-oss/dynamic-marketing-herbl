import { NextResponse } from 'next/server'
import { createPublicClient } from '@/lib/supabase-public'

export async function GET(request: Request) {
  const q = (new URL(request.url).searchParams.get('q') ?? '').trim().slice(0, 80)
  if (q.length < 3) return NextResponse.json({ success: true, data: [] })

  const { data, error } = await createPublicClient().rpc('cari_wilayah', { q, lim: 8 })
  if (error) {
    console.error('cari_wilayah gagal:', error.message)
    return NextResponse.json({ success: false, message: 'Pencarian wilayah gagal.' }, { status: 500 })
  }
  // Data wilayah jarang berubah: boleh di-cache CDN (aktifkan Cache Rule di Cloudflare)
  return NextResponse.json(
    { success: true, data },
    { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } },
  )
}
