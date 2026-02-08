import type { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/mdx'
import { categoryMap, navodyArticles, dalsiTypyDesekArticles } from '@/lib/navigation'
import { barvyLakyCategoryMap, barvyLakyStandaloneArticles } from '@/lib/barvy-navigation'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://osb-desky.cz'

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles()

  const articleUrls = articles.map((article) => ({
    url: `${SITE_URL}/${article.category}/${article.slug}`,
    lastModified: new Date(article.updatedAt || article.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const categoryUrls = Object.keys(categoryMap).map((key) => ({
    url: `${SITE_URL}/osb-desky/${key}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Placeholder pages (no MDX yet)
  const placeholderUrls: MetadataRoute.Sitemap = []
  for (const [catKey, cat] of Object.entries(categoryMap)) {
    for (const sub of cat.subcategories) {
      if (!articles.some(a => a.slug === sub.slug && a.category === 'osb-desky')) {
        placeholderUrls.push({
          url: `${SITE_URL}/osb-desky/${sub.slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.5,
        })
      }
    }
  }

  for (const a of navodyArticles) {
    if (!articles.some(ar => ar.slug === a.slug && ar.category === 'navody')) {
      placeholderUrls.push({
        url: `${SITE_URL}/navody/${a.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      })
    }
  }

  for (const a of dalsiTypyDesekArticles) {
    if (!articles.some(ar => ar.slug === a.slug && ar.category === 'dalsi-typy-desek')) {
      placeholderUrls.push({
        url: `${SITE_URL}/dalsi-typy-desek/${a.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      })
    }
  }

  // Barvy a laky categories
  const barvyCategoryUrls = Object.keys(barvyLakyCategoryMap).map((key) => ({
    url: `${SITE_URL}/barvy-a-laky/${key}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Barvy a laky placeholders
  for (const [catKey, cat] of Object.entries(barvyLakyCategoryMap)) {
    for (const sub of cat.subcategories) {
      if (!articles.some(a => a.slug === sub.slug && a.category === 'barvy-a-laky')) {
        placeholderUrls.push({
          url: `${SITE_URL}/barvy-a-laky/${sub.slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.5,
        })
      }
    }
  }

  for (const a of barvyLakyStandaloneArticles) {
    if (!articles.some(ar => ar.slug === a.slug && ar.category === 'barvy-a-laky')) {
      placeholderUrls.push({
        url: `${SITE_URL}/barvy-a-laky/${a.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      })
    }
  }

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/osb-desky`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/barvy-a-laky`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/navody`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/dalsi-typy-desek`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...categoryUrls,
    ...barvyCategoryUrls,
    ...articleUrls,
    ...placeholderUrls,
  ]
}
