import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import { barvyLakyCategoryMap, barvyLakyStandaloneArticles, allBarvyLakyArticleSlugs } from '@/lib/barvy-navigation'
import { getArticleBySlug, getArticleContent, getAllArticles } from '@/lib/mdx'
import { getRelatedArticles } from '@/lib/related'
import { generateCategoryMetadata, generateArticleMetadata, generateArticleJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo'
import { MDXRemote } from 'next-mdx-remote/rsc'

interface Props {
  params: Promise<{ slug: string }>
}

export const dynamicParams = true

export async function generateStaticParams() {
  const categorySlugs = Object.keys(barvyLakyCategoryMap).map((c) => ({ slug: c }))
  const articleSlugs = allBarvyLakyArticleSlugs().map((s) => ({ slug: s }))
  return [...categorySlugs, ...articleSlugs]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  const cat = barvyLakyCategoryMap[slug]
  if (cat) {
    return generateCategoryMetadata(
      `${cat.label} - Barvy a laky`,
      `Barvy a laky - ${cat.label}. Přehled všech článků v kategorii.`,
      `/barvy-a-laky/${slug}`
    )
  }

  const article = getArticleBySlug('barvy-a-laky', slug)
  if (article) {
    return generateArticleMetadata(article, `/barvy-a-laky/${slug}`)
  }

  return {}
}

export default async function BarvyALakySlugPage({ params }: Props) {
  const { slug } = await params

  // 1. Check if it's a category page
  const cat = barvyLakyCategoryMap[slug]
  if (cat) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { label: 'Barvy a laky', href: '/barvy-a-laky' },
          { label: cat.label, href: `/barvy-a-laky/${slug}` },
        ]} />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{cat.label}</h1>
        <p className="text-gray-600 mb-8">Přehled všech článků v kategorii {cat.label}.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cat.subcategories.map((sub) => (
            <Link
              key={sub.slug}
              href={`/barvy-a-laky/${sub.slug}`}
              className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-sm transition-all"
            >
              <h2 className="font-semibold text-gray-900">{sub.label}</h2>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  // 2. Check if it's an article with MDX content
  const article = getArticleBySlug('barvy-a-laky', slug)
  const content = getArticleContent('barvy-a-laky', slug)

  if (article && content) {
    const allArticles = getAllArticles()
    const related = getRelatedArticles(article, allArticles)
    const catInfo = article.subcategory ? barvyLakyCategoryMap[article.subcategory] : undefined

    const articleJsonLd = generateArticleJsonLd(article, `/barvy-a-laky/${slug}`)
    const breadcrumbItems = [
      { name: 'Barvy a laky', url: '/barvy-a-laky' },
      ...(catInfo ? [{ name: catInfo.label, url: `/barvy-a-laky/${article.subcategory}` }] : []),
      { name: article.title, url: `/barvy-a-laky/${slug}` },
    ]
    const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbItems)

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <Breadcrumbs items={[
          { label: 'Barvy a laky', href: '/barvy-a-laky' },
          ...(catInfo ? [{ label: catInfo.label, href: `/barvy-a-laky/${article.subcategory}` }] : []),
          { label: article.title, href: `/barvy-a-laky/${slug}` },
        ]} />

        <div className="prose prose-gray max-w-none">
          <MDXRemote source={content} />
        </div>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Související články</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${r.category}/${r.slug}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-sm transition-all"
                >
                  <h3 className="font-semibold text-gray-900">{r.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{r.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // 3. Check if it's a known article slug without MDX yet (placeholder)
  for (const [catKey, catData] of Object.entries(barvyLakyCategoryMap)) {
    const sub = catData.subcategories.find(s => s.slug === slug)
    if (sub) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Breadcrumbs items={[
            { label: 'Barvy a laky', href: '/barvy-a-laky' },
            { label: catData.label, href: `/barvy-a-laky/${catKey}` },
            { label: sub.label, href: `/barvy-a-laky/${slug}` },
          ]} />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{sub.label}</h1>
          <p className="text-gray-500">Obsah tohoto článku bude brzy doplněn.</p>
        </div>
      )
    }
  }

  // Check standalone articles
  const standalone = barvyLakyStandaloneArticles.find(a => a.slug === slug)
  if (standalone) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { label: 'Barvy a laky', href: '/barvy-a-laky' },
          { label: standalone.label, href: `/barvy-a-laky/${slug}` },
        ]} />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{standalone.label}</h1>
        <p className="text-gray-500">Obsah tohoto článku bude brzy doplněn.</p>
      </div>
    )
  }

  notFound()
}
