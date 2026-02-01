import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import { categoryMap } from '@/lib/navigation'
import { generateCategoryMetadata } from '@/lib/seo'

interface Props {
  params: Promise<{ category: string }>
}

export async function generateStaticParams() {
  return Object.keys(categoryMap).map((category) => ({ category }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const cat = categoryMap[category]
  if (!cat) return {}
  return generateCategoryMetadata(
    `${cat.label} - OSB desky`,
    `OSB desky - ${cat.label}. Prehled vsech clanku v kategorii.`,
    `/osb-desky/${category}`
  )
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const cat = categoryMap[category]
  if (!cat) notFound()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumbs items={[
        { label: 'OSB desky', href: '/osb-desky' },
        { label: cat.label, href: `/osb-desky/${category}` },
      ]} />
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{cat.label}</h1>
      <p className="text-gray-600 mb-8">Prehled vsech clanku v kategorii {cat.label}.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cat.subcategories.map((sub) => (
          <Link
            key={sub.slug}
            href={`/osb-desky/${sub.slug}`}
            className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-sm transition-all"
          >
            <h2 className="font-semibold text-gray-900">{sub.label}</h2>
          </Link>
        ))}
      </div>
    </div>
  )
}
