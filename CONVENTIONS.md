# Aturan Proyek: dynamic-marketing-herbl

## Stack & Alat
- Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript.
- Package manager: `pnpm`.
- Komponen UI: `@base-ui/react`, CVA.
- Integrasi: Midtrans (Payment), Biteship (Logistik), Supabase (Auth/DB).

## Aturan Penulisan Kode
1. **API Keys:** Jangan pernah *hardcode*. Selalu gunakan `process.env`. API sensitif (Midtrans/Biteship/Supabase Role) hanya boleh dieksekusi di `app/api/.../route.ts` (Server Side).
2. **TypeScript:** Hindari penggunaan `any`. Pastikan *payload* yang dikirim ke Biteship/Midtrans sesuai dengan tipe data resminya.
3. **Efisiensi:** Komponen klien (`'use client'`) hanya digunakan jika benar-benar butuh *state* (useState) atau *event listener* (onClick). Sisanya gunakan Server Components.
4. **Tailwind v4:** Gunakan sintaks Tailwind CSS v4 standar tanpa konfigurasi tambahan yang tidak perlu jika sudah ditangani oleh postCSS.

## target publish
1.cloudflare
