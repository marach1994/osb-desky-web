import { XMLParser } from 'fast-xml-parser'
import { Product } from '@/types/product'

const FEED_URL = 'https://feeds.mergado.com/artisan-cz-heureka-cz-59803522edbd6cdcb83e9d2e31ee8f8d.xml'

interface FeedItem {
  ITEM_ID: string
  PRODUCTNAME: string
  DESCRIPTION?: string
  URL: string
  IMGURL?: string
  PRICE_VAT: string
  CATEGORYTEXT: string
  MANUFACTURER?: string
  PARAM?: Array<{ PARAM_NAME: string; VAL: string }> | { PARAM_NAME: string; VAL: string }
}

interface FeedData {
  SHOP: {
    SHOPITEM: FeedItem[]
  }
}

function parseParams(params: FeedItem['PARAM']): Record<string, string> {
  if (!params) return {}
  const paramArray = Array.isArray(params) ? params : [params]
  const result: Record<string, string> = {}
  for (const p of paramArray) {
    if (p.PARAM_NAME && p.VAL) {
      result[p.PARAM_NAME] = p.VAL
    }
  }
  return result
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export async function fetchFeed(): Promise<Product[]> {
  const response = await fetch(FEED_URL)
  const xml = await response.text()

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
  })

  const data: FeedData = parser.parse(xml)
  const items = data.SHOP?.SHOPITEM || []

  return items.map((item): Product => {
    const params = parseParams(item.PARAM)
    const price = parseFloat(item.PRICE_VAT) || 0

    return {
      id: item.ITEM_ID,
      name: item.PRODUCTNAME,
      description: item.DESCRIPTION || '',
      url: item.URL,
      imageUrl: item.IMGURL || '',
      price,
      priceFormatted: formatPrice(price),
      category: item.CATEGORYTEXT,
      manufacturer: item.MANUFACTURER || params['Výrobce'],
      size: params['síla'] || params['Tloušťka'] || params['Rozměr'],
      params,
    }
  })
}
