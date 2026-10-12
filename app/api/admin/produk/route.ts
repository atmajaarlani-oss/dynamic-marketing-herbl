import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { getAdminUser } from "@/lib/admin-auth"
import { pilihFieldProduk } from "@/lib/produk-payload"

export async function POST(request: Request) {
  const user = await getAdminUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json().catch(() => null)
  const payload = pilihFieldProduk(body)
  if (payload === null) return NextResponse.json({ error: "Data tidak valid" }, { status: 400 })

  const supabase = await createClient()
  const { data, error } = await supabase.from("produk").insert(payload).select("id").single()
  if (error) return NextResponse.json({ error: "Gagal menyimpan produk" }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}
