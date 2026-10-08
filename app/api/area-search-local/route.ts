import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';
  const type = searchParams.get('type');

  if (!query || query.length < 2) {
    return NextResponse.json({ error: 'Query minimal 2 karakter' }, { status: 400 });
  }

  try {
    let q = supabase
      .from('biteship_areas')
      .select('biteship_id, name, type, postal_code');

    if (type) q = q.eq('type', type);

    const { data, error } = await q.ilike('name', `%${query}%`).limit(20);
    if (error) throw error;

    const results = data?.map(area => ({
      id: area.biteship_id,
      name: area.name,
      type: area.type,
      postal_code: area.postal_code,
    })) || [];

    return NextResponse.json({
      success: true,
      areas: results,
      source: 'local_database',
    });
  } catch (e) {
    console.error('Area search error:', e);
    return NextResponse.json({ error: 'Gagal mencari area' }, { status: 500 });
  }
}
