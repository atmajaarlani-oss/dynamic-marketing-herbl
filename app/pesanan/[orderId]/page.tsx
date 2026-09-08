import { redirect } from "next/navigation"

export const runtime = "nodejs"

export default async function PesananDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await params

  // The status page is the public order surface. It reads through the protected
  // status API, which avoids rendering a false 404 when public RLS blocks the
  // server component's anonymous Supabase query.
  redirect(`/pesanan/status?id=${encodeURIComponent(orderId)}`)
}
