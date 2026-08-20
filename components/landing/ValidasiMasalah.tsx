import { Check } from "lucide-react"

type ValidasiMasalahProps = {
  poinKeluhan: string[]
}

export function ValidasiMasalah({ poinKeluhan }: ValidasiMasalahProps) {
  return (
    <section aria-labelledby="validasi-masalah-title" className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Cerita yang familiar</p>
        <h2 id="validasi-masalah-title" className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          banyak yang merasakan 🤍
        </h2>
        <p className="mt-4 text-pretty leading-7 text-muted-foreground">
          Wajar kalau kamu pernah merasakan hal-hal ini. Banyak orang memulainya dari keluhan yang sama.
        </p>
      </div>

      <ul className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-3 md:grid-cols-2" aria-label="Poin keluhan">
        {poinKeluhan.map((poin, index) => (
          <li key={`${poin}-${index}`} className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary" aria-hidden="true">
              <Check className="size-4" strokeWidth={2.5} />
            </span>
            <span className="leading-6 text-card-foreground">{poin}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ValidasiMasalah
