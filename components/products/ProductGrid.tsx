import Image from 'next/image'
import { Product } from '@/types/product'

interface ProductGridProps {
  products: Product[]
  title?: string
}

function getAffiliateUrl(originalUrl: string): string {
  try {
    const url = new URL(originalUrl)
    url.search = '?utm_source=am&a_aid=6981ed6919510&a_bid=6ba10177'
    return url.toString()
  } catch {
    const baseUrl = originalUrl.split('?')[0]
    return baseUrl + '?utm_source=am&a_aid=6981ed6919510&a_bid=6ba10177'
  }
}

export default function ProductGrid({ products, title = 'Doporučené produkty' }: ProductGridProps) {
  if (products.length === 0) {
    return null
  }

  const displayProducts = products.slice(0, 4)

  return (
    <section className="my-6 py-4 px-4 bg-wood-50 rounded-lg border border-wood-200">
      <h2 className="text-lg font-bold text-gray-900 mb-4">{title}</h2>
      {/* Desktop: table layout */}
      <div className="hidden sm:block">
        <table className="w-full border-collapse">
          <tbody>
            {displayProducts.map((product, index) => (
              <tr
                key={product.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="w-[70px] text-center py-2.5 px-2 align-middle">
                  <span className="inline-block bg-amber-500 text-white text-[11px] font-bold px-2 py-0.5 rounded whitespace-nowrap">
                    TOP {index + 1}
                  </span>
                </td>
                <td className="w-16 text-center py-2.5 px-2 align-middle">
                  <a href={getAffiliateUrl(product.url)} target="_blank" rel="noopener noreferrer nofollow" className="block">
                    {product.imageUrl ? (
                      <Image src={product.imageUrl} alt={product.name} width={56} height={56} className="w-14 h-14 object-contain rounded bg-gray-100 mx-auto" />
                    ) : (
                      <div className="w-14 h-14 bg-gray-100 rounded flex items-center justify-center mx-auto">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </a>
                </td>
                <td className="py-2.5 px-2 align-middle">
                  <a href={getAffiliateUrl(product.url)} target="_blank" rel="noopener noreferrer nofollow" className="text-[13px] font-medium text-gray-900 hover:text-green-600 hover:underline">
                    {product.name}
                  </a>
                  {product.size && <span className="block text-xs text-gray-500 mt-0.5">{product.size}</span>}
                </td>
                <td className="w-[120px] whitespace-nowrap py-2.5 px-2 align-middle">
                  <span className="text-[14px] font-bold text-green-600">{product.priceFormatted}</span>
                </td>
                <td className="w-[140px] text-center py-2.5 px-2 align-middle">
                  <a href={getAffiliateUrl(product.url)} target="_blank" rel="noopener noreferrer nofollow" className="inline-block px-3.5 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-md hover:bg-green-700 transition-colors whitespace-nowrap">
                    Koupit
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile: stacked cards */}
      <div className="sm:hidden space-y-3">
        {displayProducts.map((product, index) => (
          <a
            key={product.id}
            href={getAffiliateUrl(product.url)}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="flex items-center gap-3 p-2 border-b border-gray-200"
          >
            <span className="inline-block bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">
              {index + 1}
            </span>
            {product.imageUrl ? (
              <Image src={product.imageUrl} alt={product.name} width={44} height={44} className="w-11 h-11 object-contain rounded bg-gray-100 shrink-0" />
            ) : (
              <div className="w-11 h-11 bg-gray-100 rounded flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-900 line-clamp-2">{product.name}</div>
              <div className="text-sm font-bold text-green-600 mt-0.5">{product.priceFormatted}</div>
            </div>
            <span className="text-[10px] font-semibold text-green-600 shrink-0">Koupit</span>
          </a>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-3 text-center">
        Ceny jsou uvedeny včetně DPH. Kliknutím přejdete na e-shop partnera.
      </p>
    </section>
  )
}
