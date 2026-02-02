import Link from 'next/link'
import type { Metadata } from 'next'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import HeurekaWidget from '@/components/affiliate/HeurekaWidget'
import { generateCategoryMetadata } from '@/lib/seo'

export const metadata: Metadata = generateCategoryMetadata(
  'OSB desky podle síly – Průvodce výběrem správné tloušťky',
  'Jak vybrat správnou tloušťku OSB desky? Porovnání desek 8mm až 25mm, použití, nosnost a doporučení pro každou tloušťku.',
  '/osb-desky/podle-silly'
)

const thicknesses = [
  {
    slug: '8mm',
    label: 'OSB desky 8mm',
    description: 'Nejtenčí varianta. Lehké obklady, dekorace, podhledové konstrukce. Není vhodná pro nosné účely.',
  },
  {
    slug: '12mm',
    label: 'OSB desky 12mm',
    description: 'Obklady stěn, lehké příčky, střešní bednění při malé rozteči krokví. Vhodná jako podklad na pevný povrch.',
  },
  {
    slug: '15mm',
    label: 'OSB desky 15mm',
    description: 'Stěny, lehké podlahy na pevném podkladu, střešní bednění. Univerzální volba pro nenosné konstrukce.',
  },
  {
    slug: '16mm',
    label: 'OSB desky 16mm',
    description: 'Podobné jako 15mm s mírně vyšší nosností. Stěny dřevostaveb, střešní bednění, lehké podlahy.',
  },
  {
    slug: '18mm',
    label: 'OSB desky 18mm',
    description: 'Nejprodávanější tloušťka. Podlahy v obytných prostorech, střešní bednění, nosné stěny. Zlatý standard.',
    featured: true,
  },
  {
    slug: '19mm',
    label: 'OSB desky 19mm',
    description: 'Mírně silnější alternativa k 18mm. Podlahy, stropy, nosné konstrukce. Méně běžně dostupná.',
  },
  {
    slug: '22mm',
    label: 'OSB desky 22mm',
    description: 'Těžké podlahy, garáže s pojezdem, větší rozteče trámů. Pro náročnější zatížení a průmyslové prostory.',
  },
  {
    slug: '25mm',
    label: 'OSB desky 25mm',
    description: 'Nejsilnější běžná varianta. Speciální nosné konstrukce, extrémní zatížení, průmyslové podlahy.',
  },
]

