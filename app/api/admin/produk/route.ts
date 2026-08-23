import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export const runtime = "edge"

async function authorized() { const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); return { supabase, user } }
export async function POST(request: Request) { const { supabase, user } = await authorized(); if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); const body = await request.json(); const { data, error } = await supabase.from("produk").insert(body).select("id").single(); if (error) return NextResponse.json({ error: "Gagal menyimpan produk" }, { status: 400 }); return NextResponse.json(data, { status: 201 }) }
