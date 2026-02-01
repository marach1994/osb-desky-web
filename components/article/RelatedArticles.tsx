import Link from 'next/link'
import { Article } from '@/types'

interface RelatedArticlesProps {
  articles: Article[]
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null

  return (
    <section className="mt-12 pt-8 border-t border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Souvisejici clanky</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
          <Link
            key={`${article.category}/${article.slug}`}
            href={`/${article.category}/${article.slug}`}
            className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-sm transition-all"
          >
            <h3 className="font-semibold text-gray-900 mb-1">{article.title}</h3>
            <p className="text-sm text-gray-500 line-clamp-2">{article.description}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