export default function PodleSilyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumbs items={[
        { label: 'OSB desky', href: '/osb-desky' },
        { label: 'Podle síly', href: '/osb-desky/podle-silly' },
      ]} />

      <h1 className="text-3xl font-bold text-gray-900 mb-4">OSB desky podle síly – Jak vybrat správnou tloušťku?</h1>

      <p className="text-gray-600 mb-6 text-lg">
        Výběr správné tloušťky OSB desky je klíčový pro úspěch vašeho projektu. Příliš tenká deska se bude prohýbat a vrzat, zbytečně silná zase prodraží stavbu. Níže najdete přehled všech běžných tlouštěk a doporučení, kterou zvolit.
      </p>

      {/* Menu s prolinky na jednotlivé tloušťky */}
      <nav className="my-8 p-6 bg-wood-50 rounded-lg border border-wood-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Přehled tlouštěk OSB desek</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {thicknesses.map((t) => (
            <Link
              key={t.slug}
              href={`/osb-desky/${t.slug}`}
              className={`block text-center p-3 rounded-lg font-semibold transition-all ${
                t.featured
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-white border border-gray-200 text-primary-600 hover:border-primary-500 hover:bg-primary-50'
              }`}
            >
              {t.slug.toUpperCase()}
              {t.featured && <span className="block text-xs font-normal mt-0.5 opacity-80">nejoblíbenější</span>}
            </Link>
          ))}
        </div>
      </nav>

      {/* Srovnávací tabulka */}
      <section className="my-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Srovnání všech tlouštěk</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3 border border-gray-200 font-semibold">Tloušťka</th>
                <th className="text-left p-3 border border-gray-200 font-semibold">Hlavní použití</th>
                <th className="text-left p-3 border border-gray-200 font-semibold">Max. rozteč podpor</th>
                <th className="text-left p-3 border border-gray-200 font-semibold">Orientační cena/m²</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-gray-200"><Link href="/osb-desky/8mm" className="text-primary-600 font-medium hover:underline">8mm</Link></td>
                <td className="p-3 border border-gray-200">Obklady, dekorace</td>
                <td className="p-3 border border-gray-200">250 mm</td>
                <td className="p-3 border border-gray-200">120–200 Kč</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 border border-gray-200"><Link href="/osb-desky/12mm" className="text-primary-600 font-medium hover:underline">12mm</Link></td>
                <td className="p-3 border border-gray-200">Stěny, lehké příčky</td>
                <td className="p-3 border border-gray-200">400 mm</td>
                <td className="p-3 border border-gray-200">180–280 Kč</td>
              </tr>
              <tr>
                <td className="p-3 border border-gray-200"><Link href="/osb-desky/15mm" className="text-primary-600 font-medium hover:underline">15mm</Link></td>
                <td className="p-3 border border-gray-200">Stěny, střešní bednění</td>
                <td className="p-3 border border-gray-200">500 mm</td>
                <td className="p-3 border border-gray-200">220–340 Kč</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 border border-gray-200"><Link href="/osb-desky/16mm" className="text-primary-600 font-medium hover:underline">16mm</Link></td>
                <td className="p-3 border border-gray-200">Stěny, střešní bednění</td>
                <td className="p-3 border border-gray-200">550 mm</td>
                <td className="p-3 border border-gray-200">240–360 Kč</td>
              </tr>
              <tr className="bg-primary-50">
                <td className="p-3 border border-gray-200"><Link href="/osb-desky/18mm" className="text-primary-600 font-bold hover:underline">18mm ★</Link></td>
                <td className="p-3 border border-gray-200 font-medium">Podlahy, stropy, nosné stěny</td>
                <td className="p-3 border border-gray-200">600 mm</td>
                <td className="p-3 border border-gray-200">280–420 Kč</td>
              </tr>
              <tr>
                <td className="p-3 border border-gray-200"><Link href="/osb-desky/19mm" className="text-primary-600 font-medium hover:underline">19mm</Link></td>
                <td className="p-3 border border-gray-200">Podlahy, nosné konstrukce</td>
                <td className="p-3 border border-gray-200">625 mm</td>
                <td className="p-3 border border-gray-200">290–430 Kč</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 border border-gray-200"><Link href="/osb-desky/22mm" className="text-primary-600 font-medium hover:underline">22mm</Link></td>
                <td className="p-3 border border-gray-200">Těžké podlahy, garáže</td>
                <td className="p-3 border border-gray-200">700 mm</td>
                <td className="p-3 border border-gray-200">350–520 Kč</td>
              </tr>
              <tr>
                <td className="p-3 border border-gray-200"><Link href="/osb-desky/25mm" className="text-primary-600 font-medium hover:underline">25mm</Link></td>
                <td className="p-3 border border-gray-200">Speciální nosné konstrukce</td>
                <td className="p-3 border border-gray-200">800 mm</td>
                <td className="p-3 border border-gray-200">400–600 Kč</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">★ Nejprodávanější tloušťka na českém trhu</p>
      </section>

      {/* Rychlý průvodce */}
      <section className="my-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Rychlý průvodce – Kterou tloušťku potřebujete?</h2>

        <div className="space-y-4">
          <div className="p-5 bg-wood-50 rounded-lg border border-wood-200">
            <h3 className="font-bold text-gray-900 mb-2">Obklady a dekorace (nenosné)</h3>
            <p className="text-gray-600 text-sm mb-2">Obkládání stěn, dekorativní prvky, podhledové konstrukce, zadní stěny nábytku.</p>
            <p className="text-sm">Doporučená tloušťka: <Link href="/osb-desky/8mm" className="font-semibold text-primary-600 hover:underline">8mm</Link> – <Link href="/osb-desky/12mm" className="font-semibold text-primary-600 hover:underline">12mm</Link></p>
          </div>

          <div className="p-5 bg-wood-50 rounded-lg border border-wood-200">
            <h3 className="font-bold text-gray-900 mb-2">Stěny a lehké příčky</h3>
            <p className="text-gray-600 text-sm mb-2">Předělovací příčky, obklady stěn v interiéru, konstrukční plášť dřevostaveb.</p>
            <p className="text-sm">Doporučená tloušťka: <Link href="/osb-desky/12mm" className="font-semibold text-primary-600 hover:underline">12mm</Link> – <Link href="/osb-desky/15mm" className="font-semibold text-primary-600 hover:underline">15mm</Link></p>
          </div>

          <div className="p-5 bg-wood-50 rounded-lg border border-wood-200">
            <h3 className="font-bold text-gray-900 mb-2">Střešní bednění</h3>
            <p className="text-gray-600 text-sm mb-2">Podklad pod střešní krytinu, bednění pro plechovou střechu, tašky.</p>
            <p className="text-sm">Doporučená tloušťka: <Link href="/osb-desky/15mm" className="font-semibold text-primary-600 hover:underline">15mm</Link> (rozteč do 600mm) – <Link href="/osb-desky/18mm" className="font-semibold text-primary-600 hover:underline">18mm</Link> (rozteč do 1000mm)</p>
          </div>

          <div className="p-5 bg-primary-50 rounded-lg border border-primary-500">
            <h3 className="font-bold text-gray-900 mb-2">Podlahy v obytných prostorech</h3>
            <p className="text-gray-600 text-sm mb-2">Podlahy v rodinných domech, podkroví, bytech. Nejčastější použití OSB desek.</p>
            <p className="text-sm">Doporučená tloušťka: <Link href="/osb-desky/18mm" className="font-semibold text-primary-600 hover:underline">18mm</Link> (rozteč trámů do 600mm) – <Link href="/osb-desky/22mm" className="font-semibold text-primary-600 hover:underline">22mm</Link> (rozteč do 700mm)</p>
          </div>

          <div className="p-5 bg-wood-50 rounded-lg border border-wood-200">
            <h3 className="font-bold text-gray-900 mb-2">Garáže, dílny, průmyslové podlahy</h3>
            <p className="text-gray-600 text-sm mb-2">Prostory s těžkým provozem, pojezd vozidel, skladové prostory.</p>
            <p className="text-sm">Doporučená tloušťka: <Link href="/osb-desky/22mm" className="font-semibold text-primary-600 hover:underline">22mm</Link> – <Link href="/osb-desky/25mm" className="font-semibold text-primary-600 hover:underline">25mm</Link></p>
          </div>
        </div>
      </section>

      <HeurekaWidget position="middle" />

      {/* Všechny tloušťky – detailní články */}
      <section className="my-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Všechny tloušťky – detailní články</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {thicknesses.map((t) => (
            <Link
              key={t.slug}
              href={`/osb-desky/${t.slug}`}
              className={`block p-5 border rounded-lg hover:shadow-md transition-all ${
                t.featured
                  ? 'border-primary-500 bg-primary-50 hover:bg-primary-100'
                  : 'border-gray-200 hover:border-primary-500'
              }`}
            >
              <h3 className="font-bold text-gray-900 mb-1">{t.label}</h3>
              <p className="text-sm text-gray-600">{t.description}</p>
              {t.featured && <span className="inline-block mt-2 text-xs font-semibold text-primary-600">Nejoblíbenější volba</span>}
            </Link>
          ))}
        </div>
      </section>

      {/* Související kategorie */}
      <section className="my-10 pt-8 border-t border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Další kategorie OSB desek</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/osb-desky/vyuziti" className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-sm transition-all">
            <h3 className="font-semibold text-gray-900">Podle využití</h3>
            <p className="text-sm text-gray-500">Podlaha, strop, chata, garáž...</p>
          </Link>
          <Link href="/osb-desky/tipy" className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-sm transition-all">
            <h3 className="font-semibold text-gray-900">Tipy</h3>
            <p className="text-sm text-gray-500">S perodážkou, voděodolné, broušené...</p>
          </Link>
          <Link href="/osb-desky/prislusenstvi" className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-sm transition-all">
            <h3 className="font-semibold text-gray-900">Příslušenství</h3>
            <p className="text-sm text-gray-500">Lepidlo, vruty, nátěr, lak...</p>
          </Link>
          <Link href="/osb-desky/podle-rozmeru" className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-sm transition-all">
            <h3 className="font-semibold text-gray-900">Podle rozměrů</h3>
            <p className="text-sm text-gray-500">Standardní rozměry OSB desek</p>
          </Link>
          <Link href="/osb-desky/cena" className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-sm transition-all">
            <h3 className="font-semibold text-gray-900">Cena</h3>
            <p className="text-sm text-gray-500">Srovnání cen, nejlevnější nabídky</p>
          </Link>
          <Link href="/navody" className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-sm transition-all">
            <h3 className="font-semibold text-gray-900">Návody</h3>
            <p className="text-sm text-gray-500">Pokládka, montáž, nosnost...</p>
          </Link>
        </div>
      </section>

      <HeurekaWidget position="bottom" />
    </div>
  )
}
