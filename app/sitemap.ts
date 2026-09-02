import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const { data: produkList } = await supabase
    .from('produk')
    .select('slug, updated_at')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const produkUrls: MetadataRoute.Sitemap = (produkList ?? []).map((produk) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://herbalinsani.id'}/produk/${produk.slug}`,
    lastModified: produk.updated_at ? new Date(produk.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://herbalinsani.id'}/home`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ]

  return [...staticUrls, ...produkUrls]
}
