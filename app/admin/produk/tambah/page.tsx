import ProdukForm from "@/components/admin/ProdukForm"

export default function TambahProdukPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">Tambah Produk</h1>
        <p className="text-sm text-muted-foreground">Isi detail produk baru di bawah ini.</p>
      </header>
      <ProdukForm />
    </section>
  )
}
