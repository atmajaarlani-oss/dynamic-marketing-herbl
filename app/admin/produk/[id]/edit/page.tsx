import Link from "next/link"
import { notFound } from "next/navigation"
import ProdukForm, { type ProdukFormData } from "@/components/admin/ProdukForm"
import { createClient } from "@/lib/supabase"
export const runtime = "edge"
export default async function ProdukEditPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) return <main className="p-6"><Link href="/admin/login" className="text-primary underline">Masuk ke admin</Link></main>; const { data } = await supabase.from("produk").select("*").eq("id", id).single(); if (!data) notFound(); return <main className="mx-auto max-w-5xl space-y-6 p-6"><div><Link href="/admin" className="text-sm text-primary underline">Kembali ke produk</Link><h1 className="mt-3 text-3xl font-bold">Edit {data.nama_produk}</h1></div><ProdukForm id={id} initial={data as ProdukFormData} /></main> }
