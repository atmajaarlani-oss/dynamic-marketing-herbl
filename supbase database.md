## Table `produk`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `slug` | `text` |  Unique |
| `nama_produk` | `text` |  |
| `informasi` | `text` |  Nullable |
| `komposisi` | `text` |  Nullable |
| `isi` | `text` |  Nullable |
| `aturan_pakai` | `text` |  Nullable |
| `anjuran` | `text` |  Nullable |
| `harga_utama` | `numeric` |  |
| `harga_diskon` | `numeric` |  |
| `kandungan_aktif` | `text` |  Nullable |
| `fungsi_utama` | `text` |  Nullable |
| `mekanisme` | `text` |  Nullable |
| `target_kerja` | `text` |  Nullable |
| `indikasi` | `text` |  Nullable |
| `kontraindikasi` | `text` |  Nullable |
| `gambar` | `text` |  Nullable |
| `berat_gram` | `int4` |  Nullable |
| `stok` | `int4` |  Nullable |
| `is_active` | `bool` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |
| `headline_pain` | `text` |  Nullable |
| `sub_headline_harapan` | `text` |  Nullable |
| `cerita_singkat` | `text` |  Nullable |
| `jumlah_satuan` | `int4` |  Nullable |
| `dosis_harian_satuan` | `int4` |  Nullable |
| `bpom` | `text` |  Nullable |

## Table `global_settings`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `key` | `varchar` | Primary |
| `value` | `text` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |

## Table `pesanan`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `created_at` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |
| `nama_pembeli` | `text` |  |
| `no_hp` | `text` |  |
| `alamat` | `text` |  |
| `district_id` | `text` |  Nullable |
| `district_name` | `text` |  Nullable |
| `city_name` | `text` |  Nullable |
| `province_name` | `text` |  Nullable |
| `postal_code` | `text` |  Nullable |
| `produk_id` | `uuid` |  Nullable |
| `produk_slug` | `text` |  Nullable |
| `nama_produk` | `text` |  |
| `jumlah` | `int4` |  Nullable |
| `harga_satuan` | `numeric` |  |
| `subtotal_produk` | `numeric` |  |
| `ongkir` | `numeric` |  Nullable |
| `total_bayar` | `numeric` |  |
| `kurir_kode` | `text` |  Nullable |
| `kurir_layanan` | `text` |  Nullable |
| `resi` | `text` |  Nullable |
| `status` | `text` |  Nullable |
| `metode_pembayaran` | `text` |  Nullable |
| `midtrans_order_id` | `text` |  Nullable Unique |
| `midtrans_transaction_id` | `text` |  Nullable |
| `catatan` | `text` |  Nullable |
| `subdistrict_name` | `text` |  Nullable |
| `destination_area_details` | `jsonb` |  Nullable |
| `snap_token` | `text` |  Nullable |
| `village_id` | `text` |  Nullable |
| `stok_dikurangi` | `bool` |  |
| `expires_at` | `timestamptz` |  Nullable |
| `biteship_order_id` | `varchar` |  Nullable |
| `destination_area_id` | `varchar` |  Nullable |
| `status_pengiriman` | `text` |  |
| `pengiriman_error` | `text` |  Nullable |
| `pengiriman_dicoba` | `int4` |  |
| `pengiriman_mulai` | `timestamptz` |  Nullable |
| `tracking_link` | `text` |  Nullable |

## Table `wilayah_provinsi`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `text` | Primary |
| `nama` | `text` |  |
| `ibukota` | `text` |  Nullable |
| `lat` | `float8` |  Nullable |
| `lng` | `float8` |  Nullable |

## Table `wilayah_kabkota`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `text` | Primary |
| `provinsi_id` | `text` |  |
| `nama` | `text` |  |
| `tipe` | `text` |  |
| `lat` | `float8` |  Nullable |
| `lng` | `float8` |  Nullable |

## Table `wilayah_kecamatan`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `text` | Primary |
| `kabkota_id` | `text` |  |
| `nama` | `text` |  |
| `lat` | `float8` |  Nullable |
| `lng` | `float8` |  Nullable |

## Table `wilayah_desa`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `text` | Primary |
| `kecamatan_id` | `text` |  |
| `nama` | `text` |  |
| `kode_pos` | `text` |  |
| `lat` | `float8` |  Nullable |
| `lng` | `float8` |  Nullable |

## Table `wilayah_cari`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `desa_id` | `text` | Primary |
| `kecamatan_id` | `text` |  |
| `desa` | `text` |  |
| `kecamatan` | `text` |  |
| `kabkota` | `text` |  |
| `provinsi` | `text` |  |
| `kode_pos` | `text` |  |
| `label` | `text` |  |
| `teks_cari` | `text` |  |

## Table `biteship_areas`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int4` | Primary |
| `biteship_id` | `int8` |  Nullable Unique |
| `wilayah_desa_id` | `text` |  Nullable |
| `name` | `varchar` |  Nullable |
| `type` | `varchar` |  Nullable |
| `postal_code` | `varchar` |  Nullable |
| `synced_at` | `timestamp` |  Nullable |

## Table `ongkir_cache`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int4` | Primary |
| `destination_area_id` | `varchar` |  Nullable |
| `courier_id` | `varchar` |  Nullable |
| `courier_name` | `varchar` |  Nullable |
| `cost` | `numeric` |  Nullable |
| `estimated_days` | `int4` |  Nullable |
| `cached_at` | `timestamp` |  Nullable |
| `expires_at` | `timestamp` |  Nullable |

## Table `wilayah_biteship_mapping`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `local_desa_id` | `text` | Primary |
| `biteship_order_id` | `text` |  Nullable |
| `desa` | `text` |  Nullable |
| `kecamatan` | `text` |  Nullable |
| `kabkota` | `text` |  Nullable |
| `provinsi` | `text` |  Nullable |
| `kode_pos` | `text` |  Nullable |
| `label` | `text` |  Nullable |
| `last_used_at` | `timestamptz` |  Nullable |

## RLS Policies

### `global_settings`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `public_read_settings` | SELECT | public | PERMISSIVE | `true` | — |

### `wilayah_provinsi`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `wilayah_baca_publik` | SELECT | anon, authenticated | PERMISSIVE | `true` | — |

### `wilayah_kabkota`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `wilayah_baca_publik` | SELECT | anon, authenticated | PERMISSIVE | `true` | — |

### `wilayah_kecamatan`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `wilayah_baca_publik` | SELECT | anon, authenticated | PERMISSIVE | `true` | — |

### `wilayah_desa`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `wilayah_baca_publik` | SELECT | anon, authenticated | PERMISSIVE | `true` | — |

### `wilayah_cari`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `wilayah_baca_publik` | SELECT | anon, authenticated | PERMISSIVE | `true` | — |

### `pesanan`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `admin_baca_pesanan` | SELECT | authenticated | PERMISSIVE | `is_admin()` | — |
| `admin_ubah_pesanan` | UPDATE | authenticated | PERMISSIVE | `is_admin()` | `is_admin()` |

### `produk`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `produk_baca_publik` | SELECT | anon, authenticated | PERMISSIVE | `(is_active = true)` | — |
| `produk_admin_baca` | SELECT | authenticated | PERMISSIVE | `is_admin()` | — |
| `produk_admin_insert` | INSERT | authenticated | PERMISSIVE | — | `is_admin()` |
| `produk_admin_update` | UPDATE | authenticated | PERMISSIVE | `is_admin()` | `is_admin()` |
| `produk_admin_delete` | DELETE | authenticated | PERMISSIVE | `is_admin()` | — |

