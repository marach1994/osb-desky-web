import Link from 'next/link'
import type { Metadata } from 'next'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import HeurekaWidget from '@/components/affiliate/HeurekaWidget'
import { generateCategoryMetadata } from '@/lib/seo'

export const metadata: Metadata = generateCategoryMetadata(
  'OSB desky podle sily - Pruvodce vyberem spravne tloustky',
  'Jak vybrat spravnou tloustku OSB desky? Porovnani desek 8mm az 25mm, pouziti, nosnost a doporuceni pro kazdou tloustku.',
  '/osb-desky/podle-silly'
)

const thicknesses = [
  {
    slug: '8mm',
    label: 'OSB desky 8mm',
    description: 'Nejtensi varianta. Lehke obklady, dekorace, podhledove konstrukce. Neni vhodna pro nosne ucely.',
  },
  {
    slug: '12mm',
    label: 'OSB desky 12mm',
    description: 'Obklady sten, lehke pricky, stresni bedneni pri male rozteci krokvi. Vhodna jako podklad na pevny povrch.',
  },
  {
    slug: '15mm',
    label: 'OSB desky 15mm',
    description: 'Steny, lehke podlahy na pevnem podkladu, stresni bedneni. Univerzalni volba pro nenosne konstrukce.',
  },
  {
    slug: '16mm',
    label: 'OSB desky 16mm',
    description: 'Podobne jako 15mm s mirne vyssi nosnosti. Steny drevosteveb, stresni bedneni, lehke podlahy.',
  },
  {
    slug: '18mm',
    label: 'OSB desky 18mm',
    description: 'Nejprodavanejsi tloustka. Podlahy v obytnych prostorech, stresni bedneni, nosne steny. Zlaty standard.',
    featured: true,
  },
  {
    slug: '19mm',
    label: 'OSB desky 19mm',
    description: 'Mirne silnejsi alternativa k 18mm. Podlahy, stropy, nosne konstrukce. Mene bezne dostupna.',
  },
  {
    slug: '22mm',
    label: 'OSB desky 22mm',
    description: 'Tezke podlahy, garaze s pojezdem, vetsi roztece tramu. Pro narocnejsi zatizeni a prumyslove prostory.',
  },
  {
    slug: '25mm',
    label: 'OSB desky 25mm',
    description: 'Nejsilnejsi bezna varianta. Specialni nosne konstrukce, extremni zatizeni, prumyslove podlahy.',
  },
]

