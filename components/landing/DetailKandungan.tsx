type DetailItem = { title: string; content: string }
type DetailSection = { title: string; items: DetailItem[] }

const defaultSections: DetailSection[] = [
  { title: 'Kandungan aktif', items: [{ title: 'Bahan utama', content: 'Diracik dari bahan herbal pilihan yang dikenal dekat dengan keseharian masyarakat Indonesia.' }] },
  { title: 'Catatan konsumsi', items: [{ title: 'Catatan penting', content: 'Ini adalah informasi umum, bukan pengganti saran tenaga kesehatan. Perhatikan aturan pakai pada kemasan.' }] },
]

export function DetailKandungan({ sections = defaultSections }: { sections?: DetailSection[] }) {
  return (
    <section id="transparansi" className="bg-background px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="detail-kandungan-title">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Transparan sejak awal</p>
        <h2 id="detail-kandungan-title" className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Ringkasan kandungan produk</h2>
        <div className="mt-8 grid gap-4">
          {sections.map((section) => (
            <details key={section.title} className="group rounded-2xl border border-border bg-card px-5 shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-semibold text-foreground marker:hidden">
                <span className="text-sm font-bold uppercase tracking-[0.14em] text-primary">{section.title}</span>
                <span className="text-xl font-normal text-primary transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <div className="border-t border-border pb-5 pt-2">
                <ul className="flex flex-wrap gap-2" aria-label={section.title}>
                  {section.items.map((item) => (
                    <li key={`${section.title}-${item.title}`} className="rounded-full bg-secondary px-3 py-1.5 text-sm text-secondary-foreground">
                      {item.title}
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
