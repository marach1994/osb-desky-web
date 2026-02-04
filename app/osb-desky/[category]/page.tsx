import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import HeurekaWidget from '@/components/affiliate/HeurekaWidget'
import HeurekaProductGrid from '@/components/affiliate/HeurekaProductGrid'
import RelatedArticles from '@/components/article/RelatedArticles'
import ProductGrid from '@/components/products/ProductGrid'
import { categoryMap, allOsbArticleSlugs } from '@/lib/navigation'
import { getArticleBySlug, getArticleContent, getAllArticles } from '@/lib/mdx'
import { getRelatedArticles } from '@/lib/related'
import { getProductsForArticle } from '@/lib/products'
import { generateCategoryMetadata, generateArticleMetadata, generateArticleJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo'
import { MDXRemote } from 'next-mdx-remote/rsc'

interface Props {
  params: Promise<{ category: string }>
}

export const dynamicParams = true

export async function generateStaticParams() {
  // Generate both category slugs and article slugs
  const categorySlugs = Object.keys(categoryMap).map((c) => ({ category: c }))
  const articleSlugs = allOsbArticleSlugs().map((s) => ({ category: s }))
  return [...categorySlugs, ...articleSlugs]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params

  // Check if it's a category
  const cat = categoryMap[slug]
  if (cat) {
    return generateCategoryMetadata(
      `${cat.label} - OSB desky`,
      `OSB desky - ${cat.label}. Prehled vsech clanku v kategorii.`,
      `/osb-desky/${slug}`
    )
  }

  // Otherwise it's an article
  const article = getArticleBySlug('osb-desky', slug)
  if (article) {
    return generateArticleMetadata(article, `/osb-desky/${slug}`)
  }

  return {}
}

export default async function OsbDeskySlugPage({ params }: Props) {
  const { category: slug } = await params

  // 1. Check if it's a category page
  const cat = categoryMap[slug]
  if (cat) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { label: 'OSB desky', href: '/osb-desky' },
          { label: cat.label, href: `/osb-desky/${slug}` },
        ]} />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{cat.label}</h1>
        <p className="text-gray-600 mb-8">Prehled vsech clanku v kategorii {cat.label}.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cat.subcategories.map((sub) => (
            <Link
              key={sub.slug}
              href={`/osb-desky/${sub.slug}`}
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
  const article = getArticleBySlug('osb-desky', slug)
  const content = getArticleContent('osb-desky', slug)

  if (article && content) {
    const allArticles = getAllArticles()
    const related = getRelatedArticles(article, allArticles)
    const catInfo = article.subcategory ? categoryMap[article.subcategory] : undefined

    const articleJsonLd = generateArticleJsonLd(article, `/osb-desky/${slug}`)
    const breadcrumbItems = [
      { name: 'OSB desky', url: '/osb-desky' },
      ...(catInfo ? [{ name: catInfo.label, url: `/osb-desky/${article.subcategory}` }] : []),
      { name: article.title, url: `/osb-desky/${slug}` },
    ]
    const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbItems)

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <Breadcrumbs items={[
          { label: 'OSB desky', href: '/osb-desky' },
          ...(catInfo ? [{ label: catInfo.label, href: `/osb-desky/${article.subcategory}` }] : []),
          { label: article.title, href: `/osb-desky/${slug}` },
        ]} />

        {article.heurekaPositionId && article.heurekaCategoryId ? (
          <HeurekaProductGrid
            positionId={article.heurekaPositionId}
            categoryId={article.heurekaCategoryId}
          />
        ) : (
          <ProductGrid products={getProductsForArticle('osb-desky', slug)} />
        )}

        <div className="prose prose-gray max-w-none">
          <MDXRemote source={content} />
        </div>

        <RelatedArticles articles={related} />
      </div>
    )
  }

  // 3. Check if it's a known article slug without MDX yet (placeholder)
  for (const [catKey, catData] of Object.entries(categoryMap)) {
    const sub = catData.subcategories.find(s => s.slug === slug)
    if (sub) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Breadcrumbs items={[
            { label: 'OSB desky', href: '/osb-desky' },
            { label: catData.label, href: `/osb-desky/${catKey}` },
            { label: sub.label, href: `/osb-desky/${slug}` },
          ]} />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{sub.label}</h1>
          <p className="text-gray-500">Obsah tohoto clanku bude brzy doplnen.</p>
          <HeurekaWidget position="top" />
        </div>
      )
    }
  }

  notFound()
}
