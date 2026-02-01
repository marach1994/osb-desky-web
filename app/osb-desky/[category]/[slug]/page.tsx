import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import HeurekaWidget from '@/components/affiliate/HeurekaWidget'
import RelatedArticles from '@/components/article/RelatedArticles'
import { getArticleBySlug, getArticleContent, getAllArticles } from '@/lib/mdx'
import { getRelatedArticles } from '@/lib/related'
import { generateArticleMetadata, generateArticleJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo'
import { categoryMap } from '@/lib/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'

interface Props {
  params: Promise<{ category: string; slug: string }>
}

export async function generateStaticParams() {
  const params: { category: string; slug: string }[] = []
  for (const [catKey, cat] of Object.entries(categoryMap)) {
    for (const sub of cat.subcategories) {
      params.push({ category: catKey, slug: sub.slug })
    }
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug('osb-desky', slug)
  if (!article) return {}
  return generateArticleMetadata(article, `/osb-desky/${slug}`)
}

export default async function ArticlePage({ params }: Props) {
  const { category, slug } = await params
  const article = getArticleBySlug('osb-desky', slug)
  const content = getArticleContent('osb-desky', slug)

  if (!article || !content) {
    // No MDX file - show placeholder
    const cat = categoryMap[category]
    const sub = cat?.subcategories.find(s => s.slug === slug)
    if (!sub) notFound()

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { label: 'OSB desky', href: '/osb-desky' },
          { label: cat.label, href: `/osb-desky/${category}` },
          { label: sub.label, href: `/osb-desky/${slug}` },
        ]} />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{sub.label}</h1>
        <p className="text-gray-500">Obsah tohoto clanku bude brzy doplnen.</p>
        <HeurekaWidget position="top" />
      </div>
    )
  }

  const allArticles = getAllArticles()
  const related = getRelatedArticles(article, allArticles)
  const catInfo = categoryMap[article.subcategory || category]

  const articleJsonLd = generateArticleJsonLd(article, `/osb-desky/${slug}`)
  const breadcrumbItems = [
    { name: 'OSB desky', url: '/osb-desky' },
    ...(catInfo ? [{ name: catInfo.label, url: `/osb-desky/${article.subcategory || category}` }] : []),
    { name: article.title, url: `/osb-desky/${slug}` },
  ]
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbItems)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <Breadcrumbs items={[
        { label: 'OSB desky', href: '/osb-desky' },
        ...(catInfo ? [{ label: catInfo.label, href: `/osb-desky/${article.subcategory || category}` }] : []),
        { label: article.title, href: `/osb-desky/${slug}` },
      ]} />

      <div className="prose prose-gray max-w-none">
        <HeurekaWidget position="top" />
        <MDXRemote source={content} />
        <HeurekaWidget position="bottom" />
      </div>

      <RelatedArticles articles={related} />
    </div>
  )
}
