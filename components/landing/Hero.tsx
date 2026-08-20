'use client'

import Image from 'next/image'
import { ArrowRight, MessageCircle } from 'lucide-react'
import BadgeBpom from './BadgeBpom'

type HeroProps = {
  painHeadline: string
  hopeStatement: string
  namaProduk: string
  gambar: string
  hargaUtama?: number
  hargaDiskon?: number
  hargaPerHari?: number | null
  persenHemat?: number
  nomorBpom?: string | null
  halalTersertifikasi?: boolean
  onBuyClick?: () => void
  onChatClick?: () => void
}

export function Hero({
  painHeadline,
  hopeStatement,
  namaProduk,
  gambar,
  hargaUtama,
  hargaDiskon,
  hargaPerHari,
  persenHemat,
  nomorBpom,
  halalTersertifikasi,
  onBuyClick,
  onChatClick,
}: HeroProps) {
  return (
    <section className="w-full px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-14" aria-labelledby="hero-heading">
      <div className="mx-auto grid max-w-6xl items-center gap-8 overflow-hidden rounded-2xl bg-[#f3eee4] p-6 shadow-[0_16px_40px_rgba(63,73,48,0.12)] sm:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:p-14">
        <div className="order-2 flex flex-col items-start lg:order-1">
          <span className="mb-4 inline-flex rounded-full bg-[#dce6d0] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#35513a]">
            Herbal + {namaProduk}
          </span>
          <h1 id="hero-heading" className="max-w-2xl text-pretty text-4xl font-bold leading-[1.08] tracking-tight text-[#26352a] sm:text-5xl lg:text-6xl">
            {painHeadline}
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-[#526052] sm:text-lg">
            {hopeStatement}
          </p>
          <BadgeBpom nomorBpom={nomorBpom} halalTersertifikasi={halalTersertifikasi} />
          {hargaDiskon !== undefined && (
            <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-2xl font-bold text-[#35513a]">
                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(hargaDiskon)}
              </span>
              {hargaUtama !== undefined && hargaUtama > hargaDiskon && (
                <span className="text-sm text-[#526052] line-through">
                  {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(hargaUtama)}
                </span>
              )}
              {!!persenHemat && persenHemat > 0 && (
                <span className="rounded-full bg-[#dce6d0] px-2.5 py-1 text-xs font-semibold text-[#35513a]">
                  Hemat {persenHemat}%
                </span>
              )}
              {hargaPerHari !== null && hargaPerHari !== undefined && (
                <span className="w-full text-xs text-[#526052]">Sekitar {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(hargaPerHari)} per hari</span>
              )}
            </div>
          )}
          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={onBuyClick}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#35513a] px-6 py-3 text-sm font-semibold text-[#fffaf1] shadow-[0_8px_18px_rgba(53,81,58,0.2)] transition hover:bg-[#263f2c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#35513a] focus-visible:ring-offset-2"
            >
              Beli Sekarang
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onChatClick}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#78936f] bg-transparent px-6 py-3 text-sm font-semibold text-[#35513a] transition hover:bg-[#e5eddc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#78936f] focus-visible:ring-offset-2"
            >
              <MessageCircle className="size-5" aria-hidden="true" />
              Chat Saya
            </button>
          </div>
        </div>

        <div className="order-1 flex min-h-72 items-center justify-center rounded-2xl bg-[#e5eddc] p-5 sm:min-h-96 sm:p-8 lg:order-2">
          <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-2xl bg-[#fffaf1] shadow-[0_12px_28px_rgba(63,73,48,0.14)]">
            <Image src={gambar} alt="Produk herbal" fill className="object-contain p-4" sizes="(max-width: 1024px) 80vw, 36vw" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
