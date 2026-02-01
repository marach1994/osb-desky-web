import { Metadata } from 'next'
import { Article } from '@/types'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://osb-desky.cz'
const SITE_NAME = 'OSB-desky.cz'

export function generateArticleMetadata(article: Article, urlPath: string): Metadata {
  return {
    title: `${article.title} | ${SITE_NAME}`,
    description: article.description,
    keywords: article.keywords,
    openGraph: {
      title: article.title,
      description: article.description,
      url: `${SITE_URL}${urlPath}`,
      siteName: SITE_NAME,
      locale: 'cs_CZ',
      type: 'article',
    },
    robots: { index: true, follow: true },
  }
}

export function generateCategoryMetadata(title: string, description: string, urlPath: string): Metadata {
  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${urlPath}`,
      siteName: SITE_NAME,
      locale: 'cs_CZ',
      type: 'website',
    },
    robots: { index: true, follow: true },
  }
}

export function generateArticleJsonLd(article: Article, urlPath: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    author: { '@type': 'Organization', name: SITE_NAME },
    publisher: { '@type': 'Organization', name: SITE_NAME },
    datePublished: article.publishedAt,
    ...(article.updatedAt && { dateModified: article.updatedAt }),
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${urlPath}` },
  }
}

export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  }
}
