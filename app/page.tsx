import Link from 'next/link'
import SearchBar from '@/components/search/SearchBar'
import { getAllArticles } from '@/lib/mdx'

const categories = [
  {
    title: 'OSB desky',
    description: 'Kompletni pruvodce OSB deskami - podle sily, rozmeru, vyuziti a dalsi.',
    href: '/osb-desky',
    count: '45+ clanku',
  },
  {
    title: 'Navody',
    description: 'Prakticke navody na praci s OSB deskami krok za krokem.',
    href: '/navody',
    count: '10 navodu',
  },
  {
    title: 'Dalsi typy desek',
    description: 'Alternativy k OSB - Durelis desky, Biodeska a dalsi materialy.',
    href: '/dalsi-typy-desek',
    count: '6 clanku',
  },
]

export default function HomePage() {
  const articles = getAllArticles()
  const featured = articles.slice(0, 3)

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-wood-50 to-wood-100 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            OSB desky - Kompletni pruvodce
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Vse o OSB deskach na jednom miste. Vlastnosti, pouziti, srovnani cen a prakticke navody.
          </p>
          <div className="flex justify-center">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Prozkoumejte kategorie</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="block p-6 bg-white border border-gray-200 rounded-xl hover:border-primary-500 hover:shadow-md transition-all group"
            >
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 mb-2">
                {cat.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">{cat.description}</p>
              <span className="text-xs font-medium text-primary-600">{cat.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured articles */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Doporucene clanky</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((article) => (
              <Link
                key={`${article.category}/${article.slug}`}
                href={`/${article.category}/${article.slug}`}
                className="block p-6 bg-white border border-gray-200 rounded-xl hover:border-primary-500 hover:shadow-md transition-all"
              >
                <h3 className="font-bold text-gray-900 mb-2">{article.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3">{article.description}</p>
                <span className="inline-block mt-3 text-sm font-medium text-primary-600">
                  Cist vice &rarr;
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
