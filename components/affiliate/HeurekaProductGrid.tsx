'use client'

import { useEffect, useRef, useCallback } from 'react'
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
  const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.data?.type === 'heurekaResize' && iframeRef.current) {
      iframeRef.current.style.height = event.data.height + 'px'
    }
  }, [])

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [handleMessage])

  useEffect(() => {
    if (!iframeRef.current) return

    const cardTemplate = (i: number) => `
      <div data-trixam-databind="ifdef: ProductAdverts[${i}]" class="card">
        <a href="#" data-trixam-databind="target: LinkTarget, href: ProductAdverts[${i}].ClickUrl" class="card-img-link">
          <img data-trixam-databind="src: ProductAdverts[${i}].Product.PreviewImage" src="" alt="" class="card-img">
        </a>
        <div class="card-body">
          <a href="#" data-trixam-databind="target: LinkTarget, href: ProductAdverts[${i}].ClickUrl" class="card-title">
            <span data-trixam-databind="text: ProductAdverts[${i}].Product.Title"></span>
          </a>
          <div class="card-price">
            <span data-trixam-databind="text: ProductAdverts[${i}].Product.PriceMinString"></span>&nbsp;<span data-trixam-databind="text: Currency">Kč</span>
          </div>
          <a href="#" data-trixam-databind="target: LinkTarget, href: ProductAdverts[${i}].ClickUrl" class="btn-offers">Zobrazit nabídky</a>
        </div>
      </div>
    `

    const iframeContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: transparent; }
          .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
          .section-title { font-size: 18px; font-weight: 700; color: #111827; }
          .footer { text-align: center; margin-top: 20px; }
          .btn-view-all { display: inline-block; padding: 10px 28px; border: 2px solid #1d4ed8; color: #1d4ed8; font-size: 14px; font-weight: 600; border-radius: 8px; text-decoration: none; white-space: nowrap; }
          .btn-view-all:hover { background: #1d4ed8; color: #fff; }
          .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
          .card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; }
          .card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); border-color: #d1d5db; }
          .card-img-link { display: block; background: #f9fafb; padding: 16px; text-align: center; }
          .card-img { width: 120px; height: 120px; object-fit: contain; margin: 0 auto; display: block; }
          .card-body { padding: 12px 16px 16px; display: flex; flex-direction: column; flex: 1; gap: 8px; }
          .card-title { font-size: 14px; font-weight: 600; color: #111827; text-decoration: none; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
          .card-title:hover { color: #1d4ed8; }
          .card-price { font-size: 20px; font-weight: 700; color: #111827; margin-top: auto; }
          .btn-offers { display: block; text-align: center; padding: 10px 0; background: #1d4ed8; color: #fff; font-size: 13px; font-weight: 600; border-radius: 8px; text-decoration: none; margin-top: 4px; }
          .btn-offers:hover { background: #1e40af; }
          @media (max-width: 700px) {
            .grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
            .card-img { width: 80px; height: 80px; }
          }
          @media (max-width: 400px) {
            .grid { grid-template-columns: 1fr; }
          }
        </style>
      </head>
      <body>
        <div class="heureka-affiliate-category" data-trixam-positionid="${positionId}" data-trixam-categoryid="${categoryId}" data-trixam-categoryfilters="${categoryFilters}" data-trixam-codetype="plainhtml" data-trixam-linktarget="top">
          <div class="section-header">
            <span class="section-title" data-trixam-databind="text: CategoryAdvert.Data.Category.Name"></span>
          </div>
          <div class="grid">
            ${Array.from({ length: 4 }, (_, i) => cardTemplate(i)).join('')}
          </div>
          <div class="footer">
            <a href="#" data-trixam-databind="target: LinkTarget, href: CategoryAdvert.ClickUrl" class="btn-view-all">Zobrazit vše &rarr;</a>
          </div>
        </div>
        <script src="https://serve.affiliate.heureka.cz/js/trixam.min.js"><\/script>
        <script>
          function sendHeight() {
            var h = document.body.scrollHeight;
            if (h > 0) {
              window.parent.postMessage({ type: 'heurekaResize', height: h }, '*');
            }
          }
          var observer = new MutationObserver(function() { setTimeout(sendHeight, 100); });
          observer.observe(document.body, { childList: true, subtree: true });
          window.addEventListener('load', function() { setTimeout(sendHeight, 500); });
          window.addEventListener('resize', sendHeight);
          setTimeout(sendHeight, 1000);
          setTimeout(sendHeight, 2000);
          setTimeout(sendHeight, 4000);
        <\/script>
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

  if (isLocalhost) {
    return (
      <section className="my-6 py-4 px-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-center text-gray-500 text-sm">
          Heureka widget (position: {positionId}, category: {categoryId}) – zobrazí se pouze na produkční doméně
        </p>
      </section>
    )
  }

  return (
    <section className="my-6 py-4 px-4 bg-wood-50 rounded-lg border border-wood-200">
      <iframe
        ref={iframeRef}
        style={{ width: '100%', height: '400px', border: 'none' }}
        title="Heureka produkty"
      />
      <p className="text-xs text-gray-400 mt-3 text-center">
        Ceny jsou uvedeny včetně DPH. Kliknutím přejdete na Heureka.cz.
      </p>
    </section>
  )
}
