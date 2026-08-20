type EdukasiRinganProps = {
  penjelasan: string
  namaProduk: string
  poin?: string[]
}

export function EdukasiRingan({ penjelasan, namaProduk, poin = [] }: EdukasiRinganProps) {
  return (
    <section aria-labelledby="edukasi-ringan-title" className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="rounded-2xl bg-secondary/60 p-6 shadow-sm sm:p-8 lg:p-10">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Kenali {namaProduk}</p>
          <h2 id="edukasi-ringan-title" className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Cara kerjanya sederhana, pelan-pelan dan lembut
          </h2>
          <p className="mt-4 text-pretty leading-7 text-muted-foreground">{penjelasan}</p>
        </div>

        {poin.length > 0 ? (
          <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {poin.map((item, index) => (
              <li key={`${item}-${index}`} className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
                <span className="mb-3 flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <p className="leading-6 text-card-foreground">{item}</p>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </section>
  )
}

export default EdukasiRingan
