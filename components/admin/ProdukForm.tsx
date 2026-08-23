"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const textFields = [
  ["nama_produk", "Nama produk"], ["slug", "Slug"], ["headline_pain", "Headline pain"], ["sub_headline_harapan", "Sub-headline harapan"], ["cerita_singkat", "Cerita singkat"], ["informasi", "Informasi"], ["indikasi", "Indikasi (pisahkan dengan koma)"], ["fungsi_utama", "Fungsi utama"], ["mekanisme", "Mekanisme"], ["target_kerja", "Target kerja"], ["kandungan_aktif", "Kandungan aktif"], ["komposisi", "Komposisi"], ["aturan_pakai", "Aturan pakai"], ["anjuran", "Anjuran"], ["kontraindikasi", "Kontraindikasi (pisahkan dengan koma)"], ["gambar", "Gambar / URL gambar"], ["bpom", "BPOM"], ["nomor_bpom", "Nomor BPOM"],
] as const
const numericFields = ["harga_utama", "harga_diskon", "isi", "jumlah_satuan", "dosis_harian_satuan", "berat_gram", "stok"] as const
export type ProdukFormData = Record<string, string | number | boolean | null>

export default function ProdukForm({ initial = {}, id }: { initial?: ProdukFormData; id?: string }) {
  const router = useRouter(); const [form, setForm] = useState<ProdukFormData>({ is_active: true, ...initial }); const [saving, setSaving] = useState(false); const [message, setMessage] = useState("")
  const update = (key: string, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }))
  async function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); setSaving(true); setMessage(""); const payload = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, numericFields.includes(key as never) ? (value === "" || value == null ? null : Number(value)) : value])); const response = await fetch(id ? `/api/admin/produk/${id}` : "/api/admin/produk", { method: id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); if (!response.ok) { setMessage("Data belum tersimpan. Silakan periksa kembali."); setSaving(false); return } router.push("/admin") }
  return <form onSubmit={submit} className="space-y-6"><div className="grid gap-5 md:grid-cols-2">{textFields.map(([key, label]) => <label key={key} className={["cerita_singkat", "informasi", "indikasi", "fungsi_utama", "mekanisme", "kandungan_aktif", "komposisi", "aturan_pakai", "anjuran", "kontraindikasi"].includes(key) ? "md:col-span-2" : ""}><span className="mb-2 block text-sm font-medium">{label}</span><textarea className="min-h-12 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" value={String(form[key] ?? "")} onChange={(e) => update(key, e.target.value)} /></label>)}{numericFields.map((key) => <label key={key}><span className="mb-2 block text-sm font-medium">{key.replaceAll("_", " ")}</span><input type="number" min="0" className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm" value={String(form[key] ?? "")} onChange={(e) => update(key, e.target.value)} /></label>)}<label className="flex items-center gap-3 rounded-xl border border-border p-4"><input type="checkbox" checked={form.is_active !== false} onChange={(e) => update("is_active", e.target.checked)} /><span className="text-sm font-medium">Produk aktif</span></label></div>{message && <p className="text-sm text-destructive">{message}</p>}<button disabled={saving} className="rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground disabled:opacity-50">{saving ? "Menyimpan..." : "Simpan produk"}</button></form>
}

export function getProductFormDefaults(): ProdukFormData { return { is_active: true } }
