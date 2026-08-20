"use client"

import type { ReactNode } from "react"

type Testimonial = {
  quote: string
  name: string
  location: string
  role?: string
}

type SocialProofProps = {
  testimonials?: Testimonial[]
  wilayah?: string[]
  children?: ReactNode
}

const defaultWilayah = [
  "Jakarta",
  "Bandung",
  "Bogor",
  "Bekasi",
  "Cirebon",
  "Depok",
  "Makassar",
  "Banjarmasin",
  "Medan",
  "Surabaya",
  "Sidoarjo",
  "Samarinda",
  "Padang",
  "Pekanbaru",
  "Maluku",
  "Bali",
]

const defaultTestimonials: Testimonial[] = [
  {
    quote: "Sekarang lebih tenang karena bisa mendapatkan produk Insani dari distributor terdekat.",
    name: "Pelanggan Insani",
    location: "Jakarta",
    role: "Pelanggan",
  },
  {
    quote: "Pelayanannya ramah dan produknya mudah dipesan. Tidak perlu bingung mencari lagi.",
    name: "Mitra Insani",
    location: "Makassar",
    role: "Distributor",
  },
  {
    quote: "Senang bisa ikut membantu menyediakan pilihan herbal untuk keluarga di sekitar sini.",
    name: "Mitra Insani",
    location: "Banjarmasin",
    role: "Distributor",
  },
]

function DistributorMark({ wilayah }: { wilayah: string }) {
  return (
    <div className="flex shrink-0 items-center gap-3 rounded-full border border-border/70 bg-card px-5 py-3 shadow-sm">
      <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
        {wilayah.slice(0, 2).toUpperCase()}
      </span>
      <span className="text-sm font-semibold text-foreground">Mitra {wilayah}</span>
    </div>
  )
}

export function SocialProof({
  testimonials = defaultTestimonials,
  wilayah = defaultWilayah,
  children,
}: SocialProofProps) {
  const tickerItems = [...wilayah, ...wilayah]

  return (
    <section className="overflow-hidden bg-secondary/35 py-16 sm:py-20" aria-labelledby="social-proof-title">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Dipercaya di berbagai wilayah</p>
          <h2 id="social-proof-title" className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Tumbuh bersama banyak keluarga dan mitra
          </h2>
          <p className="mt-4 text-pretty leading-7 text-muted-foreground">
            Dari kota besar sampai daerah, Insani hadir melalui jaringan mitra yang membantu produk sampai lebih dekat.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure key={`${testimonial.name}-${testimonial.location}`} className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
              <blockquote className="text-pretty leading-7 text-foreground">“{testimonial.quote}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {testimonial.location.slice(0, 2).toUpperCase()}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-foreground">{testimonial.name}</span>
                  <span className="block text-sm text-muted-foreground">
                    {testimonial.role ? `${testimonial.role} · ` : ""}{testimonial.location}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        {children}

        <div className="relative -mx-4 overflow-hidden sm:-mx-6 lg:-mx-8" aria-label="Wilayah mitra distributor">
          <div className="flex w-max gap-4 py-2 motion-safe:animate-[marquee_35s_linear_infinite] hover:[animation-play-state:paused]">
            {tickerItems.map((item, index) => (
              <DistributorMark key={`${item}-${index}`} wilayah={item} />
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </section>
  )
}

export type { SocialProofProps, Testimonial }
