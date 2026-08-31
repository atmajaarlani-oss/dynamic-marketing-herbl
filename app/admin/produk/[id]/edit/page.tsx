import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase"
import ProdukForm, { type ProdukFormData } from "@/components/admin/ProdukForm"

export default async function EditProdukPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: produk } = await supabase.from("produk").select("*").eq("id", id).single()

  if (!produk) notFound()

  return <ProdukForm id={id} initial={produk as ProdukFormData} />
}
