'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

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
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (!iframeRef.current) return

    const productTemplate = (i: number) => `
      <div data-trixam-databind="ifdef: ProductAdverts[${i}]" style="background:white;border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;">
        <a href="#" data-trixam-databind="target: LinkTarget, href: ProductAdverts[${i}].ClickUrl" style="display:block;text-decoration:none;color:inherit;">
          <div style="background:#f3f4f6;display:flex;align-items:center;justify-content:center;padding:4px;height:120px;">
            <img data-trixam-databind="src: ProductAdverts[${i}].Product.PreviewImage" src="" width="100" height="100" style="max-width:100%;max-height:100%;object-fit:contain;">
          </div>
          <div style="padding:8px;">
            <div style="font-size:12px;font-weight:500;color:#111;min-height:32px;margin-bottom:4px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;"><span data-trixam-databind="text: ProductAdverts[${i}].Product.Title"></span></div>
            <div style="font-size:14px;font-weight:700;color:#16a34a;"><span data-trixam-databind="text: ProductAdverts[${i}].Product.PriceMinString"></span> <span data-trixam-databind="text: Currency">Kč</span></div>
          </div>
        </a>
      </div>
    `

    const iframeContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; max-width: 672px; margin: 0 auto; }
          @media (max-width: 640px) { .grid { grid-template-columns: repeat(2, 1fr); } }
          .btn { display: inline-flex; align-items: center; padding: 8px 16px; background: #16a34a; color: white; font-size: 14px; font-weight: 500; border-radius: 8px; text-decoration: none; margin-top: 16px; }
          .btn:hover { background: #15803d; }
          .center { text-align: center; }
        </style>
      </head>
      <body>
        <div class="heureka-affiliate-category" data-trixam-positionid="${positionId}" data-trixam-categoryid="${categoryId}" data-trixam-categoryfilters="${categoryFilters}" data-trixam-codetype="plainhtml" data-trixam-linktarget="top">
          <div class="grid">
            ${productTemplate(0)}
            ${productTemplate(1)}
            ${productTemplate(2)}
            ${productTemplate(3)}
          </div>
          <div class="center">
            <a href="#" data-trixam-databind="target: LinkTarget, href: CategoryAdvert.ClickUrl" class="btn">
              Zobrazit všechny OSB desky
            </a>
          </div>
        </div>
        <script src="https://serve.affiliate.heureka.cz/js/trixam.min.js"></script>
      </body>
      </html>
    `

    const iframe = iframeRef.current
    const doc = iframe.contentDocument || iframe.contentWindow?.document
    if (doc) {
      doc.open()
      doc.write(iframeContent)
      doc.close()
    }
  }, [positionId, categoryId, categoryFilters, pathname])

  return (
    <section className="my-6 py-4 px-4 bg-wood-50 rounded-lg border border-wood-200">
      <h2 className="text-lg font-bold text-gray-900 mb-4">{title}</h2>
      <iframe
        ref={iframeRef}
        style={{ width: '100%', height: '280px', border: 'none' }}
        title="Heureka produkty"
      />
      <p className="text-xs text-gray-400 mt-3 text-center">
        Ceny jsou uvedeny včetně DPH. Kliknutím přejdete na Heureka.cz.
      </p>
    </section>
  )
}
