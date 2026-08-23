import Link from "next/link"
import ProdukForm from "@/components/admin/ProdukForm"
export const runtime = "edge"
export default function ProdukBaruPage() { return <main className="mx-auto max-w-5xl space-y-6 p-6"><div><Link href="/admin" className="text-sm text-primary underline">Kembali ke produk</Link><h1 className="mt-3 text-3xl font-bold">Tambah produk</h1><p className="mt-2 text-muted-foreground">Lengkapi data produk. Field indikasi dan kontraindikasi dipisahkan dengan koma.</p></div><ProdukForm /></main> }
