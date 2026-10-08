import { createClient } from '@supabase/supabase-js';

// Script Sinkronisasi Wilayah (Backend Setup)

export async function mapBiteshipAreasFromLocal() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // Mapping data lokal Anda ke biteship_areas (one-time setup)
    const { error } = await supabase
      .from('biteship_areas')
      .insert([
        { biteship_id: 'DESA001', name: 'Desa Sukamaju', postal_code: '16001' },
        { biteship_id: 'DESA002', name: 'Desa Sukamakmur', postal_code: '16002' },
        { biteship_id: 'DESA003', name: 'Desa Sukawangi', postal_code: '16003' },
      ]);

    if (error) console.error('Mapping error:', error);
    else console.log('✅ Mapping selesai (0 Biteship hit!)');
  } catch (e) {
    console.error('❌ Error:', e);
  }
}
