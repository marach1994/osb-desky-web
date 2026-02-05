import Image from 'next/image'
import { Product } from '@/types/product'

interface ProductCardProps {
  product: Product
}

function getAffiliateUrl(originalUrl: string): string {
  try {
    const url = new URL(originalUrl)
    // Remove all existing query params and add only affiliate params
    url.search = '?utm_source=am&a_aid=6981ed6919510&a_bid=6ba10177'
    return url.toString()
  } catch {
    const baseUrl = originalUrl.split('?')[0]
    return baseUrl + '?utm_source=am&a_aid=6981ed6919510&a_bid=6ba10177'
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <a
      href={getAffiliateUrl(product.url)}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-primary-500 transition-all group"
    >
      <div className="aspect-square relative bg-gray-100">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain p-2 group-hover:scale-105 transition-transform"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem] mb-2">
          {product.name}
        </h3>
        {product.size && (
          <p className="text-xs text-gray-500 mb-1">{product.size}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary-600">{product.priceFormatted}</span>
          <span className="text-xs text-primary-600 font-medium group-hover:underline">
            Koupit →
          </span>
        </div>
      </div>
    </a>
  )
}
