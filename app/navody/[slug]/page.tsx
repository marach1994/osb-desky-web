import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import HeurekaWidget from '@/components/affiliate/HeurekaWidget'
import RelatedArticles from '@/components/article/RelatedArticles'
import { getArticleBySlug, getArticleContent, getAllArticles } from '@/lib/mdx'
import { getRelatedArticles } from '@/lib/related'
import { generateArticleMetadata, generateArticleJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo'
import { navodyArticles } from '@/lib/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return navodyArticles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug('navody', slug)
  if (!article) return {}
  return generateArticleMetadata(article, `/navody/${slug}`)
}

export default async function NavodPage({ params }: Props) {
  const { slug } = await params
  const article = getArticleBySlug('navody', slug)
  const content = getArticleContent('navody', slug)

  if (!article || !content) {
    const info = navodyArticles.find(a => a.slug === slug)
    if (!info) notFound()

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { label: 'Navody', href: '/navody' },
          { label: info.label, href: `/navody/${slug}` },
        ]} />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{info.label}</h1>
        <p className="text-gray-500">Obsah tohoto navodu bude brzy doplnen.</p>
        <HeurekaWidget position="top" />
      </div>
    )
  }

  const allArticles = getAllArticles()
  const related = getRelatedArticles(article, allArticles)

  const articleJsonLd = generateArticleJsonLd(article, `/navody/${slug}`)
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Navody', url: '/navody' },
    { name: article.title, url: `/navody/${slug}` },
  ])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <Breadcrumbs items={[
        { label: 'Navody', href: '/navody' },
        { label: article.title, href: `/navody/${slug}` },
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
