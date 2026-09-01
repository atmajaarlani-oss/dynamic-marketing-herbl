import { Suspense } from 'react'
import StatusClient from './status-client'

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function PesananStatusPage({ searchParams }: Props) {
  const params = await searchParams
  const rawId = params['id'] ?? params['order_id'] ?? null
  const orderId = Array.isArray(rawId) ? rawId[0] : rawId

  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Memuat...</p>
      </div>
    }>
      <StatusClient orderId={orderId ?? ''} />
    </Suspense>
  )
}
