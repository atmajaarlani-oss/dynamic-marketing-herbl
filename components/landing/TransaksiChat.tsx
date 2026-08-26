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
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<string[]>([])
  const [selectedArea, setSelectedArea] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedCourier, setSelectedCourier] = useState<string | null>(null)
  const [courierList, setCourierList] = useState<string[]>([])

  const handleQueryChange = (value: string) => {
    setQuery(value)
    if (!value.trim()) {
      setResults([])
      return
    }
    const filtered = KECAMATAN.filter(k =>
      k.toLowerCase().includes(value.toLowerCase())
    )
    setResults(filtered)
  }

  const selectArea = (item: string) => {
    setSelectedArea(item)
    setQuery(item)
    setResults([])
  }

  const subtotal = hargaProduk * quantity
  const ongkir = 0 // placeholder – will be updated after courier selection
  const total = subtotal + ongkir

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section
      className="bg-background px-4 py-16 sm:px-6 lg:px-8"
      aria-labelledby="transaksi-title"
    >
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
        {/* ---------- Left: Transaction Form ---------- */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Mulai pesan
          </p>
          <h2 id="transaksi-title" className="text-3xl font-semibold tracking-tight text-foreground">
            Beli dengan tenang
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Form ini masih simulasi. Pembayaran akan tersedia pada fase berikutnya.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Nama & No HP */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-foreground">
                Nama
                <input
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </label>

              <label className="block text-sm font-medium text-foreground">
                No HP
                <input
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  type="tel"
                  className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
            </div>

            {/* Alamat detail */}
            <label className="block text-sm font-medium text-foreground">
              Alamat detail
              <textarea
                required
                value={address}
                onChange={e => setAddress(e.target.value)}
                rows={3}
                className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            {/* Kecamatan search with autocomplete */}
            <div className="relative">
              <label className="block text-sm font-medium text-foreground">
                Pencarian kecamatan
                <input
                  value={query}
                  onChange={e => handleQueryChange(e.target.value)}
                  placeholder="Contoh: Cilandak"
                  className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </label>

              {results.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full rounded-xl border border-border bg-card shadow-lg">
                  {results.map(item => (
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

              {selectedArea && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Area terpilih: <span className="font-medium text-foreground">{selectedArea}</span>
                </p>
              )}
            </div>

            {/* Jumlah beli */}
            <label className="block text-sm font-medium text-foreground">
              Jumlah beli
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
                className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            {/* Pilihan kurir (shown only after area is selected) */}
            {selectedArea && (
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">Pilihan kurir</p>
                <div className="space-y-2">
                  {courierList.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Daftar kurir akan muncul setelah area dipilih (dari API).
                    </p>
                  ) : (
                    courierList.map(kurir => (
                      <label key={kurir} className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm">
                        <input
                          type="radio"
                          name="kurir"
                          value={kurir}
                          checked={selectedCourier === kurir}
                          onChange={() => setSelectedCourier(kurir)}
                          className="h-4 w-4 accent-primary"
                        />
                        <span>{kurir}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Ringkasan */}
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

        {/* ---------- Right: WhatsApp Button (unchanged) ---------- */}
        <div className="flex flex-col justify-between rounded-2xl bg-muted/50 p-6 sm:p-8">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Butuh bantuan?
            </p>
            <h3 className="text-2xl font-semibold text-foreground">
              Cerita langsung dengan kami
            </h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Tanyakan cara pakai, pilihan produk, atau hal lain sebelum memesan.
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
