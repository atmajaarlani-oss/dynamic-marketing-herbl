# Herbal Insani — Dynamic Marketing & Checkout

Website marketing dan checkout untuk produk herbal Herbal Insani. Aplikasi ini menyediakan halaman landing, katalog produk, checkout berbasis Midtrans Snap, pelacakan status pesanan, panel admin produk, pencarian area pengiriman, dan pembuatan pengiriman melalui Biteship.

## Daftar isi

- [Gambaran umum](#gambaran-umum)
- [Teknologi](#teknologi)
- [Struktur proyek](#struktur-proyek)
- [Alur pelanggan](#alur-pelanggan)
- [Alur pembayaran](#alur-pembayaran)
- [Konfigurasi environment](#konfigurasi-environment)
- [Menjalankan secara lokal](#menjalankan-secara-lokal)
- [Endpoint API](#endpoint-api)
- [Supabase dan keamanan](#supabase-dan-keamanan)
- [Deployment Cloudflare](#deployment-cloudflare)
- [Troubleshooting](#troubleshooting)

## Gambaran umum

Aplikasi menggunakan Next.js App Router. Halaman publik mengambil data produk dari Supabase, sedangkan operasi sensitif seperti membuat transaksi Midtrans, menyimpan Snap token, membaca detail pesanan, dan menerima webhook dijalankan di server.

Fitur utama:

- Landing page marketing Herbal Insani.
- Halaman katalog dan detail produk berdasarkan slug.
- Form transaksi bertahap dengan data pembeli, alamat, area, kurir, ongkir, dan jumlah produk.
- Pembayaran Midtrans Snap.
- Penyimpanan Snap token agar popup pembayaran dapat dilanjutkan setelah ditutup.
- Halaman status pesanan dengan polling status.
- Webhook Midtrans untuk memperbarui status pembayaran.
- Pembuatan order Biteship setelah pembayaran berhasil.
- Panel admin untuk login dan CRUD produk.
- Sitemap dan robots untuk SEO.

## Teknologi

- Next.js 16 dan React 19.
- TypeScript.
- Tailwind CSS v4.
- Supabase untuk database, auth, dan Row Level Security.
- Midtrans Snap untuk pembayaran.
- Biteship untuk pencarian area, ongkir, dan pengiriman.
- pnpm sebagai package manager.

## Struktur proyek

```text
app/
├── page.tsx                         Landing page utama
├── home/page.tsx                    Halaman home/katalog
├── produk/[slug]/page.tsx           Detail produk publik
├── pesanan/[orderId]/page.tsx       Entry route detail pesanan
├── pesanan/status/                  Status dan polling pesanan
├── pesanan/resume/                  Melanjutkan pembayaran Midtrans
├── admin/                           Panel admin produk
└── api/
    ├── checkout/                    Membuat pesanan dan Snap token
    ├── pesanan/status/              Membaca status pesanan
    ├── pesanan/resume/              Mengambil Snap token tersimpan
    ├── webhook/midtrans/            Menerima notifikasi pembayaran
    ├── area-search/                 Mencari area Biteship
    ├── ongkir/                      Mengambil pilihan ongkir
    └── admin/produk/                CRUD produk admin

components/landing/                  Section marketing dan form transaksi
components/admin/                    Navigasi, form, dan daftar produk admin
lib/supabase.ts                      Supabase server/admin helper
lib/supabase-browser.ts              Supabase browser helper
lib/produk-view-model.ts             Normalisasi data produk untuk UI
lib/harga.ts                         Format dan perhitungan harga
middleware.ts                        Proteksi route admin
```

## Alur pelanggan

1. Pelanggan membuka landing page atau katalog.
2. Pelanggan memilih produk dan membuka detail produk.
3. Tombol **Beli Sekarang** menggulir dengan animasi halus ke form `TransaksiChat`.
4. Pelanggan mengisi identitas, alamat, area, dan jumlah produk.
5. Aplikasi mengambil opsi kurir/ongkir dari endpoint server.
6. Server memvalidasi harga dari database, bukan mempercayai harga dari browser.
7. Server membuat record `pesanan` berstatus `pending`.
8. Server membuat satu transaksi Midtrans dan menyimpan `snap_token` ke record pesanan.
9. Browser membuka popup Snap menggunakan token tersebut.
10. Jika popup ditutup, pelanggan diarahkan ke halaman status dan dapat membuka halaman resume untuk memakai token yang sama.
11. Setelah Midtrans mengirim webhook `settlement`/`capture`, status pesanan berubah menjadi `paid`.
12. Webhook mencoba membuat order Biteship. Kegagalan Biteship tidak membatalkan status pembayaran.

## Alur pembayaran

### Membuat pembayaran

`POST /api/checkout` melakukan hal berikut:

- Memvalidasi input dasar dan jumlah produk.
- Mengambil produk dari Supabase.
- Menghitung ulang subtotal, ongkir, dan total di server.
- Membuat `midtrans_order_id` unik.
- Menyimpan pesanan pending menggunakan service-role client server.
- Membuat transaksi Midtrans satu kali.
- Menyimpan `snapResponse.token` ke kolom `pesanan.snap_token`.
- Mengembalikan token dan order ID ke browser.

### Melanjutkan pembayaran

`GET /api/pesanan/resume?order_id=...` membaca pesanan berdasarkan `midtrans_order_id` dan mengembalikan token yang tersimpan. Token lama harus menjadi jalur utama; endpoint tidak boleh membuat transaksi kedua jika token masih tersedia.

Jika token kosong, endpoint dapat menggunakan fallback server Midtrans sesuai implementasi saat ini. Untuk pesanan baru, keberadaan token seharusnya diperiksa di database sebelum menguji alur tutup-popup/resume.

### Webhook

`POST /api/webhook/midtrans` memverifikasi signature SHA-512 sebelum mengubah database. Status Midtrans dipetakan sebagai berikut:

| Status Midtrans | Status aplikasi |
|---|---|
| `settlement` | `paid` |
| `capture` + fraud accept | `paid` |
| `capture` lainnya | `challenge` |
| `pending` | `pending` |
| `deny` / `cancel` | `cancelled` |
| `expire` | `expired` |

Jangan menganggap callback browser sebagai sumber kebenaran pembayaran. Status final berasal dari webhook/server Midtrans.

## Konfigurasi environment

Jangan commit file `.env` atau nilai secret. Gunakan environment variable lokal/deployment.

### Supabase

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` hanya boleh dipakai di route server. Jangan awali secret dengan `NEXT_PUBLIC_`.

### Midtrans

```env
MIDTRANS_SERVER_KEY=
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=
```

Mode saat ini menggunakan endpoint Snap sandbox. Sebelum production, ganti key dan URL Snap ke pasangan production secara bersamaan.

### Biteship

```env
BITESHIP_API_KEY=
BITESHIP_ORIGIN_CONTACT_NAME=
BITESHIP_ORIGIN_CONTACT_PHONE=
BITESHIP_ORIGIN_AREA_ID=
BITESHIP_ORIGIN_ADDRESS=
BITESHIP_ORIGIN_LATITUDE=
BITESHIP_ORIGIN_LONGITUDE=
```

Pastikan koordinat, area ID, alamat asal, dan API key berasal dari lingkungan yang sama (test atau production).

### Meta Pixel opsional

```env
NEXT_PUBLIC_META_PIXEL_ID=
```

## Menjalankan secara lokal

Pastikan Node.js dan pnpm tersedia.

```bash
pnpm install
pnpm dev
```

Buka `http://localhost:3000`.

Untuk production-like test lokal:

```bash
pnpm build
pnpm start
```

Script yang tersedia:

- `pnpm dev` — server development Next.js.
- `pnpm build` — build production menggunakan webpack.
- `pnpm start` — menjalankan hasil build production.

## Endpoint API

| Method | Route | Kegunaan |
|---|---|---|
| `POST` | `/api/checkout` | Validasi order, simpan pesanan, dan membuat Snap token |
| `GET` | `/api/pesanan/status?order_id=...` | Membaca status/detail pesanan |
| `GET` | `/api/pesanan/resume?order_id=...` | Mengambil Snap token untuk pembayaran ulang |
| `POST` | `/api/webhook/midtrans` | Menerima notifikasi status Midtrans |
| `GET` | `/api/area-search?...` | Proxy pencarian area Biteship |
| `POST` | `/api/ongkir` | Mengambil pilihan ongkir |
| `GET/POST/...` | `/api/admin/produk` | Operasi produk admin |

## Supabase dan keamanan

- Gunakan service-role client hanya di server route yang memang memerlukan akses administratif.
- Semua query produk/pesanan harus memproyeksikan kolom yang diperlukan saja.
- Validasi harga, jumlah, dan total di server.
- Verifikasi signature webhook sebelum update status.
- Jangan mencetak `MIDTRANS_SERVER_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `BITESHIP_API_KEY`, atau Snap token penuh ke log.
- Route admin dilindungi middleware berdasarkan `app_metadata.role` atau `app_metadata.is_admin`.
- Aktifkan dan review RLS pada tabel Supabase yang terekspos.
- Batasi timeout request ke layanan eksternal agar webhook tidak menggantung.

## Deployment Cloudflare

Target deployment proyek adalah Cloudflare Workers menggunakan OpenNext, bukan Cloudflare Pages static export. Panduan migrasi lengkap tersedia di [`docs/panduan-deploy-cloudflare-herbal-insani.md`](docs/panduan-deploy-cloudflare-herbal-insani.md).

Checklist penting sebelum production:

- Set semua environment variable di Cloudflare.
- Gunakan secret storage untuk service-role, Midtrans server key, dan Biteship API key.
- Pastikan `nodejs_compat` aktif karena webhook menggunakan crypto Node.js dan SDK Midtrans.
- Ubah mode Midtrans dan URL Snap hanya ketika live credentials sudah siap.
- Daftarkan URL webhook production di Midtrans.
- Uji checkout, tutup popup, resume token, webhook, status paid, dan Biteship end-to-end.
- Pastikan domain production tidak lagi bergantung pada localhost/ngrok.

## Troubleshooting

### Halaman pesanan 404

Gunakan format route:

```text
/pesanan/<midtrans_order_id>
```

Contoh:

```text
/pesanan/ORD-1234567890-ABCD
```

Pastikan order ID benar-benar ada di tabel `pesanan` dan jangan menghapus bagian `/pesanan/` dari URL.

### Resume menampilkan “Gagal mengambil token”

Periksa hal berikut:

1. Pesanan dibuat setelah kolom `snap_token` tersedia.
2. `POST /api/checkout` berhasil melakukan update `snap_token` setelah Midtrans mengembalikan token.
3. `SUPABASE_SERVICE_ROLE_KEY` tersedia di server.
4. `MIDTRANS_SERVER_KEY` tersedia untuk fallback.
5. Log server tidak menunjukkan `Midtrans is not defined` atau error update Supabase.

Untuk pemeriksaan aman di database, cek hanya keberadaan dan panjang token, bukan nilainya:

```sql
select
  midtrans_order_id,
  status,
  snap_token is not null as has_snap_token,
  length(snap_token) as snap_token_length
from public.pesanan
where midtrans_order_id = 'ORD-...';
```

### Webhook masuk tetapi Biteship gagal

Status pembayaran tetap dapat menjadi `paid`; Biteship diproses sebagai langkah non-fatal. Periksa timeout/network, `BITESHIP_API_KEY`, data area tujuan, serta konfigurasi asal pengiriman. Jangan menandai pembayaran gagal hanya karena pembuatan order logistik gagal.

## Catatan pengembangan

Dokumentasi ini menjelaskan perilaku aplikasi berdasarkan struktur branch saat ini. Setiap perubahan pada skema `pesanan`, status pembayaran, provider pembayaran, atau target deployment perlu memperbarui README dan panduan deployment terkait.
