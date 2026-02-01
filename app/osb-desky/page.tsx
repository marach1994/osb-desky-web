import Link from 'next/link'
import type { Metadata } from 'next'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import { categoryMap } from '@/lib/navigation'
import { generateCategoryMetadata } from '@/lib/seo'

export const metadata: Metadata = generateCategoryMetadata(
  'OSB desky',
  'Kompletni pruvodce OSB deskami - podle sily, rozmeru, vyuziti, tipy, prislusenstvi a dalsi.',
  '/osb-desky'
)

export default function OsbDeskyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'OSB desky', href: '/osb-desky' }]} />
      <h1 className="text-3xl font-bold text-gray-900 mb-4">OSB desky</h1>
      <p className="text-gray-600 mb-8 max-w-2xl">
        Kompletni pruvodce OSB deskami. Vybirejte podle sily, rozmeru, vyuziti nebo si prectete nase tipy a navody.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(categoryMap).map(([key, cat]) => (
          <Link
            key={key}
            href={`/osb-desky/${key}`}
            className="block p-5 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-sm transition-all"
          >
            <h2 className="font-bold text-gray-900 mb-2">{cat.label}</h2>
            <p className="text-sm text-gray-500">{cat.subcategories.length} clanku</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