export default function PodleSilyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumbs items={[
        { label: 'OSB desky', href: '/osb-desky' },
        { label: 'Podle sily', href: '/osb-desky/podle-silly' },
      ]} />

      <h1 className="text-3xl font-bold text-gray-900 mb-4">OSB desky podle sily - Jak vybrat spravnou tloustku</h1>

      <p className="text-gray-600 mb-6 text-lg">
        Vyber spravne tloustky OSB desky je klicovy pro uspech vaseho projektu. Prilis tenna deska se bude prohybat a vrzat, zbytecne silna zase prodrazí stavbu. Nize najdete prehled vsech beznych tlousted a doporuceni, kterou zvolit.
      </p>

      <HeurekaWidget position="top" />

      {/* Quick guide */}
      <section className="my-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Rychly pruvodce - Kterou tloustku potrebujete?</h2>

        <div className="space-y-4">
          <div className="p-5 bg-wood-50 rounded-lg border border-wood-200">
            <h3 className="font-bold text-gray-900 mb-2">Obklady a dekorace (nenosne)</h3>
            <p className="text-gray-600 text-sm mb-2">Obkladani sten, dekorativni prvky, podhledove konstrukce, zadni steny nabytku.</p>
            <p className="text-sm">Doporucena tloustka: <Link href="/osb-desky/8mm" className="font-semibold text-primary-600 hover:underline">8mm</Link> – <Link href="/osb-desky/12mm" className="font-semibold text-primary-600 hover:underline">12mm</Link></p>
          </div>

          <div className="p-5 bg-wood-50 rounded-lg border border-wood-200">
            <h3 className="font-bold text-gray-900 mb-2">Steny a lehke pricky</h3>
            <p className="text-gray-600 text-sm mb-2">Predelovaci pricky, obklady sten v interieru, konstrukcni plast drevosteveb.</p>
            <p className="text-sm">Doporucena tloustka: <Link href="/osb-desky/12mm" className="font-semibold text-primary-600 hover:underline">12mm</Link> – <Link href="/osb-desky/15mm" className="font-semibold text-primary-600 hover:underline">15mm</Link></p>
          </div>

          <div className="p-5 bg-wood-50 rounded-lg border border-wood-200">
            <h3 className="font-bold text-gray-900 mb-2">Stresni bedneni</h3>
            <p className="text-gray-600 text-sm mb-2">Podklad pod stresni krytinu, bedneni pro plechovou strechu, taseky.</p>
            <p className="text-sm">Doporucena tloustka: <Link href="/osb-desky/15mm" className="font-semibold text-primary-600 hover:underline">15mm</Link> (roztec do 600mm) – <Link href="/osb-desky/18mm" className="font-semibold text-primary-600 hover:underline">18mm</Link> (roztec do 1000mm)</p>
          </div>

          <div className="p-5 bg-primary-50 rounded-lg border border-primary-500">
            <h3 className="font-bold text-gray-900 mb-2">Podlahy v obytnych prostorech</h3>
            <p className="text-gray-600 text-sm mb-2">Podlahy v rodinnych domech, podkrovi, bytech. Nejcastejsi pouziti OSB desek.</p>
            <p className="text-sm">Doporucena tloustka: <Link href="/osb-desky/18mm" className="font-semibold text-primary-600 hover:underline">18mm</Link> (roztec tramu do 600mm) – <Link href="/osb-desky/22mm" className="font-semibold text-primary-600 hover:underline">22mm</Link> (roztec do 700mm)</p>
          </div>

          <div className="p-5 bg-wood-50 rounded-lg border border-wood-200">
            <h3 className="font-bold text-gray-900 mb-2">Garaze, dilny, prumyslove podlahy</h3>
            <p className="text-gray-600 text-sm mb-2">Prostory s tezkym provozem, pojezd vozidel, skladove prostory.</p>
            <p className="text-sm">Doporucena tloustka: <Link href="/osb-desky/22mm" className="font-semibold text-primary-600 hover:underline">22mm</Link> – <Link href="/osb-desky/25mm" className="font-semibold text-primary-600 hover:underline">25mm</Link></p>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="my-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Srovnani vsech tlousted</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3 border border-gray-200 font-semibold">Tloustka</th>
                <th className="text-left p-3 border border-gray-200 font-semibold">Hlavni pouziti</th>
                <th className="text-left p-3 border border-gray-200 font-semibold">Max. roztec podpor</th>
                <th className="text-left p-3 border border-gray-200 font-semibold">Orientacni cena/m²</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-gray-200"><Link href="/osb-desky/8mm" className="text-primary-600 font-medium hover:underline">8mm</Link></td>
                <td className="p-3 border border-gray-200">Obklady, dekorace</td>
                <td className="p-3 border border-gray-200">250 mm</td>
                <td className="p-3 border border-gray-200">120–200 Kc</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 border border-gray-200"><Link href="/osb-desky/12mm" className="text-primary-600 font-medium hover:underline">12mm</Link></td>
                <td className="p-3 border border-gray-200">Steny, lehke pricky</td>
                <td className="p-3 border border-gray-200">400 mm</td>
                <td className="p-3 border border-gray-200">180–280 Kc</td>
              </tr>
              <tr>
                <td className="p-3 border border-gray-200"><Link href="/osb-desky/15mm" className="text-primary-600 font-medium hover:underline">15mm</Link></td>
                <td className="p-3 border border-gray-200">Steny, stresni bedneni</td>
                <td className="p-3 border border-gray-200">500 mm</td>
                <td className="p-3 border border-gray-200">220–340 Kc</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 border border-gray-200"><Link href="/osb-desky/16mm" className="text-primary-600 font-medium hover:underline">16mm</Link></td>
                <td className="p-3 border border-gray-200">Steny, stresni bedneni</td>
                <td className="p-3 border border-gray-200">550 mm</td>
                <td className="p-3 border border-gray-200">240–360 Kc</td>
              </tr>
              <tr className="bg-primary-50">
                <td className="p-3 border border-gray-200"><Link href="/osb-desky/18mm" className="text-primary-600 font-bold hover:underline">18mm ★</Link></td>
                <td className="p-3 border border-gray-200 font-medium">Podlahy, stropy, nosne steny</td>
                <td className="p-3 border border-gray-200">600 mm</td>
                <td className="p-3 border border-gray-200">280–420 Kc</td>
              </tr>
              <tr>
                <td className="p-3 border border-gray-200"><Link href="/osb-desky/19mm" className="text-primary-600 font-medium hover:underline">19mm</Link></td>
                <td className="p-3 border border-gray-200">Podlahy, nosne konstrukce</td>
                <td className="p-3 border border-gray-200">625 mm</td>
                <td className="p-3 border border-gray-200">290–430 Kc</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 border border-gray-200"><Link href="/osb-desky/22mm" className="text-primary-600 font-medium hover:underline">22mm</Link></td>
                <td className="p-3 border border-gray-200">Tezke podlahy, garaze</td>
                <td className="p-3 border border-gray-200">700 mm</td>
                <td className="p-3 border border-gray-200">350–520 Kc</td>
              </tr>
              <tr>
                <td className="p-3 border border-gray-200"><Link href="/osb-desky/25mm" className="text-primary-600 font-medium hover:underline">25mm</Link></td>
                <td className="p-3 border border-gray-200">Specialni nosne konstrukce</td>
                <td className="p-3 border border-gray-200">800 mm</td>
                <td className="p-3 border border-gray-200">400–600 Kc</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">★ Nejprodavanejsi tloustka na ceskem trhu</p>
      </section>

      <HeurekaWidget position="middle" />

      {/* All thicknesses */}
      <section className="my-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Vsechny tloustky - detailni clanky</h2>
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
              {t.featured && <span className="inline-block mt-2 text-xs font-semibold text-primary-600">Nejoblibenejsi volba</span>}
            </Link>
          ))}
        </div>
      </section>

      {/* Related categories */}
      <section className="my-10 pt-8 border-t border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Dalsi kategorie OSB desek</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/osb-desky/vyuziti" className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-sm transition-all">
            <h3 className="font-semibold text-gray-900">Podle vyuziti</h3>
            <p className="text-sm text-gray-500">Podlaha, strop, chata, garaz...</p>
          </Link>
          <Link href="/osb-desky/tipy" className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-sm transition-all">
            <h3 className="font-semibold text-gray-900">Tipy</h3>
            <p className="text-sm text-gray-500">S perodrazkou, vodeodolne, brousene...</p>
          </Link>
          <Link href="/osb-desky/prislusenstvi" className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-sm transition-all">
            <h3 className="font-semibold text-gray-900">Prislusenstvi</h3>
            <p className="text-sm text-gray-500">Lepidlo, vruty, nater, lak...</p>
          </Link>
          <Link href="/osb-desky/podle-rozmeru" className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-sm transition-all">
            <h3 className="font-semibold text-gray-900">Podle rozmeru</h3>
            <p className="text-sm text-gray-500">Standardni rozmery OSB desek</p>
          </Link>
          <Link href="/osb-desky/cena" className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-sm transition-all">
            <h3 className="font-semibold text-gray-900">Cena</h3>
            <p className="text-sm text-gray-500">Srovnani cen, nejlevnejsi nabidky</p>
          </Link>
          <Link href="/navody" className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-sm transition-all">
            <h3 className="font-semibold text-gray-900">Navody</h3>
            <p className="text-sm text-gray-500">Pokladka, montaz, nosnost...</p>
          </Link>
        </div>
      </section>

      <HeurekaWidget position="bottom" />
    </div>
  )
}
