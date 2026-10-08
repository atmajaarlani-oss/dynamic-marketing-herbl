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
      .insert(
        // Data dari wilayah_cari yang Anda sudah punya
        // Minimal: desa_id (jadi biteship_id), name, postal_code
      );

    if (error) console.error('Mapping error:', error);
    else console.log('✅ Mapping selesai (0 Biteship hit!)');
  } catch (e) {
    console.error('❌ Error:', e);
  }
}
