type RiskReversalProps = { policy?: string }

export function RiskReversal({ policy = 'Jika ada kendala dengan pesanan, hubungi kami melalui WhatsApp. Kami akan membantu mengecek dan mencari solusi sesuai kondisi pesanan.' }: RiskReversalProps) {
  return (
    <section className="bg-muted/40 px-4 py-14 sm:px-6 lg:px-8" aria-labelledby="risk-reversal-title">
      <div className="mx-auto flex max-w-3xl flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-start sm:p-8"><div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl text-primary" aria-hidden="true">✓</div><div><h2 id="risk-reversal-title" className="text-xl font-semibold text-foreground">Ada yang perlu dibantu?</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{policy}</p><p className="mt-3 text-xs leading-5 text-muted-foreground">Kami tidak menjanjikan hasil instan. Dengarkan tubuh, ikuti aturan pakai, dan konsultasikan dengan tenaga kesehatan bila diperlukan.</p></div></div>
    </section>
  )
}
