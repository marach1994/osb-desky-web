import Link from 'next/link'
import type { Metadata } from 'next'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import { barvyLakyCategoryMap, barvyLakyStandaloneArticles } from '@/lib/barvy-navigation'
import { generateCategoryMetadata } from '@/lib/seo'

export const metadata: Metadata = generateCategoryMetadata(
  'Barvy a laky',
  'Kompletní průvodce barvami a laky – barvy na zeď, dřevo, kov, interiéry, exteriéry a přehled značek.',
  '/barvy-a-laky'
)

export default function BarvyALakyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Barvy a laky', href: '/barvy-a-laky' }]} />
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Barvy a laky</h1>
      <p className="text-gray-600 mb-8 max-w-2xl">
        Kompletní průvodce barvami a laky. Vybírejte podle typu povrchu, prostředí nebo oblíbené značky.
      </p>

      {/* Standalone articles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {barvyLakyStandaloneArticles.map((article) => (
          <Link
            key={article.slug}
            href={`/barvy-a-laky/${article.slug}`}
            className="block p-5 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-sm transition-all"
          >
            <h2 className="font-bold text-gray-900 mb-2">{article.label}</h2>
          </Link>
        ))}
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(barvyLakyCategoryMap).map(([key, cat]) => (
          <Link
            key={key}
            href={`/barvy-a-laky/${key}`}
            className="block p-5 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-sm transition-all"
          >
            <h2 className="font-bold text-gray-900 mb-2">{cat.label}</h2>
            <p className="text-sm text-gray-500">{cat.subcategories.length} článků</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
