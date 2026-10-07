# Perubahan kecil di file yang sudah ada

## app/produk/[slug]/page.tsx
Tambahkan harga jual (diskon jika > 0, kalau tidak harga utama) dan kirim stok:

    const hargaJual = Number(product.harga_diskon) > 0 ? Number(product.harga_diskon) : Number(product.harga_utama ?? 0)
    ...
    <TransaksiChat
      whatsappNumber={whatsappNumber}
      hargaProduk={hargaJual}
      productId={String(product.id)}
      stok={Number(product.stok ?? 0)}
    />
(hapus prop beratPerUnit)

## app/layout.tsx
Hapus tag <script src="https://app.sandbox.midtrans.com/snap/snap.js" ... /> (Snap.js sekarang dimuat oleh TransaksiChat, sekali saja).

## File yang dihapus
- app/api/area-search/route.ts   (pencarian wilayah kini lewat /api/wilayah/cari)

## Environment variable (.env.local dan dashboard Cloudflare)
Baru:
  SUPABASE_SERVICE_ROLE_KEY=...            # rahasia, JANGAN pakai awalan NEXT_PUBLIC_
  QUOTE_SIGNING_SECRET=...                 # openssl rand -hex 32
  BITESHIP_ORIGIN_POSTAL_CODE=40911        # kode pos gudang Anda
  MIDTRANS_IS_PRODUCTION=false             # true saat produksi
  NEXT_PUBLIC_MIDTRANS_SNAP_URL=https://app.sandbox.midtrans.com/snap/snap.js
Tetap: BITESHIP_API_KEY, MIDTRANS_SERVER_KEY, NEXT_PUBLIC_MIDTRANS_CLIENT_KEY, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
Tidak dipakai lagi: BITESHIP_ORIGIN_AREA_ID
