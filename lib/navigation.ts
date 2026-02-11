import { NavItem } from '@/types'

export const mainNavigation: NavItem[] = [
  {
    label: 'OSB desky',
    href: '/osb-desky',
    children: [
      { label: 'Podle sily', href: '/osb-desky/podle-silly' },
      { label: 'Podle rozmeru', href: '/osb-desky/podle-rozmeru' },
      { label: 'Vyuziti', href: '/osb-desky/vyuziti' },
      { label: 'Tipy', href: '/osb-desky/tipy' },
      { label: 'Prislusenstvi', href: '/osb-desky/prislusenstvi' },
      { label: 'Dodavatele', href: '/osb-desky/dodavatele' },
      { label: 'Cena', href: '/osb-desky/cena' },
      { label: 'Lokalita', href: '/osb-desky/lokalita' },
    ],
  },
  {
    label: 'Barvy a laky',
    href: '/barvy-a-laky',
    children: [
      { label: 'Barvy na zeď', href: '/barvy-a-laky/barvy-na-zed' },
      { label: 'Barvy na dřevo', href: '/barvy-a-laky/barvy-na-drevo' },
      { label: 'Barvy na kov', href: '/barvy-a-laky/barvy-na-kov' },
      { label: 'Interiéry', href: '/barvy-a-laky/barvy-a-laky-na-interiery' },
      { label: 'Exteriéry', href: '/barvy-a-laky/barvy-a-laky-na-exteriery' },
      { label: 'Ostatní', href: '/barvy-a-laky/ostatni-barvy' },
      { label: 'Podle značek', href: '/barvy-a-laky/podle-znacek' },
    ],
  },
  { label: 'Navody', href: '/navody' },
  { label: 'Dalsi typy desek', href: '/dalsi-typy-desek' },
]

export const categoryMap: Record<string, { label: string; subcategories: { slug: string; label: string }[] }> = {
  'podle-silly': {
    label: 'Podle sily',
    subcategories: [
      { slug: '8mm', label: 'OSB desky 8mm' },
      { slug: '12mm', label: 'OSB desky 12mm' },
      { slug: '15mm', label: 'OSB desky 15mm' },
      { slug: '16mm', label: 'OSB desky 16mm' },
      { slug: '18mm', label: 'OSB desky 18mm' },
      { slug: '19mm', label: 'OSB desky 19mm' },
      { slug: '22mm', label: 'OSB desky 22mm' },
      { slug: '25mm', label: 'OSB desky 25mm' },
    ],
  },
  'podle-rozmeru': {
    label: 'Podle rozmeru',
    subcategories: [
      { slug: '2500x1250', label: 'OSB desky 2500 x 1250mm' },
    ],
  },
  'vyuziti': {
    label: 'Vyuziti',
    subcategories: [
      { slug: 'podlaha', label: 'Podlaha z OSB desek' },
      { slug: 'terarium', label: 'Terarium z OSB desek' },
      { slug: 'steny', label: 'Steny z OSB desek' },
      { slug: 'skrin', label: 'Skrin z OSB desek' },
      { slug: 'strop', label: 'OSB desky na strop' },
      { slug: 'chata', label: 'Chata z OSB desek' },
      { slug: 'podkrovi', label: 'Podkrovi z OSB desek' },
      { slug: 'terasa', label: 'Terasa z OSB desek' },
      { slug: 'garaz', label: 'Garaz z OSB desek' },
    ],
  },
  'tipy': {
    label: 'Tipy',
    subcategories: [
      { slug: 's-perodrazkou', label: 'OSB desky s perodrazkou' },
      { slug: 'vodeodolne', label: 'Vodeodolna OSB deska' },
      { slug: 'brousene', label: 'Brousene OSB desky' },
      { slug: 'venkovni', label: 'OSB desky venkovni pouziti' },
    ],
  },
  'prislusenstvi': {
    label: 'Prislusenstvi',
    subcategories: [
      { slug: 'adhezni-mustek', label: 'Adhezni mustek na OSB' },
      { slug: 'lepidlo', label: 'Lepidlo na OSB desky' },
      { slug: 'krocejova-izolace', label: 'Krocejova izolace pod OSB' },
      { slug: 'nater', label: 'Nater na OSB desky' },
      { slug: 'barva', label: 'Barva na OSB desky' },
      { slug: 'lak', label: 'Lak na OSB desky' },
      { slug: 'nivelace', label: 'Nivelace na OSB desky' },
      { slug: 'vruty', label: 'Vruty do OSB' },
    ],
  },
  'dodavatele': {
    label: 'Dodavatele',
    subcategories: [
      { slug: 'dek', label: 'OSB desky DEK' },
    ],
  },
  'cena': {
    label: 'Cena',
    subcategories: [
      { slug: 'nejlevnejsi', label: 'Nejlevnejsi OSB desky' },
    ],
  },
  'lokalita': {
    label: 'Lokalita',
    subcategories: [
      { slug: 'praha', label: 'OSB desky Praha' },
      { slug: 'brno', label: 'OSB desky Brno' },
    ],
  },
}

export const navodyArticles = [
  { slug: 'pokladka-na-prkna', label: 'Pokladka OSB desek na prkna' },
  { slug: 'pokladka', label: 'Pokladka OSB desek' },
  { slug: 'hmotnost', label: 'OSB desky hmotnost' },
  { slug: 'nosnost', label: 'OSB desky nosnost' },
  { slug: 'montaz-na-strop', label: 'Montaz OSB desek na strop' },
  { slug: 'v-interieru', label: 'OSB desky v interieru' },
  { slug: 'fasada', label: 'Fasada na OSB desky' },
  { slug: 'montaz-polystyrenu', label: 'Montaz polystyrenu na OSB desky' },
  { slug: 'bedneni-vence', label: 'Bedneni vence OSB' },
  { slug: 'omitka', label: 'Vnitrni omitka na OSB desky' },
]

export function allOsbArticleSlugs(): string[] {
  const slugs: string[] = []
  for (const cat of Object.values(categoryMap)) {
    for (const sub of cat.subcategories) {
      slugs.push(sub.slug)
    }
  }
  return slugs
}

export const dalsiTypyDesekArticles = [
  { slug: 'durelis', label: 'Durelis desky' },
  { slug: 'durelis-12mm', label: 'Durelis desky 12mm' },
  { slug: 'durelis-15mm', label: 'Durelis desky 15mm' },
  { slug: 'durelis-18mm', label: 'Durelis desky 18mm' },
  { slug: 'durelis-cena', label: 'Durelis desky cena' },
  { slug: 'biodeska', label: 'Biodeska' },
]
