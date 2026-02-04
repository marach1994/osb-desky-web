'use client'

import { useEffect } from 'react'

interface HeurekaProductGridProps {
  positionId: string
  categoryId: string
  categoryFilters?: string
  title?: string
  productCount?: number
}

declare global {
  interface Window {
    Trixam?: {
      init?: () => void
      refresh?: () => void
    }
  }
}

export default function HeurekaProductGrid({
  positionId,
  categoryId,
  categoryFilters = '',
  title = 'Doporučené produkty',
  productCount = 4,
}: HeurekaProductGridProps) {
  useEffect(() => {
    // Load trixam script if not already loaded
    const scriptId = 'heureka-trixam-script'

    const initWidgets = () => {
      // Try multiple initialization methods
      const tryInit = () => {
        if (typeof window !== 'undefined') {
          // @ts-expect-error Trixam is loaded externally
          if (window.Trixam?.init) {
            // @ts-expect-error Trixam is loaded externally
            window.Trixam.init()
          }
          // @ts-expect-error trixam global function
          if (typeof window.trixam === 'function') {
            // @ts-expect-error trixam global function
            window.trixam()
          }
        }
      }

      // Try immediately and after delays
      tryInit()
      setTimeout(tryInit, 200)
      setTimeout(tryInit, 500)
      setTimeout(tryInit, 1000)
    }

    const existingScript = document.getElementById(scriptId)

    if (!existingScript) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://serve.affiliate.heureka.cz/js/trixam.min.js'
      script.async = true
      script.onload = initWidgets
      document.body.appendChild(script)
    } else {
      initWidgets()
    }
  }, [positionId])

  // Generate product slots based on productCount
  const productSlots = Array.from({ length: productCount }, (_, i) => i)

  return (
    <section className="my-10 py-8 px-6 bg-wood-50 rounded-xl border border-wood-200">
      <h2 className="text-xl font-bold text-gray-900 mb-6">{title}</h2>

      <div
        className="heureka-affiliate-category"
        data-trixam-positionid={positionId}
        data-trixam-categoryid={categoryId}
        data-trixam-categoryfilters={categoryFilters}
        data-trixam-codetype="plainhtml"
        data-trixam-linktarget="top"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {productSlots.map((index) => (
            <div
              key={index}
              data-trixam-databind={`ifdef: ProductAdverts[${index}]`}
              className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-primary-500 transition-all group"
            >
              <a
                href="#"
                data-trixam-databind={`target: LinkTarget, href: ProductAdverts[${index}].ClickUrl`}
                className="block"
              >
                <div className="aspect-square relative bg-gray-100 overflow-hidden">
                  <img
                    data-trixam-databind={`src: ProductAdverts[${index}].Product.PreviewImage`}
                    src=""
                    alt=""
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem] mb-2">
                    <span data-trixam-databind={`text: ProductAdverts[${index}].Product.Title`}></span>
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary-600">
                      <span data-trixam-databind={`text: ProductAdverts[${index}].Product.PriceMinString`}></span>
                      <span className="text-sm ml-1" data-trixam-databind="text: Currency"></span>
                    </span>
                    <span className="text-xs text-primary-600 font-medium group-hover:underline">
                      Koupit →
                    </span>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-4 text-center">
        Ceny jsou uvedeny včetně DPH. Kliknutím přejdete na Heureka.cz.
      </p>
    </section>
  )
}
