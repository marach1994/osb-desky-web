import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-wood-700 text-wood-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-white text-lg mb-3">OSB-desky.cz</h3>
            <p className="text-sm text-wood-200">
              Kompletni pruvodce svetem OSB desek. Vlastnosti, pouziti, ceny a navody na jednom miste.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Kategorie</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/osb-desky" className="hover:text-white">OSB desky</Link></li>
              <li><Link href="/navody" className="hover:text-white">Navody</Link></li>
              <li><Link href="/dalsi-typy-desek" className="hover:text-white">Dalsi typy desek</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Oblibene clanky</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/osb-desky/18mm" className="hover:text-white">OSB desky 18mm</Link></li>
              <li><Link href="/osb-desky/podlaha" className="hover:text-white">Podlaha z OSB</Link></li>
              <li><Link href="/navody/pokladka" className="hover:text-white">Pokladka OSB desek</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-wood-500 mt-8 pt-8 text-center text-sm text-wood-200">
          &copy; {new Date().getFullYear()} OSB-desky.cz. Vsechna prava vyhrazena.
        </div>
      </div>
    </footer>
  )
}
