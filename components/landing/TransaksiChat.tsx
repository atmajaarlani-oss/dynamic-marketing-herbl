'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { formatRupiah } from '@/lib/harga'
import { ChevronRight, ChevronLeft, Truck, CreditCard, User, MapPin, CheckCircle } from 'lucide-react'

type TransaksiChatProps = {
  whatsappNumber?: string
  hargaProduk: number
  productId: string
  stok: number
}

type Wilayah = {
  desa_id: string
  label: string
  kode_pos: string
  desa: string
  kecamatan: string
  kabkota: string
  provinsi: string
}

type Kurir = {
  courier_code: string
  courier_name: string
  service_code: string
  service: string
  harga: number
  estimasi: string
  quote: string
}

type SnapCallbacks = {
  onSuccess: (r: unknown) => void
  onPending: (r: unknown) => void
  onError: (r: unknown) => void
  onClose: () => void
}
type SnapWindow = Window & { snap?: { pay: (token: string, cb: SnapCallbacks) => void } }

type Step = 1 | 2 | 3
const MAKS_BELI = 20

export function TransaksiChat({ whatsappNumber = '6281234567890', hargaProduk, productId, stok }: TransaksiChatProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [pesan, setPesan] = useState<{ tipe: 'error' | 'info'; teks: string } | null>(null)
  const formCardRef = useRef<HTMLDivElement>(null)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [quantity, setQuantity] = useState(1)

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Wilayah[]>([])
  const [selected, setSelected] = useState<Wilayah | null>(null)
  const [searchLoading, setSearchLoading] = useState(false)

  const [courierList, setCourierList] = useState<Kurir[]>([])
  const [selectedCourier, setSelectedCourier] = useState<Kurir | null>(null)
  const [courierLoading, setCourierLoading] = useState(false)
  const [courierError, setCourierError] = useState<string | null>(null)

  const maxQty = Math.max(1, Math.min(stok, MAKS_BELI))
  const subtotal = hargaProduk * quantity
  const ongkir = selectedCourier?.harga ?? 0
  const total = subtotal + ongkir

  const isStep1Valid =
    name.trim().length >= 2 && phone.trim().length >= 9 && address.trim().length >= 10 && selected !== null && quantity >= 1
  const isStep2Valid = selectedCourier !== null

  // Snap.js dimuat sekali. URL dari env agar pindah sandbox -> produksi tanpa ubah kode.
  useEffect(() => {
    if (document.getElementById('midtrans-snap-script')) return
    const script = document.createElement('script')
    script.id = 'midtrans-snap-script'
    script.src = process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL ?? 'https://app.sandbox.midtrans.com/snap/snap.js'
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? '')
    script.async = true
    document.head.appendChild(script)
  }, [])

  // Cari wilayah: ke database sendiri (tidak ada hit Biteship)
  useEffect(() => {
    const term = query.trim()
    if (selected || term.length < 3) {
      setResults([])
      setSearchLoading(false)
      return
    }
    const controller = new AbortController()
    setSearchLoading(true)
    const timer = setTimeout(() => {
      fetch(`/api/wilayah/cari?q=${encodeURIComponent(term)}`, { signal: controller.signal })
        .then((res) => res.json())
        .then((d: { success: boolean; data?: Wilayah[] }) => setResults(d.success && d.data ? d.data : []))
        .catch((e: Error) => { if (e.name !== 'AbortError') setResults([]) })
        .finally(() => { if (!controller.signal.aborted) setSearchLoading(false) })
    }, 300)
    return () => { clearTimeout(timer); controller.abort() }
  }, [query, selected])

  // Satu-satunya hit Biteship: saat masuk langkah 2 (kurir)
  useEffect(() => {
    if (currentStep !== 2 || !selected) return
    const controller = new AbortController()
    setCourierLoading(true)
    setCourierError(null)
    setCourierList([])
    setSelectedCourier(null)

    fetch('/api/ongkir', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ produk_id: productId, jumlah: quantity, village_id: selected.desa_id }),
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((d: { success: boolean; data?: Kurir[]; message?: string }) => {
        if (d.success && d.data) {
          setCourierList(d.data)
          if (d.data.length === 0) setCourierError('Tidak ada layanan JNE/J&T untuk area ini.')
        } else {
          setCourierError(d.message ?? 'Gagal memuat daftar kurir.')
        }
      })
      .catch((e: Error) => { if (e.name !== 'AbortError') setCourierError('Gagal memuat daftar kurir.') })
      .finally(() => { if (!controller.signal.aborted) setCourierLoading(false) })

    return () => controller.abort()
  }, [currentStep, selected, quantity, productId])

  const goToStep = (step: Step) => {
    setPesan(null)
    setCurrentStep(step)
    formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const handleNext = () => {
    if (currentStep === 1 && isStep1Valid) goToStep(2)
    if (currentStep === 2 && isStep2Valid) goToStep(3)
  }
  const handleBack = () => {
    if (currentStep === 2) goToStep(1)
    if (currentStep === 3) goToStep(2)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (currentStep !== 3 || !selectedCourier || !selected || loading) return
    setLoading(true)
    setPesan(null)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          produk_id: productId,
          jumlah: quantity,
          nama_pembeli: name,
          no_hp: phone,
          alamat: address,
          village_id: selected.desa_id,
          quote: selectedCourier.quote,
        }),
      })
      const data = (await res.json()) as { success: boolean; token?: string; error?: string }
      if (!res.ok || !data.success || !data.token) throw new Error(data.error ?? 'Checkout gagal. Coba lagi.')

      const snap = (window as SnapWindow).snap
      if (!snap) throw new Error('Halaman pembayaran belum siap. Muat ulang halaman lalu coba lagi.')

      snap.pay(data.token, {
        onSuccess: () => { setLoading(false); setPesan({ tipe: 'info', teks: 'Pembayaran berhasil! Pesanan Anda sedang diproses.' }) },
        onPending: () => { setLoading(false); setPesan({ tipe: 'info', teks: 'Menunggu pembayaran. Kami akan konfirmasi setelah pembayaran diterima.' }) },
        onError: () => { setLoading(false); setPesan({ tipe: 'error', teks: 'Pembayaran gagal. Silakan coba lagi.' }) },
        onClose: () => setLoading(false),
      })
    } catch (err) {
      setLoading(false)
      setPesan({ tipe: 'error', teks: err instanceof Error ? err.message : 'Terjadi kesalahan.' })
    }
  }

  const steps: { step: Step; label: string; icon: React.ReactNode }[] = [
    { step: 1, label: 'Data Penerima & Alamat', icon: <User className="h-4 w-4" /> },
    { step: 2, label: 'Pilih Kurir', icon: <Truck className="h-4 w-4" /> },
    { step: 3, label: 'Bayar', icon: <CreditCard className="h-4 w-4" /> },
  ]

  const inputClass = 'mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring'

  const bantuanWa = (
    <div className="mt-6 rounded-2xl bg-muted/50 p-6 text-center sm:p-8">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Butuh bantuan?</p>
      <h3 className="text-xl font-semibold text-foreground">Chat langsung sama kami</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Tanya cara pakai, mau produk apa, atau hal lain sebelum pesan. Kami siap bantu.
      </p>
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-flex items-center justify-center rounded-xl border-2 border-primary px-5 py-3 font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
      >
        <span className="underline">Chat WhatsApp</span>
      </a>
    </div>
  )

  if (stok <= 0) {
    return (
      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="transaksi-title">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
            <h2 id="transaksi-title" className="text-2xl font-semibold text-foreground">Stok sedang kosong</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Produk ini belum tersedia saat ini. Hubungi kami untuk tahu kapan tersedia lagi.
            </p>
          </div>
          {bantuanWa}
        </div>
      </section>
    )
  }

  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="transaksi-title">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-center">
          <ol className="flex items-center" aria-label="Langkah pemesanan">
            {steps.map(({ step, label, icon }, index) => (
              <li key={step} className="flex items-center">
                <div
                  className={
                    step < currentStep
                      ? 'flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground'
                      : step === currentStep
                        ? 'flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-primary/20 text-sm font-semibold text-primary'
                        : 'flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground'
                  }
                >
                  {step < currentStep ? <CheckCircle className="h-5 w-5" /> : icon}
                </div>
                <span className={`ml-2 hidden text-sm font-medium sm:block ${step === currentStep ? 'text-primary' : 'text-muted-foreground'}`}>
                  {label}
                </span>
                {index < steps.length - 1 && (
                  <div className={`mx-2 hidden h-0.5 w-16 sm:block ${step < currentStep ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </li>
            ))}
          </ol>
        </div>

        <div ref={formCardRef} className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <header className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Langkah {currentStep} dari 3</p>
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
                    <input required maxLength={100} value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Nama penerima" />
                  </label>
                  <label className="block text-sm font-medium text-foreground">
                    No HP
                    <input required type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="08xxxxxxxxxx" />
                  </label>
                </div>

                <label className="block text-sm font-medium text-foreground">
                  Alamat Lengkap
                  <textarea
                    required
                    rows={3}
                    maxLength={300}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Nama jalan, nomor rumah, RT/RW, patokan"
                    className={inputClass}
                  />
                </label>

                <div className="relative">
                  <label className="block text-sm font-medium text-foreground">
                    Cari Desa / Kelurahan / Kecamatan
                    <input
                      value={query}
                      onChange={(e) => { setQuery(e.target.value); setSelected(null) }}
                      placeholder="Contoh: Sukarasa Bandung"
                      autoComplete="off"
                      className={inputClass}
                    />
                  </label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Ketik nama desa/kelurahan, boleh ditambah kota atau kode pos. Minimal 3 huruf.
                  </p>
                  {searchLoading && <p className="mt-2 text-xs text-muted-foreground">Mencari wilayah...</p>}
                  {!searchLoading && !selected && query.trim().length >= 3 && results.length === 0 && (
                    <p className="mt-2 text-xs text-muted-foreground">Wilayah tidak ditemukan. Coba ejaan atau kata lain.</p>
                  )}
                  {results.length > 0 && (
                    <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-border bg-card shadow-lg">
                      {results.map((w) => (
                        <li key={w.desa_id}>
                          <button
                            type="button"
                            onClick={() => { setSelected(w); setQuery(w.label); setResults([]) }}
                            className="w-full px-4 py-3 text-left text-sm hover:bg-muted"
                          >
                            <span className="flex items-start gap-2">
                              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                              <span>
                                <span className="block font-medium text-foreground">{w.desa}, {w.kecamatan}</span>
                                <span className="block text-xs text-muted-foreground">{w.kabkota}, {w.provinsi} {w.kode_pos}</span>
                              </span>
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {selected && (
                    <div className="mt-3 rounded-xl border border-primary/30 bg-primary/5 p-3">
                      <p className="text-sm text-primary">
                        <span className="font-medium">Wilayah terpilih:</span> {selected.desa}, {selected.kecamatan}, {selected.kabkota}, {selected.provinsi} ({selected.kode_pos})
                      </p>
                    </div>
                  )}
                </div>

                <label className="block text-sm font-medium text-foreground">
                  Jumlah Beli {stok <= 5 && <span className="ml-1 text-xs font-normal text-muted-foreground">(sisa {stok})</span>}
                  <input
                    type="number"
                    min={1}
                    max={maxQty}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.min(maxQty, Math.max(1, Math.floor(Number(e.target.value)) || 1)))}
                    className={inputClass}
                  />
                </label>

                <div className="mt-6 flex justify-end">
                  <Button type="button" onClick={handleNext} disabled={!isStep1Valid} className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50">
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
                    Tujuan: <span className="font-semibold">{selected?.desa}, {selected?.kecamatan}, {selected?.kabkota}</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Jumlah: {quantity} pcs</p>
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
                      <p className="text-sm font-medium text-destructive">{courierError}</p>
                    </div>
                  )}
                  {!courierLoading && courierList.length > 0 && (
                    <div className="space-y-2" role="radiogroup" aria-label="Pilihan kurir">
                      {courierList.map((c) => {
                        const aktif = selectedCourier?.quote === c.quote
                        return (
                          <label
                            key={c.quote}
                            className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 text-sm transition ${aktif ? 'border-primary bg-primary/5' : 'border-border bg-background hover:bg-muted/50'}`}
                          >
                            <input type="radio" name="kurir" checked={aktif} onChange={() => setSelectedCourier(c)} className="h-4 w-4 accent-primary" />
                            <div className="flex flex-1 flex-col">
                              <span className="font-medium text-foreground">{c.courier_name} — {c.service}</span>
                              <span className="text-xs text-muted-foreground">Estimasi: {c.estimasi}</span>
                            </div>
                            <span className="whitespace-nowrap font-semibold text-primary">{formatRupiah(c.harga)}</span>
                          </label>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-between">
                  <Button type="button" variant="outline" onClick={handleBack} className="rounded-xl px-6 py-3 font-semibold">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Kembali
                  </Button>
                  <Button type="button" onClick={handleNext} disabled={!isStep2Valid} className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50">
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
                      via {selectedCourier.courier_name} {selectedCourier.service} ({selectedCourier.estimasi})
                    </p>
                  )}
                  <div className="flex justify-between border-t border-border pt-3 text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-primary">{formatRupiah(total)}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2"><User className="h-4 w-4" /> {name} — {phone}</p>
                  <p className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{address}{selected && <span className="block">{selected.desa}, {selected.kecamatan}, {selected.kabkota}, {selected.provinsi} {selected.kode_pos}</span>}</span>
                  </p>
                </div>

                <div className="mt-6 flex justify-between">
                  <Button type="button" variant="outline" onClick={handleBack} className="rounded-xl px-6 py-3 font-semibold">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Kembali
                  </Button>
                  <Button type="submit" disabled={loading} className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50">
                    {loading ? 'Memproses...' : 'Bayar Sekarang'}
                  </Button>
                </div>
              </>
            )}

            {pesan && (
              <p role={pesan.tipe === 'error' ? 'alert' : 'status'} className={`rounded-xl p-3 text-sm ${pesan.tipe === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                {pesan.teks}
              </p>
            )}
          </form>
        </div>

        {bantuanWa}
      </div>
    </section>
  )
}
