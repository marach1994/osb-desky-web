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

    // Exact Heureka structure - products must be wrapped in container div
    const productTemplate = (i: number) => `
      <div data-trixam-databind="ifdef: ProductAdverts[${i}]" class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all">
        <a href="#" data-trixam-databind="target: LinkTarget, href: ProductAdverts[${i}].ClickUrl" class="block">
          <div class="aspect-square bg-gray-100 flex items-center justify-center p-2">
            <img data-trixam-databind="src: ProductAdverts[${i}].Product.PreviewImage" src="" width="150" height="150" class="max-w-full max-h-full object-contain">
          </div>
          <div class="p-3">
            <div class="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem] mb-2"><span data-trixam-databind="text: ProductAdverts[${i}].Product.Title"></span></div>
            <div class="text-lg font-bold text-primary-600"><span data-trixam-databind="text: ProductAdverts[${i}].Product.PriceMinString"></span> <span data-trixam-databind="text: Currency">Kč</span></div>
          </div>
        </a>
      </div>
    `

    const widgetHtml = `
      <div class="heureka-affiliate-category" data-trixam-positionid="${positionId}" data-trixam-categoryid="${categoryId}" data-trixam-categoryfilters="${categoryFilters}" data-trixam-codetype="plainhtml" data-trixam-linktarget="top">
        <div>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            ${productTemplate(0)}
            ${productTemplate(1)}
            ${productTemplate(2)}
            ${productTemplate(3)}
            ${productTemplate(4)}
            ${productTemplate(5)}
          </div>
        </div>
      </div>
    `

    containerRef.current.innerHTML = widgetHtml

    // Load trixam script after HTML is in DOM
    const scriptId = 'heureka-trixam-script'
    let existingScript = document.getElementById(scriptId)

    if (existingScript) {
      existingScript.remove()
    }

    const script = document.createElement('script')
    script.id = scriptId
    script.src = '//serve.affiliate.heureka.cz/js/trixam.min.js'
    script.async = true
    document.body.appendChild(script)
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
