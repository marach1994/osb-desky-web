import { NextRequest, NextResponse } from 'next/server'
import { getAllArticles } from '@/lib/mdx'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.toLowerCase() || ''

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const articles = getAllArticles()

  const results = articles
    .filter(article =>
      article.title.toLowerCase().includes(query) ||
      article.description.toLowerCase().includes(query) ||
      article.keywords.some(kw => kw.toLowerCase().includes(query))
    )
    .slice(0, 10)
    .map(article => ({
      slug: article.slug,
      title: article.title,
      description: article.description,
      category: article.category,
      url: `/${article.category}/${article.slug}`,
    }))

  return NextResponse.json({ results })
}
