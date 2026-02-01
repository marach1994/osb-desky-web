import Link from 'next/link'
import type { Metadata } from 'next'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import { navodyArticles } from '@/lib/navigation'
import { generateCategoryMetadata } from '@/lib/seo'

export const metadata: Metadata = generateCategoryMetadata(
  'Navody',
  'Prakticke navody na praci s OSB deskami. Pokladka, montaz, nosnost a dalsi.',
  '/navody'
)

export default function NavodyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Navody', href: '/navody' }]} />
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Navody</h1>
      <p className="text-gray-600 mb-8">Prakticke navody na praci s OSB deskami krok za krokem.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {navodyArticles.map((a) => (
          <Link
            key={a.slug}
            href={`/navody/${a.slug}`}
            className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-sm transition-all"
          >
            <h2 className="font-semibold text-gray-900">{a.label}</h2>
          </Link>
        ))}
      </div>
    </div>
  )
}
