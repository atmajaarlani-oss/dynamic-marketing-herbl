type KeunggulanInsaniProps = { producerName?: string; story?: string }

export function KeunggulanInsani({ producerName = 'PT Insani', story = 'Kami percaya produk herbal yang baik dimulai dari niat yang baik, bahan yang terpilih, dan proses yang dijaga dengan penuh tanggung jawab.' }: KeunggulanInsaniProps) {
  return (
    <section className="bg-gradient-to-br from-primary via-primary/95 to-secondary px-4 py-16 text-primary-foreground sm:px-6 lg:px-8" aria-labelledby="keunggulan-insani-title">
      <div className="mx-auto max-w-4xl rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 p-6 shadow-sm sm:p-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground/75">Cerita di balik produk</p>
        <h2 id="keunggulan-insani-title" className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Keunggulan {producerName}</h2>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-primary-foreground/80">{story}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3"><div><p className="font-semibold">Bahan terpilih</p><p className="mt-1 text-sm text-primary-foreground/70">Diproses dengan perhatian.</p></div><div><p className="font-semibold">Proses terjaga</p><p className="mt-1 text-sm text-primary-foreground/70">Kualitas menjadi kebiasaan.</p></div><div><p className="font-semibold">Melayani dengan hati</p><p className="mt-1 text-sm text-primary-foreground/70">Dengar cerita setiap pelanggan.</p></div></div>
      </div>
    </section>
  )
}
