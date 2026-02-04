export interface Product {
  id: string
  name: string
  description: string
  url: string
  imageUrl: string
  price: number
  priceFormatted: string
  category?: string
  manufacturer?: string
  size?: string
  params: Record<string, string>
}

export interface ProductFilter {
  category?: string
  categoryContains?: string
  size?: string
  sizeContains?: string
  maxProducts?: number
}
