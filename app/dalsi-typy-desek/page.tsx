import Link from 'next/link'
import type { Metadata } from 'next'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import { dalsiTypyDesekArticles } from '@/lib/navigation'
import { generateCategoryMetadata } from '@/lib/seo'

export const metadata: Metadata = generateCategoryMetadata(
  'Dalsi typy desek',
  'Alternativy k OSB deskam - Durelis desky, Biodeska a dalsi stavebni materialy.',
  '/dalsi-typy-desek'
)

export default function DalsiTypyDesekPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Dalsi typy desek', href: '/dalsi-typy-desek' }]} />
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Dalsi typy desek</h1>
      <p className="text-gray-600 mb-8">Alternativy k OSB deskam - Durelis, Biodeska a dalsi materialy.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dalsiTypyDesekArticles.map((a) => (
          <Link
            key={a.slug}
            href={`/dalsi-typy-desek/${a.slug}`}
            className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-sm transition-all"
          >
            <h2 className="font-semibold text-gray-900">{a.label}</h2>
          </Link>
        ))}
      </div>
    </div>
  )
}
