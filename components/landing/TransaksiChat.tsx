'use client'

import { FormEvent, useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { formatRupiah } from '@/lib/harga'
import { ChevronRight, ChevronLeft, Truck, CreditCard, User, MapPin, CheckCircle } from 'lucide-react'

type TransaksiChatProps = {
  whatsappNumber?: string
  hargaProduk?: number
  beratPerUnit?: number
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

type Step = 1 | 2 | 3

export function TransaksiChat({
  whatsappNumber = '6281234567890',
  hargaProduk = 150000,
  beratPerUnit = 1000,
}: TransaksiChatProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [quantity, setQuantity] = useState(1)

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<AreaSearchResult[]>([])
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null)
  const [selectedAreaName, setSelectedAreaName] = useState<string | null>(null)
  const [searchLoading, setSearchLoading] = useState(false)

  const [selectedCourier, setSelectedCourier] = useState<CourierOption | null>(null)
  const [courierList, setCourierList] = useState<CourierOption[]>([])
  const [courierLoading, setCourierLoading] = useState(false)
  const [courierError, setCourierError] = useState<string | null>(null)

  const searchControllerRef = useRef<AbortController | null>(null)
  const courierControllerRef = useRef<AbortController | null>(null)

  const subtotal = hargaProduk * quantity
  const ongkir = selectedCourier?.harga ?? 0
  const total = subtotal + ongkir

  const isStep1Valid = name.trim() && phone.trim() && address.trim() && selectedAreaId !== null && quantity > 0
  const isStep2Valid = selectedCourier !== null

  useEffect(() => {
    if (!query.trim() || query.trim().length < 3) {
      setResults([])
      setSearchLoading(false)
      return
    }

    if (searchControllerRef.current) {
      searchControllerRef.current.abort()
      searchControllerRef.current = null
    }

    setSearchLoading(true)
    const timer = setTimeout(() => {
      const controller = new AbortController()
      searchControllerRef.current = controller

      fetch(`/api/area-search?input=${encodeURIComponent(query.trim())}&countries=ID&type=single`, {
        signal: controller.signal,
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.areas)) {
            setResults(
              data.areas.map((item: { id?: string; name?: string }) => ({
                id: String(item.id ?? ''),
                name: String(item.name ?? ''),
              }))
            )
          } else if (Array.isArray(data)) {
            setResults(
              data.map((item: { id?: string; name?: string }) => ({
                id: String(item.id ?? ''),
                name: String(item.name ?? ''),
              }))
            )
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
    }, 500)

    return () => {
      clearTimeout(timer)
      if (searchControllerRef.current) {
        searchControllerRef.current.abort()
        searchControllerRef.current = null
      }
    }
  }, [query])

  useEffect(() => {
    if (currentStep !== 2) return
    if (!selectedAreaId) return

    if (courierControllerRef.current) {
      courierControllerRef.current.abort()
      courierControllerRef.current = null
    }

    const controller = new AbortController()
    courierControllerRef.current = controller

    const totalWeight = quantity * beratPerUnit
    setCourierLoading(true)
    setCourierError(null)
    setCourierList([])
    setSelectedCourier(null)

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
          const filtered = data.data.filter(
            (c: CourierOption) =>
              c.courier_name.toLowerCase().includes('jne') ||
              c.courier_name.toLowerCase().includes('j&t') ||
              c.courier_name.toLowerCase().includes('jnt')
          )
          setCourierList(filtered)
          if (filtered.length === 0) {
            setCourierError('Tidak ada kurir JNE/J&T yang tersedia untuk area ini.')
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

    return () => {
      controller.abort()
      courierControllerRef.current = null
    }
  }, [currentStep, selectedAreaId, quantity, beratPerUnit])

  const handleSelectArea = (area: AreaSearchResult) => {
    setSelectedAreaId(area.id)
    setSelectedAreaName(area.name)
    setQuery(area.name)
    setResults([])
  }

  const handleQuantityChange = (value: number) => {
    setQuantity(Math.max(1, value))
  }

  const goToStep = (step: Step) => {
    setCurrentStep(step)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNext = () => {
    if (currentStep === 1 && isStep1Valid) goToStep(2)
    if (currentStep === 2 && isStep2Valid) goToStep(3)
  }

  const handleBack = () => {
    if (currentStep === 2) goToStep(1)
    if (currentStep === 3) goToStep(2)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    alert(`Pesanan dikirim!\nTotal: ${formatRupiah(total)}\nKurir: ${selectedCourier?.courier_name} ${selectedCourier?.service}`)
  }

  const steps: { step: Step; label: string; icon: React.ReactNode }[] = [
    { step: 1, label: 'Data & Alamat', icon: <User className="h-4 w-4" /> },
    { step: 2, label: 'Kurir', icon: <Truck className="h-4 w-4" /> },
    { step: 3, label: 'Bayar', icon: <CreditCard className="h-4 w-4" /> },
  ]

  const getCourierRadioClass = (courier: CourierOption, selected: CourierOption | null) => {
    const isSelected = selected?.courier_name === courier.courier_name && selected?.service === courier.service
    return `flex items-center gap-3 rounded-xl border-2 p-3 text-sm cursor-pointer transition ${isSelected ? 'border-primary bg-primary/5' : 'border-border bg-background hover:bg-muted/50'}`
  }

  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="transaksi-title">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-center">
          <ol className="flex items-center" role="list" aria-label="Langkah pemesanan">
            {steps.map(({ step, label, icon }, index) => (
              <li key={step} className="flex items-center">
                <div
                  className={step < currentStep
                    ? 'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold bg-primary text-primary-foreground'
                    : step === currentStep
                    ? 'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold bg-primary/20 text-primary border-2 border-primary'
                    : 'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold bg-muted text-muted-foreground'
                  }
                >
                  {step < currentStep ? <CheckCircle className="h-5 w-5" /> : icon}
                </div>
                <span className={`ml-2 hidden text-sm font-medium sm:block ${step === currentStep ? 'text-primary' : 'text-muted-foreground'}`}>
                  {label}
                </span>
                {index < steps.length - 1 && (
                  <div className={step < currentStep ? 'hidden h-0.5 w-16 mx-2 sm:block bg-primary' : 'hidden h-0.5 w-16 mx-2 sm:block bg-muted'}/>
                )}
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <header className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Langkah {currentStep} dari 3
            </p>
            <h2 id="transaksi-title" className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              {currentStep === 1 && 'Data Penerima & Alamat'}
              {currentStep === 2 && 'Pilih Kurir'}
              {currentStep === 3 && 'Ringkasan & Bayar'}
            </h2>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            {currentStep === 1 && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-foreground">
                    Nama Lengkap
                    <input
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Nama penerima"
                    />
                  </label>
                  <label className="block text-sm font-medium text-foreground">
                    No HP
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                      placeholder="08xxxxxxxxxx"
                    />
                  </label>
                </div>

                <label className="block text-sm font-medium text-foreground">
                  Alamat Lengkap
                  <textarea
                    required
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    rows={3}
                    placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, dll"
                    className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>

                <div className="relative">
                  <label className="block text-sm font-medium text-foreground">
                    Cari Kecamatan / Kota Tujuan
                    <input
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      placeholder="Ketik minimal 3 huruf (contoh: Cilandak, Bandung)..."
                      className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </label>
                  {searchLoading && (
                    <p className="mt-2 text-xs text-muted-foreground">Mencari area...</p>
                  )}
                  {results.length > 0 && (
                    <ul className="absolute z-10 mt-1 w-full rounded-xl border border-border bg-card shadow-lg max-h-60 overflow-auto">
                      {results.map(area => (
                        <li key={area.id}>
                          <button
                            type="button"
                            onClick={() => handleSelectArea(area)}
                            className="w-full px-4 py-3 text-left text-sm hover:bg-muted"
                          >
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{area.name}</span>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {selectedAreaName && (
                    <div className="mt-3 rounded-xl border border-primary/30 bg-primary/5 p-3">
                      <p className="text-sm text-primary">
                        <span className="font-medium">Area terpilih:</span> {selectedAreaName}
                      </p>
                    </div>
                  )}
                </div>

                <label className="block text-sm font-medium text-foreground">
                  Jumlah Beli
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={e => handleQuantityChange(Number(e.target.value))}
                    className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>

                <div className="mt-6 flex justify-end">
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={!isStep1Valid}
                    className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
                  >
                    Lanjut <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="rounded-2xl border border-border bg-muted/40 p-5">
                  <p className="text-sm font-medium text-foreground">
                    <MapPin className="mr-2 inline h-4 w-4" />
                    Area tujuan: <span className="font-semibold">{selectedAreaName}</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Jumlah: {quantity} pcs × {beratPerUnit}g = {quantity * beratPerUnit}g
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  <p className="text-sm font-medium text-foreground">Pilih Kurir</p>
                  {courierLoading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      Memuat pilihan kurir...
                    </div>
                  )}
                  {courierError && (
                    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                      <p className="text-sm text-destructive font-medium">{courierError}</p>
                    </div>
                  )}
                  {!courierLoading && !courierError && courierList.length === 0 && (
                    <div className="rounded-xl border border-border bg-background p-4">
                      <p className="text-sm text-muted-foreground">
                        Maaf, saat ini tidak ada layanan JNE/J&T yang tersedia untuk area {selectedAreaName}. Silakan pilih area lain atau hubungi kami via WhatsApp.
                      </p>
                    </div>
                  )}
                  {!courierLoading && courierList.length > 0 && (
                    <div className="space-y-2" role="radiogroup" aria-label="Pilihan kurir">
                      {courierList.map((courier, index) => (
                        <label
                          key={`${courier.courier_name}-${courier.service}-${index}`}
                          className={getCourierRadioClass(courier, selectedCourier)}
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
                            className="h-4 w-4 accent-primary"
                          />
                          <div className="flex-1 flex flex-col">
                            <span className="font-medium text-foreground">
                              {courier.courier_name.toUpperCase()} — {courier.service}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Estimasi: {courier.estimasi}
                            </span>
                          </div>
                          <span className="font-semibold text-primary whitespace-nowrap">
                            {formatRupiah(courier.harga)}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="rounded-xl px-6 py-3 font-semibold"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Kembali
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={!isStep2Valid}
                    className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
                  >
                    Lanjut <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div className="space-y-4 rounded-2xl border border-border bg-muted/40 p-5">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({quantity}x {formatRupiah(hargaProduk)})</span>
                    <span className="font-medium">{formatRupiah(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Ongkir</span>
                    <span className="font-medium">{formatRupiah(ongkir)}</span>
                  </div>
                  {selectedCourier && (
                    <p className="text-xs text-muted-foreground">
                      via {selectedCourier.courier_name.toUpperCase()} {selectedCourier.service} ({selectedCourier.estimasi})
                    </p>
                  )}
                  <div className="flex justify-between border-t border-border pt-3 text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-primary">{formatRupiah(total)}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <User className="h-4 w-4" /> {name} — {phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> {address}
                    {selectedAreaName && <span className="ml-2">({selectedAreaName})</span>}
                  </p>
                  <p className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    {selectedCourier?.courier_name.toUpperCase()} {selectedCourier?.service} — {selectedCourier?.estimasi}
                  </p>
                </div>

                <div className="mt-6 flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="rounded-xl px-6 py-3 font-semibold"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Kembali
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
                  >
                    Bayar Sekarang
                  </Button>
                </div>
              </>
            )}
          </form>
        </div>

        <div className="mt-6 rounded-2xl bg-muted/50 p-6 text-center sm:p-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Butuh bantuan?
          </p>
          <h3 className="text-xl font-semibold text-foreground">
            Cerita langsung dengan kami
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Tanyakan cara pakai, pilihan produk, atau hal lain sebelum memesan.
          </p>
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center justify-center rounded-xl border-2 border-primary px-5 py-3 font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
          >
            <span className="underline">Pesan via WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  )
}
