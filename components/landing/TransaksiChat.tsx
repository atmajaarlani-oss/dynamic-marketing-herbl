'use client'

import { FormEvent, useState } from 'react'
import { Button } from '@/components/ui/button'
import { formatRupiah } from '@/lib/harga'

type TransaksiChatProps = {
  whatsappNumber?: string
  hargaProduk?: number
}

const KECAMATAN = [
  'Cilandak',
  'Tanah Abang',
  'Lebak Bulus',
  'Gambir',
  'Jakarta Selatan',
  'Jakarta Pusat',
  'Cilandak Barat',
  'Bendungan Hilir',
]

export function TransaksiChat({
  whatsappNumber = '6281234567890',
  hargaProduk = 150000,
}: TransaksiChatProps) {
  const [submitted, setSubmitted] = useState(false)
  const [nama, setNama] = useState('')
  const [hp, setHp] = useState('')
  const [alamat, setAlamat] = useState('')
  const [query, setQuery] = useState('')
  const [hasil, setHasil] = useState<string[]>([])
  const [areaTerpilih, setAreaTerpilih] = useState<string | null>(null)
  const [jumlah, setJumlah] = useState(1)
  const [kurirTerpilih, setKurirTerpilih] = useState<string | null>(null)
  const [kurirList] = useState<string[]>([]) // kosong dulu, nanti dari API

  const handleQueryChange = (value: string) => {
    setQuery(value)
    if (value.trim().length === 0) {
      setHasil([])
      return
    }
    const filtered = KECAMATAN.filter((k) =>
      k.toLowerCase().includes(value.toLowerCase())
    )
    setHasil(filtered)
  }

  const selectArea = (item: string) => {
    setAreaTerpilih(item)
    setQuery(item)
    setHasil([])
  }

  const subtotal = hargaProduk * jumlah
  const ongkir = 0 // 0 dulu sebelum kurir dipilih
  const total = subtotal + ongkir

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <section
      className="bg-background px-4 py-16 sm:px-6 lg:px-8"
      aria-labelledby="transaksi-title"
    >
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
        {/* Left: Transaction form */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Mulai pesan
          </p>
          <h2
            id="transaksi-title"
            className="text-3xl font-semibold tracking-tight text-foreground"
          >
            Beli dengan tenang
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Form ini masih simulasi. Pembayaran akan tersedia pada fase
            berikutnya.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-foreground">
                Nama
                <input
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <label className="block text-sm font-medium text-foreground">
                Nomor WhatsApp
                <input
                  required
                  value={hp}
                  onChange={(e) => setHp(e.target.value)}
                  type="tel"
                  className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
            </div>

            <label className="block text-sm font-medium text-foreground">
              Alamat detail
              <textarea
                required
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                rows={3}
                className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            <div className="relative">
              <label className="block text-sm font-medium text-foreground">
                Pencarian kecamatan
                <input
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  placeholder="Contoh: Cilandak"
                  className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              {hasil.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full rounded-xl border border-border bg-card shadow-lg">
                  {hasil.map((item) => (
                    <li key={item}>
                      <button
                        type="button"
                        onClick={() => selectArea(item)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-muted"
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {areaTerpilih && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Area terpilih:{' '}
                  <span className="font-medium text-foreground">
                    {areaTerpilih}
                  </span>
                </p>
              )}
            </div>

            <label className="block text-sm font-medium text-foreground">
              Jumlah beli
              <input
                type="number"
                min={1}
                value={jumlah}
                onChange={(e) =>
                  setJumlah(Math.max(1, Number(e.target.value)))
                }
                className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            {areaTerpilih && (
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">
                  Pilihan kurir
                </p>
                <div className="space-y-2">
                  {kurirList.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Daftar kurir akan muncul setelah area dipilih (dari API).
                    </p>
                  ) : (
                    kurirList.map((k) => (
                      <label
                        key={k}
                        className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm"
                      >
                        <input
                          type="radio"
                          name="kurir"
                          value={k}
                          checked={kurirTerpilih === k}
                          onChange={() => setKurirTerpilih(k)}
                          className="h-4 w-4 accent-primary"
                        />
                        <span>{k}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-border bg-muted/40 p-5">
              <div className="flex justify-between text-sm">
                <span>Subtotal produk</span>
                <span className="font-medium">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Ongkir</span>
                <span className="font-medium">{formatRupiah(ongkir)}</span>
              </div>
              <div className="mt-3 flex justify-between border-t border-border pt-3 text-base font-semibold">
                <span>Total</span>
                <span>{formatRupiah(total)}</span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
            >
              {submitted ? 'Pesanan dicatat' : 'Kirim pesanan'}
            </Button>
          </form>
        </div>

        {/* Right: WhatsApp (unchanged) */}
        <div className="flex flex-col justify-between rounded-2xl bg-muted/50 p-6 sm:p-8">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Butuh bantuan?
            </p>
            <h3 className="text-2xl font-semibold text-foreground">
              Cerita langsung dengan kami
            </h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Tanyakan cara pakai, pilihan produk, atau hal lain sebelum
              memesan.
            </p>
          </div>
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center justify-center rounded-xl border-2 border-primary px-5 py-3 font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
          >
            Chat Saya via WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
