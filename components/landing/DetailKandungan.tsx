type DetailItem = { title: string; content: string }
type DetailSection = { title: string; items: DetailItem[] }

const defaultSections: DetailSection[] = [
  { title: 'Kandungan aktif', items: [{ title: 'Bahan utama', content: 'Diracik dari bahan herbal pilihan yang dikenal dekat dengan keseharian masyarakat Indonesia.' }] },
  { title: 'Catatan konsumsi', items: [{ title: 'Catatan penting', content: 'Ini adalah informasi umum, bukan pengganti saran tenaga kesehatan. Perhatikan aturan pakai pada kemasan.' }] },
]

export function DetailKandungan({ sections = defaultSections }: { sections?: DetailSection[] }) {
  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="detail-kandungan-title">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Transparan sejak awal</p>
        <h2 id="detail-kandungan-title" className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Untuk mengetahui lebih detail</h2>
        <div className="mt-8 grid gap-4">
          {sections.map((section) => (
            <div key={section.title} className="rounded-2xl border border-border bg-card px-5 shadow-sm">
              <h3 className="border-b border-border py-4 text-sm font-bold uppercase tracking-[0.14em] text-primary">{section.title}</h3>
              <div className="divide-y divide-border">
                {section.items.map((item) => (
                  <details key={`${section.title}-${item.title}`} className="group py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-foreground marker:hidden">{item.title}<span className="text-xl font-normal text-primary transition-transform group-open:rotate-45" aria-hidden="true">+</span></summary>
                    {item.content && <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{item.content}</p>}
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
