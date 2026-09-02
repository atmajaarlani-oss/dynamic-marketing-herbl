# Panduan Deploy Herbal Insani ke Cloudflare (per Agustus 2026)

Dokumen ini untuk dipakai langsung sebagai instruksi ke Aider (satu bagian = satu sesi/commit),
atau sebagai referensi manual kalau pakai v0.dev / bolt.new.

---

## 0. Keputusan Platform — BACA DULU SEBELUM MULAI

Dokumentasi Cloudflare per 25 Agustus 2026 berubah dari asumsi awal project ini (Cloudflare Pages).
Ringkasannya:

| Opsi | Status | Cocok untuk project ini? |
|---|---|---|
| **vinext** (Vite plugin baru, default Cloudflare sekarang) | Beta, butuh Next.js 16 | ❌ Belum — terlalu baru untuk sistem pembayaran live |
| **OpenNext adapter** (`@opennextjs/cloudflare`) → Cloudflare **Workers** | Matang (GA Feb 2026), mendukung runtime **Node.js penuh** | ✅ **Rekomendasi** |
| **Cloudflare Pages + `@cloudflare/next-on-pages`** | Masih ada, tapi sekarang diposisikan cuma untuk static export | ❌ Tidak cocok — app ini full SSR + API routes |

**Kenapa OpenNext, bukan Pages:** Route Anda (webhook Midtrans pakai `crypto` Node.js untuk verifikasi
SHA512, `midtrans-client` yang CommonJS) butuh runtime Node.js asli. OpenNext ke Workers mendukung ini
lewat `nodejs_compat` flag — artinya **Anda TIDAK perlu ubah `runtime = 'nodejs'` jadi `'edge'` di semua
file**. Ini membatalkan saran saya sebelumnya soal ganti ke edge; abaikan itu, ikuti dokumen ini.

Satu pengecualian: route `app/api/pesanan/status/route.ts` yang sekarang pakai `runtime = 'nodejs'`
sebenarnya tidak butuh Node.js sama sekali (cuma query Supabase via fetch) — boleh dihapus baris itu,
tapi tidak wajib kalau pakai OpenNext.

---

## 1. Sebelum mulai migrasi

- [ ] Buat branch baru: `git checkout -b migrasi-cloudflare-workers`
- [ ] Catat semua file yang punya `export const runtime = 'nodejs'` (biar tahu mana yang perlu dites ulang)
- [ ] Pastikan versi Next.js Anda didukung `@opennextjs/cloudflare` (Next.js 14 GA / 15 GA — cek `package.json`, hindari Next.js 14 kalau bisa karena dukungannya akan di-drop Q1 2026)
- [ ] Pastikan `wrangler` versi ≥ 3.99.0 nanti terpasang

---

## 2. Install & konfigurasi OpenNext adapter

Prompt untuk Aider:
```
Install @opennextjs/cloudflare and wrangler as dev dependencies.
Create wrangler.jsonc in project root with:
- compatibility_date >= 2024-09-23
- compatibility_flags: ["nodejs_compat"]
- main pointing to the OpenNext build output
- assets binding pointing to the static output
Create open-next.config.ts in project root using defineCloudflareConfig from @opennextjs/cloudflare.
Add these npm scripts to package.json: "build:cf": "opennextjs-cloudflare build", "preview:cf": "opennextjs-cloudflare preview", "deploy:cf": "opennextjs-cloudflare deploy".
Do not modify any existing API route logic.
```

Setelah itu, jalankan lokal untuk tes build (bukan deploy dulu):
```bash
npm run build:cf
npm run preview:cf
```
Buka `http://localhost:8788` (atau port yang ditampilkan wrangler) dan tes semua alur: home →
produk → checkout → webhook (perlu ngrok tetap kalau webhook mau dites saat preview lokal) → halaman
status.

---

## 3. Environment variables & secrets

Jangan taruh secret di kode. Daftar yang perlu dipindah ke Cloudflare:

| Variable | Sifat | Tempat set |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Publik | Cloudflare dashboard → Environment Variables |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publik | Environment Variables |
| `SUPABASE_SERVICE_ROLE_KEY` | **Rahasia** | `wrangler secret put SUPABASE_SERVICE_ROLE_KEY` |
| `MIDTRANS_SERVER_KEY` | **Rahasia** | `wrangler secret put MIDTRANS_SERVER_KEY` |
| `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` | Publik | Environment Variables |
| `BITESHIP_API_KEY` | **Rahasia** | `wrangler secret put BITESHIP_API_KEY` |
| `NEXT_PUBLIC_META_PIXEL_ID` | Publik (lihat bagian 5) | Environment Variables |

Catatan: variabel `NEXT_PUBLIC_*` ikut ter-bundle ke client-side JS — jangan pernah taruh key rahasia
di sana.

---

## 4. Bersihkan sisa artefak v0.dev

Prompt untuk Aider (jalankan satu per satu, cek hasil tiap step sebelum lanjut):

```
1. Search the whole repo for "vercel" (case-insensitive) in package.json, next.config.mjs, and any
   analytics/speed-insights imports. List every match, don't remove anything yet.
```
Setelah dapat daftarnya, biasanya yang perlu dibersihkan:
- [ ] `@vercel/analytics` dan `@vercel/speed-insights` di `package.json` + importnya di `app/layout.tsx` (kalau tidak dipakai, hapus; kalau ganti ke Meta Pixel, cukup hapus Vercel-nya)
- [ ] Badge/watermark "Built with v0" (biasanya komponen kecil di footer atau layout — cek `app/layout.tsx` dan `components/`)
- [ ] `vercel.json` di root (tidak relevan lagi untuk Cloudflare)
- [ ] Icon default v0 di `public/` (`apple-icon.png`, `icon-dark-32x32.png`, `icon-light-32x32.png`, `icon.svg`, `placeholder-logo.png`, `placeholder-logo.svg`) — ganti dengan logo Herbal Insani asli
- [ ] Cek `app/layout.tsx` bagian `<head>`/metadata icons, pastikan menunjuk ke file logo baru, bukan default v0

