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

    // Use exact Heureka template structure with custom styling
    const widgetHtml = `
      <div class="heureka-affiliate-category" data-trixam-positionid="${positionId}" data-trixam-categoryid="${categoryId}" data-trixam-categoryfilters="${categoryFilters}" data-trixam-codetype="plainhtml" data-trixam-linktarget="top">
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <div data-trixam-databind="ifdef: ProductAdverts[0]" class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all">
            <a href="#" data-trixam-databind="target: LinkTarget, href: ProductAdverts[0].ClickUrl" class="block">
              <div class="aspect-square bg-gray-100 flex items-center justify-center p-2">
                <img data-trixam-databind="src: ProductAdverts[0].Product.PreviewImage" src="" class="max-w-full max-h-full object-contain">
              </div>
              <div class="p-3">
                <div class="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem] mb-2" data-trixam-databind="text: ProductAdverts[0].Product.Title"></div>
                <div class="text-lg font-bold text-primary-600"><span data-trixam-databind="text: ProductAdverts[0].Product.PriceMinString"></span> <span data-trixam-databind="text: Currency"></span></div>
              </div>
            </a>
          </div>
          <div data-trixam-databind="ifdef: ProductAdverts[1]" class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all">
            <a href="#" data-trixam-databind="target: LinkTarget, href: ProductAdverts[1].ClickUrl" class="block">
              <div class="aspect-square bg-gray-100 flex items-center justify-center p-2">
                <img data-trixam-databind="src: ProductAdverts[1].Product.PreviewImage" src="" class="max-w-full max-h-full object-contain">
              </div>
              <div class="p-3">
                <div class="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem] mb-2" data-trixam-databind="text: ProductAdverts[1].Product.Title"></div>
                <div class="text-lg font-bold text-primary-600"><span data-trixam-databind="text: ProductAdverts[1].Product.PriceMinString"></span> <span data-trixam-databind="text: Currency"></span></div>
              </div>
            </a>
          </div>
          <div data-trixam-databind="ifdef: ProductAdverts[2]" class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all">
            <a href="#" data-trixam-databind="target: LinkTarget, href: ProductAdverts[2].ClickUrl" class="block">
              <div class="aspect-square bg-gray-100 flex items-center justify-center p-2">
                <img data-trixam-databind="src: ProductAdverts[2].Product.PreviewImage" src="" class="max-w-full max-h-full object-contain">
              </div>
              <div class="p-3">
                <div class="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem] mb-2" data-trixam-databind="text: ProductAdverts[2].Product.Title"></div>
                <div class="text-lg font-bold text-primary-600"><span data-trixam-databind="text: ProductAdverts[2].Product.PriceMinString"></span> <span data-trixam-databind="text: Currency"></span></div>
              </div>
            </a>
          </div>
          <div data-trixam-databind="ifdef: ProductAdverts[3]" class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all">
            <a href="#" data-trixam-databind="target: LinkTarget, href: ProductAdverts[3].ClickUrl" class="block">
              <div class="aspect-square bg-gray-100 flex items-center justify-center p-2">
                <img data-trixam-databind="src: ProductAdverts[3].Product.PreviewImage" src="" class="max-w-full max-h-full object-contain">
              </div>
              <div class="p-3">
                <div class="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem] mb-2" data-trixam-databind="text: ProductAdverts[3].Product.Title"></div>
                <div class="text-lg font-bold text-primary-600"><span data-trixam-databind="text: ProductAdverts[3].Product.PriceMinString"></span> <span data-trixam-databind="text: Currency"></span></div>
              </div>
            </a>
          </div>
        </div>
      </div>
    `

    containerRef.current.innerHTML = widgetHtml

    // Load trixam script after HTML is in DOM
    const loadScript = () => {
      const scriptId = 'heureka-trixam-script'
      const existingScript = document.getElementById(scriptId)

      if (existingScript) {
        existingScript.remove()
      }

      const script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://serve.affiliate.heureka.cz/js/trixam.min.js'
      script.async = true
      document.body.appendChild(script)
    }

    // Small delay to ensure DOM is ready
    setTimeout(loadScript, 100)
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
