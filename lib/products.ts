import { Product, ProductFilter } from '@/types/product'
import productsData from '@/data/products.json'

const products: Product[] = productsData as Product[]

export function getProducts(filter: ProductFilter = {}): Product[] {
  let filtered = [...products]

  // Filter by exact category
  if (filter.category) {
    filtered = filtered.filter(p => p.category && p.category === filter.category)
  }

  // Filter by category containing string
  if (filter.categoryContains) {
    const search = filter.categoryContains.toLowerCase()
    filtered = filtered.filter(p => p.category?.toLowerCase().includes(search))
  }

  // Filter by exact size
  if (filter.size) {
    filtered = filtered.filter(p => p.size === filter.size)
  }

  // Filter by size containing string (e.g., "18" matches "18 mm")
  if (filter.sizeContains) {
    const search = filter.sizeContains.toLowerCase()
    filtered = filtered.filter(p => p.size?.toLowerCase().includes(search))
  }

  // Sort by price (lowest first)
  filtered.sort((a, b) => a.price - b.price)

  // Limit number of products
  if (filter.maxProducts && filter.maxProducts > 0) {
    filtered = filtered.slice(0, filter.maxProducts)
  }

  return filtered
}

export function getProductsForArticle(category: string, slug: string): Product[] {
  const mapping = articleProductMapping[`${category}/${slug}`]
  if (!mapping) {
    // Default: return some OSB products
    return getProducts({ categoryContains: 'OSB', maxProducts: 4 })
  }

  const filtered = getProducts({ ...mapping, maxProducts: mapping.maxProducts || 6 })

  // Fallback to general OSB products if no specific size match
  if (filtered.length === 0 && mapping.categoryContains === 'OSB') {
    return getProducts({ categoryContains: 'OSB', maxProducts: 4 })
  }

  return filtered
}

// Mapping of article slugs to product filters
const articleProductMapping: Record<string, ProductFilter> = {
  // OSB podle tloušťky
  'osb-desky/8mm': { sizeContains: '8', categoryContains: 'OSB', maxProducts: 6 },
  'osb-desky/12mm': { sizeContains: '12', categoryContains: 'OSB', maxProducts: 6 },
  'osb-desky/15mm': { sizeContains: '15', categoryContains: 'OSB', maxProducts: 6 },
  'osb-desky/16mm': { sizeContains: '16', categoryContains: 'OSB', maxProducts: 6 },
  'osb-desky/18mm': { sizeContains: '18', categoryContains: 'OSB', maxProducts: 6 },
  'osb-desky/19mm': { sizeContains: '19', categoryContains: 'OSB', maxProducts: 6 },
  'osb-desky/22mm': { sizeContains: '22', categoryContains: 'OSB', maxProducts: 6 },
  'osb-desky/25mm': { sizeContains: '25', categoryContains: 'OSB', maxProducts: 6 },

  // OSB využití - obecně všechny OSB
  'osb-desky/podlaha': { categoryContains: 'OSB', maxProducts: 6 },
  'osb-desky/strop': { categoryContains: 'OSB', maxProducts: 6 },
  'osb-desky/steny': { categoryContains: 'OSB', maxProducts: 6 },

  // Další typy desek
  'dalsi-typy-desek/biodeska': { categoryContains: 'Biodesk', maxProducts: 6 },
  'dalsi-typy-desek/durelis': { categoryContains: 'Durelis', maxProducts: 6 },

  // Návody - obecně OSB
  'navody/pokladka': { categoryContains: 'OSB', maxProducts: 4 },
}
