import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import HeurekaZebricek from '@/components/affiliate/HeurekaZebricek'
import RelatedArticles from '@/components/article/RelatedArticles'
import ProductGrid from '@/components/products/ProductGrid'
import { getArticleBySlug, getArticleContent, getAllArticles } from '@/lib/mdx'
import { getRelatedArticles } from '@/lib/related'
import { getProductsForArticle } from '@/lib/products'
import { generateArticleMetadata, generateArticleJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo'
import { dalsiTypyDesekArticles } from '@/lib/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return dalsiTypyDesekArticles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug('dalsi-typy-desek', slug)
  if (!article) return {}
  return generateArticleMetadata(article, `/dalsi-typy-desek/${slug}`)
}

export default async function DalsiTypPage({ params }: Props) {
  const { slug } = await params
  const article = getArticleBySlug('dalsi-typy-desek', slug)
  const content = getArticleContent('dalsi-typy-desek', slug)

  if (!article || !content) {
    const info = dalsiTypyDesekArticles.find(a => a.slug === slug)
    if (!info) notFound()

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { label: 'Dalsi typy desek', href: '/dalsi-typy-desek' },
          { label: info.label, href: `/dalsi-typy-desek/${slug}` },
        ]} />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{info.label}</h1>
        <p className="text-gray-500">Obsah tohoto clanku bude brzy doplnen.</p>
        <HeurekaZebricek positionId="260397" categoryId="6038" />
      </div>
    )
  }

  const allArticles = getAllArticles()
  const related = getRelatedArticles(article, allArticles)

  const articleJsonLd = generateArticleJsonLd(article, `/dalsi-typy-desek/${slug}`)
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Dalsi typy desek', url: '/dalsi-typy-desek' },
    { name: article.title, url: `/dalsi-typy-desek/${slug}` },
  ])

  // Widget nad nadpisem pusobil jako reklama pred obsahem. Patri az pod H1,
  // jenze H1 je uvnitr MDX - proto se vklada pres override komponenty h1.
  const pid = article.heurekaPositionId || '260397'
  const cid = article.heurekaCategoryId || '6038'

  const mdxComponents = {
    h1: (props: { children?: ReactNode }) => (
      <>
        <h1>{props.children}</h1>
        <HeurekaZebricek positionId={pid} categoryId={cid} categoryFilters={article.heurekaCategoryFilters} />
      </>
    ),
    HeurekaZebricek: (props: { positionId?: string; categoryId?: string; categoryFilters?: string; title?: string; pocet?: number }) => (
      <HeurekaZebricek
        positionId={props.positionId || pid}
        categoryId={props.categoryId || cid}
        categoryFilters={props.categoryFilters ?? article.heurekaCategoryFilters}
        title={props.title}
        pocet={props.pocet}
      />
    ),
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <Breadcrumbs items={[
        { label: 'Dalsi typy desek', href: '/dalsi-typy-desek' },
        { label: article.title, href: `/dalsi-typy-desek/${slug}` },
      ]} />

      <div className="prose prose-gray max-w-none">
        <MDXRemote source={content} components={mdxComponents} />
      </div>

      <ProductGrid products={getProductsForArticle('dalsi-typy-desek', slug)} />

      <RelatedArticles articles={related} />
    </div>
  )
}
