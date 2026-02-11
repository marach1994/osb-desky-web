import ProductCard from '@/components/products/ProductCard'
import { Product } from '@/types/product'

interface ProductGridWidgetProps {
  products: Product[]
  title?: string
}

export default function ProductGridWidget({
  products,
  title = 'Produkty od partnerů',
}: ProductGridWidgetProps) {
  if (!products || products.length === 0) {
    return null
  }

  return (
    <section className="my-6 py-4 px-4 bg-amber-50 rounded-lg border border-amber-200 not-prose">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-3 text-center">
        Ceny jsou uvedeny včetně DPH. Kliknutím přejdete na e-shop partnera.
      </p>
    </section>
  )
}
