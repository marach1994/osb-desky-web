import { Product } from '@/types/product'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: Product[]
  title?: string
}

export default function ProductGrid({ products, title = 'Doporučené produkty' }: ProductGridProps) {
  if (products.length === 0) {
    return null
  }

  return (
    <section className="my-10 py-8 px-6 bg-wood-50 rounded-xl border border-wood-200">
      <h2 className="text-xl font-bold text-gray-900 mb-6">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-4 text-center">
        Ceny jsou uvedeny včetně DPH. Kliknutím přejdete na e-shop partnera.
      </p>
    </section>
  )
}
