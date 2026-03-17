import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import HeurekaProductGrid from '@/components/affiliate/HeurekaProductGrid'
import RelatedArticles from '@/components/article/RelatedArticles'
import ProductGrid from '@/components/products/ProductGrid'
import ProductGridWidget from '@/components/mdx/ProductGridWidget'
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
      `OSB desky – ${cat.label}`,
      `Přehled článků v kategorii ${cat.label}. Vyberte konkrétní téma a zjistěte vše o OSB deskách.`,
      `/osb-desky/${slug}`
    )
  }

  // Otherwise it's an article
  const article = getArticleBySlug('osb-desky', slug)
  const content = getArticleContent('osb-desky', slug)
  if (article && content) {
    return generateArticleMetadata(article, `/osb-desky/${slug}`)
  }

  return { robots: { index: false, follow: true } }
}

export default async function OsbDeskySlugPage({ params }: Props) {
  const { category: slug } = await params

  // 1. Check if it's a category page
  const cat = categoryMap[slug]
  if (cat) {
    const catBreadcrumbJsonLd = generateBreadcrumbJsonLd([
      { name: 'OSB desky', url: '/osb-desky' },
      { name: cat.label, url: `/osb-desky/${slug}` },
    ])
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(catBreadcrumbJsonLd) }} />

        <Breadcrumbs items={[
          { label: 'OSB desky', href: '/osb-desky' },
          { label: cat.label, href: `/osb-desky/${slug}` },
        ]} />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{cat.label} – OSB desky</h1>
        <p className="text-gray-600 mb-8">
          Přehled článků v kategorii <strong>{cat.label}</strong>. Vyberte konkrétní téma a zjistěte vše potřebné.
        </p>

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

        <div className="mt-10">
          <HeurekaProductGrid positionId="260397" categoryId="6038" />
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
    const products = getProductsForArticle('osb-desky', slug)

    const articleJsonLd = generateArticleJsonLd(article, `/osb-desky/${slug}`)
    const breadcrumbItems = [
      { name: 'OSB desky', url: '/osb-desky' },
      ...(catInfo ? [{ name: catInfo.label, url: `/osb-desky/${article.subcategory}` }] : []),
      { name: article.title, url: `/osb-desky/${slug}` },
    ]
    const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbItems)

    // MDX components with products pre-bound
    const mdxComponents = {
      ProductGridWidget: () => <ProductGridWidget products={products} />,
    }

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
            key={slug}
            positionId={article.heurekaPositionId}
            categoryId={article.heurekaCategoryId}
            categoryFilters={article.heurekaCategoryFilters}
          />
        ) : (
          <ProductGrid products={products} />
        )}

        <div className="prose prose-gray max-w-none">
          <MDXRemote source={content} components={mdxComponents} />
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
          <p className="text-gray-500">Obsah tohoto článku bude brzy doplněn.</p>
          <HeurekaProductGrid positionId="260397" categoryId="6038" />
        </div>
      )
    }
  }

  notFound()
}
