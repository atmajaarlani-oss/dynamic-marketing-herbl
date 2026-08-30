import StatusClient from './status-client'

export default async function PesananStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; order_id?: string }>
}) {
  const params = await searchParams
  // Handle both ?id=ORD-... (our snap redirect) and ?order_id=ORD-... (Midtrans redirect)
  const orderId = params.id ?? params.order_id ?? null

  return <StatusClient orderId={orderId} />
}
