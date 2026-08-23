"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type FormValue = string | number | boolean | null
export type ProdukFormData = Record<string, FormValue>

const sections = [
  { title: "Identitas Produk", fields: [["nama_produk", "Nama produk", "text"], ["slug", "Slug untuk URL", "text"], ["bpom", "Status BPOM", "text"], ["nomor_bpom", "Nomor BPOM", "text"]] },
  { title: "Copy Marketing", fields: [["headline_pain", "Headline pain", "textarea"], ["sub_headline_harapan", "Sub-headline harapan", "textarea"], ["cerita_singkat", "Cerita singkat", "textarea"]] },
  { title: "Data Produk", fields: [["informasi", "Informasi", "textarea"], ["indikasi", "Indikasi (pisahkan dengan koma)", "textarea"], ["fungsi_utama", "Fungsi utama", "textarea"], ["mekanisme", "Mekanisme", "textarea"], ["target_kerja", "Target kerja", "textarea"], ["kandungan_aktif", "Kandungan aktif", "textarea"], ["komposisi", "Komposisi", "textarea"]] },
  { title: "Cara Pakai", fields: [["isi", "Isi produk", "text"], ["aturan_pakai", "Aturan pakai", "textarea"], ["anjuran", "Anjuran", "textarea"], ["kontraindikasi", "Kontraindikasi (pisahkan dengan koma)", "textarea"]] },
  { title: "Harga, Stok, dan Media", fields: [["gambar", "URL gambar produk", "text"], ["harga_utama", "Harga utama", "number"], ["harga_diskon", "Harga diskon", "number"], ["jumlah_satuan", "Jumlah satuan", "number"], ["dosis_harian_satuan", "Dosis harian", "number"], ["berat_gram", "Berat (gram)", "number"], ["stok", "Stok", "number"]] },
] as const

const defaults: ProdukFormData = { is_active: true, jumlah_satuan: null, dosis_harian_satuan: null, harga_utama: 0, harga_diskon: 0, berat_gram: 100, stok: 0 }
const numericKeys = new Set(["harga_utama", "harga_diskon", "jumlah_satuan", "dosis_harian_satuan", "berat_gram", "stok"])

export default function ProdukForm({ initial = {}, id }: { initial?: ProdukFormData; id?: string }) {
  const router = useRouter()
  const [form, setForm] = useState<ProdukFormData>({ ...defaults, ...initial })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  function update(key: string, value: FormValue) { setForm((current) => ({ ...current, [key]: value })) }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setMessage("")
    const payload = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, numericKeys.has(key) ? (value === "" || value == null ? null : Number(value)) : value]))
    const response = await fetch(id ? `/api/admin/produk/${id}` : "/api/admin/produk", { method: id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    if (!response.ok) { setMessage("Data belum tersimpan. Periksa kembali isian Anda."); setSaving(false); return }
    router.push("/admin"); router.refresh()
  }

  return <form onSubmit={submit} className="mx-auto max-w-4xl space-y-6">
    {sections.map((section) => <section key={section.title} className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"><h2 className="mb-5 text-lg font-semibold text-foreground">{section.title}</h2><div className="grid gap-5 sm:grid-cols-2">{section.fields.map(([key, label, type]) => <label key={key} className={type === "textarea" || key === "gambar" ? "sm:col-span-2" : ""}><span className="mb-2 block text-sm font-medium text-foreground">{label}</span>{type === "textarea" ? <textarea rows={key === "cerita_singkat" ? 3 : 4} value={String(form[key] ?? "")} onChange={(event) => update(key, event.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm leading-6 outline-none transition focus:ring-2 focus:ring-primary" /> : <input type={type} min={type === "number" ? 0 : undefined} value={String(form[key] ?? "")} onChange={(event) => update(key, type === "number" ? (event.target.value === "" ? null : Number(event.target.value)) : event.target.value)} className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary" />}</label>)}</div>{section.title === "Cara Pakai" && <p className="mt-4 text-xs leading-5 text-muted-foreground">Gunakan koma untuk memisahkan beberapa poin. Jumlah satuan dan dosis harian dipakai untuk menghitung harga per hari.</p>}</section>)}
    <label className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"><input type="checkbox" checked={form.is_active !== false} onChange={(event) => update("is_active", event.target.checked)} className="h-4 w-4 accent-primary" /><span className="text-sm font-medium text-foreground">Produk aktif dan tampil di katalog</span></label>
    {message && <p role="alert" className="text-sm text-destructive">{message}</p>}
    <button type="submit" disabled={saving} className="rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50">{saving ? "Menyimpan..." : "Simpan produk"}</button>
  </form>
}

export function getProductFormDefaults(): ProdukFormData { return defaults }
