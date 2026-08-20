type CaraPakaiProps = { steps?: string[] }

const defaultSteps = ['Kocok atau siapkan produk sesuai petunjuk pada kemasan.', 'Konsumsi sesuai takaran yang dianjurkan.', 'Jadikan bagian dari rutinitas baik dan tetap jaga pola hidup seimbang.']

export function CaraPakai({ steps = defaultSteps }: CaraPakaiProps) {
  return (
    <section className="bg-muted/40 px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="cara-pakai-title">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Rutinitas sederhana</p>
        <h2 id="cara-pakai-title" className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Cara pakai</h2>
        <ol className="mt-8 space-y-4">
          {steps.map((step, index) => <li key={step} className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{index + 1}</span><span className="pt-1 text-sm leading-6 text-muted-foreground">{step}</span></li>)}
        </ol>
        <p className="mt-10 text-center text-sm font-bold tracking-[0.12em] text-primary">BERDOA&apos;LAH SEBELUM MINUM</p>
      </div>
    </section>
  )
}
