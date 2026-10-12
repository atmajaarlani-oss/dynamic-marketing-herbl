import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { getAdminUser } from "@/lib/admin-auth"
import { pilihFieldProduk } from "@/lib/produk-payload"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await request.json().catch(() => null)
  const payload = pilihFieldProduk(body)
  if (payload === null) return NextResponse.json({ error: "Data tidak valid" }, { status: 400 })

  const supabase = await createClient()
  const { error } = await supabase.from("produk").update(payload).eq("id", id)
  if (error) return NextResponse.json({ error: "Gagal memperbarui produk" }, { status: 400 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const supabase = await createClient()
  const { error } = await supabase.from("produk").delete().eq("id", id)
  if (error) return NextResponse.json({ error: "Gagal menghapus produk" }, { status: 400 })
  return NextResponse.json({ ok: true })
}
