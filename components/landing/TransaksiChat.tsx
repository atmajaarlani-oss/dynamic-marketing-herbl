'use client'

import { FormEvent, useState } from 'react'

type TransaksiChatProps = { whatsappNumber?: string }

export function TransaksiChat({ whatsappNumber = '6281234567890' }: TransaksiChatProps) {
  const [submitted, setSubmitted] = useState(false)
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(true) }
  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="transaksi-title">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"><p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Mulai pesan</p><h2 id="transaksi-title" className="text-3xl font-semibold tracking-tight text-foreground">Beli dengan tenang</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Form ini masih simulasi. Pembayaran akan tersedia pada fase berikutnya.</p><form onSubmit={handleSubmit} className="mt-6 space-y-4"><label className="block text-sm font-medium text-foreground">Nama<input required name="name" className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" /></label><label className="block text-sm font-medium text-foreground">Nomor WhatsApp<input required name="phone" type="tel" className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" /></label><button type="submit" className="w-full rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90">{submitted ? 'Pesanan dicatat' : 'Kirim pesanan'}</button></form></div>
        <div className="flex flex-col justify-between rounded-2xl bg-muted/50 p-6 sm:p-8"><div><p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Butuh bantuan?</p><h3 className="text-2xl font-semibold text-foreground">Cerita langsung dengan kami</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">Tanyakan cara pakai, pilihan produk, atau hal lain sebelum memesan.</p></div><a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center justify-center rounded-xl border-2 border-primary px-5 py-3 font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground">Chat Saya via WhatsApp</a></div>
      </div>
    </section>
  )
}