---

## 5. Pasang Meta Pixel

Prompt untuk Aider:
```
Add a client component components/analytics/MetaPixel.tsx that loads the Meta Pixel base code using
next/script with strategy="afterInteractive", using NEXT_PUBLIC_META_PIXEL_ID from env. Include the
noscript fallback img tag. Import and render it once in app/layout.tsx.
```

Dua hal penting yang sering kelewat:
- **PageView di App Router harus manual.** Next.js App Router tidak trigger full page reload saat
  pindah halaman, jadi Pixel default `PageView` di base code cuma jalan sekali. Perlu track ulang tiap
  ganti route pakai `usePathname()` dari `next/navigation` di dalam `useEffect`.
- **Event `Purchase`** — pasang di `app/pesanan/status/status-client.tsx`, trigger `fbq('track', 'Purchase', { value: order.total_bayar, currency: 'IDR' })` **hanya sekali** saat `order.status === 'paid'` pertama kali diterima (pakai `useRef` untuk cegah re-fire tiap polling 5 detik).
- Untuk akurasi lebih baik ke depannya (opsional, bukan wajib sekarang): Meta **Conversions API** —
  kirim event `Purchase` juga dari server (webhook Midtrans, saat status jadi `paid`) supaya tidak
  bergantung sepenuhnya ke client-side pixel yang bisa diblokir ad-blocker.

---

## 6. SEO

- [ ] `app/layout.tsx` — tambah `export const metadata` global (title template, description, default OG image)
- [ ] `app/produk/[slug]/page.tsx` — tambah `generateMetadata()` per produk, pakai `nama_produk`, `headline_pain`, `gambar` untuk title/description/OG image tiap produk
- [ ] `app/sitemap.ts` — generate otomatis dari tabel `produk` (semua slug yang `is_active = true`)
- [ ] `app/robots.ts`
- [ ] JSON-LD `Product` schema di tiap halaman produk (harga, ketersediaan stok, nomor BPOM bisa masuk sebagai `identifier`) — ini yang paling berdampak untuk hasil pencarian Google Shopping/rich snippet produk herbal
- [ ] Pastikan tiap gambar produk punya `alt` text yang deskriptif, bukan nama file

Kalau mau pakai bolt.new khusus buat polish SEO/visual, hasilnya tetap perlu direview manual untuk poin
di atas — bolt.new tidak otomatis tahu skema database Supabase Anda.

---

## 7. Kesiapan production Midtrans & Biteship

- [ ] Ganti `isProduction: false` → `true` di `snap = new midtransClient.Snap({...})` (app/api/checkout/route.ts) — **hanya setelah** akun Midtrans Anda approved untuk live/production
- [ ] Ganti `MIDTRANS_SERVER_KEY` dan `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` dari sandbox ke live key
- [ ] Ganti script Snap.js di `TransaksiChat.tsx` dari `https://app.sandbox.midtrans.com/snap/snap.js` → `https://app.midtrans.com/snap/snap.js`
- [ ] Update **Notification URL** di Midtrans Dashboard → domain Cloudflare Workers Anda (bukan ngrok lagi)
- [ ] Ganti `BITESHIP_API_KEY` dari test key ke live key, dan `origin.collection_method`/alamat gudang dicek ulang
- [ ] Update webhook URL Biteship (kalau pakai) ke domain production
- [ ] **Cek ulang verifikasi signature SHA512 di webhook Midtrans jalan normal di Workers** — ini bagian paling kritis karena pakai `crypto` Node.js; test end-to-end di `preview:cf` sebelum full deploy, jangan asumsikan otomatis jalan cuma karena `nodejs_compat` aktif

---

## 8. Domain & DNS

- [ ] Tambahkan custom domain ke Worker lewat Cloudflare dashboard (Workers & Pages → nama project → Settings → Domains & Routes)
- [ ] Pastikan SSL/TLS mode di "Full" atau "Full (strict)"
- [ ] Kalau domain sebelumnya dipakai untuk sesuatu yang lain di Cloudflare, cek tidak ada conflicting route

---

## 9. Checklist akhir sebelum go-live (end-to-end)

- [ ] Buat 1 pesanan test dengan **live key** kecil (kalau Midtrans production support test transaksi kecil) atau minimal jalur sandbox terakhir kali di domain production sebelum ganti key
- [ ] Cek webhook Midtrans masuk dan `status` di Supabase berubah jadi `paid`
- [ ] Cek order otomatis dibuat di Biteship dan `resi` + tracking link tersimpan **utuh tanpa dipotong**
- [ ] Buka halaman `/pesanan/status?id=...` di domain production (bukan localhost), pastikan tidak nge-lag/spin lama seperti sebelumnya (harusnya hilang begitu tidak lewat ngrok)
- [ ] Klik link tracking, pastikan halaman Biteship-nya benar-benar terbuka
- [ ] Cek Meta Pixel: buka Meta Events Manager → Test Events, pastikan `PageView` dan `Purchase` tercatat
- [ ] Cek admin login & CRUD produk masih berfungsi di domain baru
- [ ] Cek RLS Supabase — pastikan tabel `pesanan` cuma bisa di-SELECT lewat Service Role Key di server, bukan langsung dari browser

---

## Referensi resmi

- Cloudflare Next.js framework guide (terbaru): https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
- OpenNext Cloudflare — Get Started: https://opennext.js.org/cloudflare/get-started
