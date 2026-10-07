/**
 * "Quote" ongkir bertanda tangan (HMAC-SHA256).
 * /api/ongkir menerbitkan quote; /api/checkout memverifikasinya. Browser tidak bisa
 * mengubah harga ongkir, dan checkout tidak perlu memanggil Biteship lagi.
 * Hanya memakai Web Crypto, jadi jalan di Node maupun Cloudflare Workers.
 */
export type OngkirQuote = {
  postal: string   // kode pos tujuan
  berat: number    // gram, total
  kurir: string    // courier_code, mis. 'jne'
  layanan: string  // courier_service_code, mis. 'reg'
  harga: number    // rupiah
  estimasi: string
  exp: number      // epoch ms
}

const enc = new TextEncoder()
const dec = new TextDecoder()

function toB64Url(bytes: Uint8Array): string {
  let s = ''
  bytes.forEach((b) => { s += String.fromCharCode(b) })
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromB64Url(s: string): Uint8Array {
  const b = atob(s.replace(/-/g, '+').replace(/_/g, '/'))
  return Uint8Array.from(b, (c) => c.charCodeAt(0))
}

async function getKey(): Promise<CryptoKey> {
  const secret = process.env.QUOTE_SIGNING_SECRET
  if (!secret || secret.length < 32) throw new Error('QUOTE_SIGNING_SECRET belum diset (min. 32 karakter)')
  return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'])
}

export async function signQuote(q: OngkirQuote): Promise<string> {
  const payload = toB64Url(enc.encode(JSON.stringify(q)))
  const sig = await crypto.subtle.sign('HMAC', await getKey(), enc.encode(payload))
  return `${payload}.${toB64Url(new Uint8Array(sig))}`
}

export async function verifyQuote(token: string): Promise<OngkirQuote | null> {
  try {
    const [payload, sig] = token.split('.')
    if (!payload || !sig) return null
    const ok = await crypto.subtle.verify('HMAC', await getKey(), fromB64Url(sig), enc.encode(payload))
    if (!ok) return null
    const q = JSON.parse(dec.decode(fromB64Url(payload))) as OngkirQuote
    if (typeof q.exp !== 'number' || q.exp < Date.now()) return null
    return q
  } catch {
    return null
  }
}
