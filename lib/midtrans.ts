/** Midtrans Snap lewat fetch biasa (tanpa paket midtrans-client, aman untuk Cloudflare). */

export async function createSnapTransaction(payload: Record<string, unknown>): Promise<{ token: string; redirect_url: string }> {
  const serverKey = process.env.MIDTRANS_SERVER_KEY
  if (!serverKey) throw new Error('MIDTRANS_SERVER_KEY belum diset')
  const url = process.env.MIDTRANS_IS_PRODUCTION === 'true'
    ? 'https://app.midtrans.com/snap/v1/transactions'
    : 'https://app.sandbox.midtrans.com/snap/v1/transactions'

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(serverKey + ':'),
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`Midtrans ${res.status}: ${await res.text()}`)
  return (await res.json()) as { token: string; redirect_url: string }
}

export async function sha512Hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

/** Perbandingan string dengan waktu tetap (mencegah timing attack). */
export function samaAman(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let r = 0
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return r === 0
}
