export interface Article {
  slug: string
  title: string
  description: string
  category: 'osb-desky' | 'navody' | 'dalsi-typy-desek'
  subcategory?: string
  keywords: string[]
  relatedArticles?: string[]
  publishedAt: string
  updatedAt?: string
  heurekaWidget?: string
  heurekaPositionId?: string
  heurekaCategoryId?: string
  heurekaCategoryFilters?: string
}

export interface BreadcrumbItem {
  label: string
  href: string
}

export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

export interface SearchResult {
  slug: string
  title: string
  description: string
  category: string
  url: string
}
