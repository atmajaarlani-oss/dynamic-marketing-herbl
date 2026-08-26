'use client'

import { FormEvent, useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { formatRupiah } from '@/lib/harga'

type TransaksiChatProps = {
  whatsappNumber?: string
  hargaProduk?: number
  beratPerUnit?: number // in grams, default 1000g (1 kg)
}

interface CourierOption {
  courier_name: string
  service: string
  harga: number
  estimasi: string
}

interface AreaSearchResult {
  id: string
  name: string
}

export function TransaksiChat({
  whatsappNumber = '6281234567890',
  hargaProduk = 150000,
  beratPerUnit = 1000,
}: TransaksiChatProps) {
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  // Area search state
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<AreaSearchResult[]>([])
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null)
  const [selectedAreaName, setSelectedAreaName] = useState<string | null>(null)
  const [searchLoading, setSearchLoading] = useState(false)

  // Quantity
  const [quantity, setQuantity] = useState(1)

  // Courier state
  const [selectedCourier, setSelectedCourier] = useState<CourierOption | null>(null)
  const [courierList, setCourierList] = useState<CourierOption[]>([])
  const [courierLoading, setCourierLoading] = useState(false)
  const [courierError, setCourierError] = useState<string | null>(null)

  // Abort controller for cancelling fetch requests
  const searchControllerRef = useRef<AbortController | null>(null)
  const courierControllerRef = useRef<AbortController | null>(null)

  // Debounced area search
  const handleQueryChange = (value: string) => {
    setQuery(value)
    setSelectedAreaId(null)
    setSelectedAreaName(null)
    setSelectedCourier(null)
    setCourierList([])

    if (!value.trim()) {
      setResults([])
      return
    }

    // Debounce: cancel previous request
    if (searchControllerRef.current) {
      searchControllerRef.current.abort()
    }
    const controller = new AbortController()
    searchControllerRef.current = controller

    setSearchLoading(true)
    fetch(`/api/area-search?input=${encodeURIComponent(value)}&countries=ID&type=single`, {
      signal: controller.signal,
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.areas)) {
          setResults(data.areas)
        } else if (data.success && Array.isArray(data)) {
          // fallback if Biteship returns array directly
          setResults(data.map((item: AreaSearchResult) => ({
            id: item.id,
            name: item.name,
          })))
        } else {
          setResults([])
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('Area search error:', err)
          setResults([])
        }
      })
      .finally(() => setSearchLoading(false))
  }

  const selectArea = (area: AreaSearchResult) => {
    setSelectedAreaId(area.id)
    setSelectedAreaName(area.name)
    setQuery(area.name)
    setResults([])
    setSelectedCourier(null)
    setCourierList([])
  }

  const handleQuantityChange = (value: number) => {
    setQuantity(Math.max(1, value))
    setSelectedCourier(null) // reset courier when weight changes
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const subtotal = hargaProduk * quantity
  const ongkir = selectedCourier?.harga ?? 0
  const total = subtotal + ongkir

  // Fetch courier rates when area or quantity changes
  useEffect(() => {
    if (!selectedAreaId) return

    if (courierControllerRef.current) {
      courierControllerRef.current.abort()
    }
    const controller = new AbortController()
    courierControllerRef.current = controller

    const totalWeight = quantity * beratPerUnit
    setCourierLoading(true)
    setCourierError(null)

    fetch('/api/ongkir', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destination_area_id: selectedAreaId,
        total_weight: totalWeight,
      }),
      signal: controller.signal,
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setCourierList(data.data)
          if (data.data.length === 0) {
            setCourierError('Tidak ada kurir yang tersedia untuk area ini.')
          }
        } else {
          setCourierError(data.message ?? 'Gagal memuat daftar kurir.')
          setCourierList([])
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('Ongkir fetch error:', err)
          setCourierError('Gagal memuat daftar kurir.')
          setCourierList([])
        }
      })
      .finally(() => setCourierLoading(false))

    return () => controller.abort()
  }, [selectedAreaId, quantity, beratPerUnit])

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
              Alamat lengkap
              <textarea
                required
                value={address}
                onChange={e => setAddress(e.target.value)}
                rows={3}
                placeholder="Nama jalan, nomor rumah, RT/RW, dll"
                className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            {/* Kecamatan / Area search with autocomplete */}
            <div className="relative">
              <label className="block text-sm font-medium text-foreground">
                Kecamatan / Kota tujuan
                <input
                  value={query}
                  onChange={e => handleQueryChange(e.target.value)}
                  placeholder="Ketik nama kecamatan atau kota..."
                  className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </label>

              {searchLoading && (
                <p className="mt-2 text-xs text-muted-foreground">Mencari...</p>
              )}

              {results.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full rounded-xl border border-border bg-card shadow-lg">
                  {results.map(area => (
                    <li key={area.id}>
                      <button
                        type="button"
                        onClick={() => selectArea(area)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-muted"
                      >
                        {area.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {selectedAreaName && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Area terpilih: <span className="font-medium text-foreground">{selectedAreaName}</span>
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
                onChange={e => handleQuantityChange(Number(e.target.value))}
                className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            {/* Pilihan kurir (shown only after area is selected) */}
            {selectedAreaId && (
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">Pilih kurir</p>

                {courierLoading && (
                  <p className="text-sm text-muted-foreground">Memuat daftar kurir...</p>
                )}

                {courierError && (
                  <p className="text-sm text-destructive">{courierError}</p>
                )}

                {!courierLoading && !courierError && courierList.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Tidak ada kurir yang tersedia untuk area ini.
                  </p>
                )}

                {!courierLoading && courierList.length > 0 && (
                  <div className="space-y-2">
                    {courierList.map((courier, index) => (
                      <label
                        key={`${courier.courier_name}-${courier.service}-${index}`}
                        className="flex items-start gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm cursor-pointer hover:bg-muted/50"
                      >
                        <input
                          type="radio"
                          name="kurir"
                          value={`${courier.courier_name}|${courier.service}`}
                          checked={
                            selectedCourier?.courier_name === courier.courier_name &&
                            selectedCourier?.service === courier.service
                          }
                          onChange={() => setSelectedCourier(courier)}
                          className="mt-1 h-4 w-4 accent-primary"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {courier.courier_name} — {courier.service}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Estimasi: {courier.estimasi}
                          </span>
                          <span className="mt-1 font-semibold text-primary">
                            {formatRupiah(courier.harga)}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Ringkasan */}
            <div className="rounded-2xl border border-border bg-muted/40 p-5">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({quantity}x)</span>
                <span className="font-medium">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Ongkir</span>
                <span className="font-medium">{formatRupiah(ongkir)}</span>
              </div>
              {selectedCourier && (
                <p className="mt-1 text-xs text-muted-foreground">
                  via {selectedCourier.courier_name} {selectedCourier.service} ({selectedCourier.estimasi})
                </p>
              )}
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
            <span className="underline">Pesan via WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  )
}
