import Link from 'next/link'
import type { Metadata } from 'next'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import HeurekaProductGrid from '@/components/affiliate/HeurekaProductGrid'
import { categoryMap } from '@/lib/navigation'
import { generateCategoryMetadata, generateBreadcrumbJsonLd } from '@/lib/seo'

export const metadata: Metadata = generateCategoryMetadata(
  'OSB desky – Kompletní průvodce výběrem a využitím',
  'Vše o OSB deskách – podle síly, rozměrů, využití. Srovnání tlouštěk 8–25 mm, tipy na montáž, ceny a kde koupit. Průvodce pro kutily i profesionály.',
  '/osb-desky'
)

const breadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: 'OSB desky', url: '/osb-desky' },
])

const categoryDescriptions: Record<string, string> = {
  'podle-silly': 'Srovnání tlouštěk 8–25 mm. Která je vhodná na podlahu, střechu nebo stěny?',
  'podle-rozmeru': 'Standardní formáty OSB desek a tipy na optimální krájení bez odpadu.',
  'vyuziti': 'Podlaha, stěny, garáž, chata, podkroví – jak vybrat desku pro konkrétní projekt.',
  'tipy': 'OSB s pérem a drážkou, voděodolné, broušené a venkovní varianty.',
  'prislusenstvi': 'Lepidlo, vruty, nátěr, lak a izolace – vše co potřebujete k OSB deskám.',
  'dodavatele': 'Přehled dodavatelů a stavebních řetězců s OSB deskami v ČR.',
  'cena': 'Aktuální ceny OSB desek, srovnání nabídek a tipy jak ušetřit.',
  'lokalita': 'Kde koupit OSB desky ve vašem regionu – Praha, Brno a okolí.',
}

export default function OsbDeskyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <Breadcrumbs items={[{ label: 'OSB desky', href: '/osb-desky' }]} />

      <h1 className="text-3xl font-bold text-gray-900 mb-4">OSB desky – Kompletní průvodce</h1>

      <p className="text-gray-600 mb-4 text-lg max-w-3xl">
        OSB desky (Oriented Strand Board) jsou konstrukční deskový materiál z orientovaných třísek lisovaných pryskyřicí.
        Používají se na podlahy, střešní bednění, stěny dřevostaveb i pro kutilské projekty.
        Díky nízké ceně a dobré nosnosti jde o nejpopulárnější alternativu k překližce.
      </p>

      <p className="text-gray-600 mb-8 max-w-3xl">
        Vybírejte podle <strong>tloušťky</strong> (8–25 mm), <strong>třídy</strong> (OSB/2 pro suché prostory, OSB/3 do vlhka)
        nebo podle konkrétního <strong>využití</strong>. Níže najdete přehled všech kategorií.
      </p>

      <HeurekaProductGrid
        positionId="260397"
        categoryId="6038"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
        {Object.entries(categoryMap).map(([key, cat]) => (
          <Link
            key={key}
            href={`/osb-desky/${key}`}
            className="block p-5 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-sm transition-all"
          >
            <h2 className="font-bold text-gray-900 mb-1">{cat.label}</h2>
            <p className="text-sm text-gray-500">{categoryDescriptions[key] ?? `${cat.subcategories.length} článků`}</p>
          </Link>
        ))}
      </div>

      <section className="mt-12 p-6 bg-wood-50 rounded-lg border border-wood-200">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Nejčastěji hledané tloušťky</h2>
        <div className="flex flex-wrap gap-3">
          {['8mm', '12mm', '15mm', '18mm', '22mm', '25mm'].map(t => (
            <Link
              key={t}
              href={`/osb-desky/${t}`}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-semibold text-primary-600 hover:border-primary-500 hover:bg-primary-50 transition-all text-sm"
            >
              OSB {t}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
