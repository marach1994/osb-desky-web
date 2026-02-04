'use client'

import { useEffect, useRef } from 'react'

interface HeurekaProductGridProps {
  positionId: string
  categoryId: string
  categoryFilters?: string
  title?: string
}

export default function HeurekaProductGrid({
  positionId,
  categoryId,
  categoryFilters = '',
  title = 'Doporučené produkty',
}: HeurekaProductGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Create the widget HTML exactly as Heureka expects
    const widgetHtml = `
      <div class="heureka-affiliate-category" data-trixam-positionid="${positionId}" data-trixam-categoryid="${categoryId}" data-trixam-categoryfilters="${categoryFilters}" data-trixam-codetype="plainhtml" data-trixam-linktarget="top">
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          ${[0, 1, 2, 3, 4, 5].map(i => `
            <div data-trixam-databind="ifdef: ProductAdverts[${i}]" class="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-primary-500 transition-all group">
              <a href="#" data-trixam-databind="target: LinkTarget, href: ProductAdverts[${i}].ClickUrl" class="block">
                <div class="aspect-square relative bg-gray-100 overflow-hidden">
                  <img data-trixam-databind="src: ProductAdverts[${i}].Product.PreviewImage" src="" alt="" class="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform">
                </div>
                <div class="p-3">
                  <h3 class="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem] mb-2">
                    <span data-trixam-databind="text: ProductAdverts[${i}].Product.Title"></span>
                  </h3>
                  <div class="flex items-center justify-between">
                    <span class="text-lg font-bold text-primary-600">
                      <span data-trixam-databind="text: ProductAdverts[${i}].Product.PriceMinString"></span>
                      <span class="text-sm ml-1" data-trixam-databind="text: Currency"></span>
                    </span>
                    <span class="text-xs text-primary-600 font-medium group-hover:underline">Koupit →</span>
                  </div>
                </div>
              </a>
            </div>
          `).join('')}
        </div>
      </div>
    `

    containerRef.current.innerHTML = widgetHtml

    // Load trixam script
    const scriptId = 'heureka-trixam-script'
    const existingScript = document.getElementById(scriptId)

    if (!existingScript) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://serve.affiliate.heureka.cz/js/trixam.min.js'
      script.async = true
      document.body.appendChild(script)
    }
  }, [positionId, categoryId, categoryFilters])

  return (
    <section className="my-10 py-8 px-6 bg-wood-50 rounded-xl border border-wood-200">
      <h2 className="text-xl font-bold text-gray-900 mb-6">{title}</h2>
      <div ref={containerRef}></div>
      <p className="text-xs text-gray-400 mt-4 text-center">
        Ceny jsou uvedeny včetně DPH. Kliknutím přejdete na Heureka.cz.
      </p>
    </section>
  )
}
