'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    Trixam?: {
      init?: () => void
      refresh?: () => void
    }
  }
}

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
      <div data-trixam-databind="ifdef: ProductAdverts[${i}]" class="bg-white border border-gray-200 rounded-md overflow-hidden hover:shadow-md transition-all">
        <a href="#" data-trixam-databind="target: LinkTarget, href: ProductAdverts[${i}].ClickUrl" class="block">
          <div class="bg-gray-100 flex items-center justify-center p-1" style="height: 120px;">
            <img data-trixam-databind="src: ProductAdverts[${i}].Product.PreviewImage" src="" width="100" height="100" class="max-w-full max-h-full object-contain">
          </div>
          <div class="p-2">
            <div class="text-xs font-medium text-gray-900 line-clamp-2 min-h-[2rem] mb-1"><span data-trixam-databind="text: ProductAdverts[${i}].Product.Title"></span></div>
            <div class="text-sm font-bold text-primary-600"><span data-trixam-databind="text: ProductAdverts[${i}].Product.PriceMinString"></span> <span data-trixam-databind="text: Currency">Kč</span></div>
          </div>
        </a>
      </div>
    `

    const widgetHtml = `
      <div class="heureka-affiliate-category" data-trixam-positionid="${positionId}" data-trixam-categoryid="${categoryId}" data-trixam-categoryfilters="${categoryFilters}" data-trixam-codetype="plainhtml" data-trixam-linktarget="top">
        <div class="max-w-2xl mx-auto">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
            ${productTemplate(0)}
            ${productTemplate(1)}
            ${productTemplate(2)}
            ${productTemplate(3)}
          </div>
          <div class="mt-4 text-center">
            <a href="#" data-trixam-databind="target: LinkTarget, href: CategoryAdvert.ClickUrl" class="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
              Zobrazit všechny OSB desky
            </a>
          </div>
        </div>
      </div>
    `

    containerRef.current.innerHTML = widgetHtml

    // Function to initialize Trixam
    const initTrixam = () => {
      setTimeout(() => {
        if (window.Trixam?.init) {
          window.Trixam.init()
        }
      }, 50)
    }

    // Remove any existing script and reload fresh
    const existingScripts = document.querySelectorAll('script[src*="trixam"]')
    existingScripts.forEach(s => s.remove())

    // Load fresh script
    const script = document.createElement('script')
    script.src = 'https://serve.affiliate.heureka.cz/js/trixam.min.js'
    script.onload = initTrixam
    document.body.appendChild(script)
  }, [positionId, categoryId, categoryFilters])

  return (
    <section className="my-6 py-4 px-4 bg-wood-50 rounded-lg border border-wood-200">
      <h2 className="text-lg font-bold text-gray-900 mb-4">{title}</h2>
      <div ref={containerRef}></div>
      <p className="text-xs text-gray-400 mt-3 text-center">
        Ceny jsou uvedeny včetně DPH. Kliknutím přejdete na Heureka.cz.
      </p>
    </section>
  )
}
