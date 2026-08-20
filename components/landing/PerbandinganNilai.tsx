import { Check, Minus } from "lucide-react"

const rows = [
  {
    need: "Pembuktian",
    detail: "Reaksi cepat & terukur",
    chemical: "Fokus menekan gejala",
    herbal: "",
  },
  {
    need: "Keamanan",
    detail: "Ramah ginjal & organ tubuh",
    chemical: "",
    herbal: "Aman konsumsi jangka panjang",
  },
  {
    need: "Penyembuhan",
    detail: "Fokus ke akar masalah",
    chemical: "",
    herbal: "Memperbaiki sistem tubuh",
  },
  {
    need: "Ketenangan hati",
    detail: "Bebas rasa was-was",
    chemical: "",
    herbal: "Terasa alami dan selaras dengan tubuh",
  },
]

function Status({ positive }: { positive: boolean }) {
  return positive ? (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary" aria-label="Ya">
      <Check className="h-4 w-4" strokeWidth={2.5} />
    </span>
  ) : (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground" aria-label="Tidak menjadi fokus">
      <Minus className="h-4 w-4" strokeWidth={2.5} />
    </span>
  )
}

export function PerbandinganNilai() {
  return (
    <section className="bg-background px-4 py-14 sm:px-6 lg:py-20" aria-labelledby="perbandingan-nilai-title">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Memilih dengan tenang</p>
          <h2 id="perbandingan-nilai-title" className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Mana yang paling sesuai untuk tubuhmu?
          </h2>
          <p className="mt-4 text-pretty leading-7 text-muted-foreground">
            Setiap pendekatan punya cara kerja yang berbeda. Tabel ini membantu melihat nilainya dengan lebih jernih.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="grid grid-cols-[1.35fr_1fr_1fr] border-b border-border bg-muted/50 px-4 py-4 text-sm font-semibold sm:px-6">
            <div className="text-muted-foreground">Kebutuhan pembeli</div>
            <div className="text-center text-foreground">Pendekatan kimia</div>
            <div className="text-center text-primary">Pendekatan herbal</div>
          </div>

          <div className="divide-y divide-border">
            {rows.map((row) => (
              <div key={row.need} className="grid grid-cols-[1.35fr_1fr_1fr] items-center gap-2 px-4 py-5 sm:px-6">
                <div>
                  <p className="font-semibold capitalize text-foreground">{row.need}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">{row.detail}</p>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <Status positive={Boolean(row.chemical)} />
                  {row.chemical && <span className="text-xs leading-5 text-muted-foreground">{row.chemical}</span>}
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <Status positive={Boolean(row.herbal)} />
                  {row.herbal && <span className="text-xs leading-5 text-muted-foreground">{row.herbal}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PerbandinganNilai
