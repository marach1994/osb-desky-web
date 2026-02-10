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

    const rowTemplate = (i: number) => `
      <tr data-trixam-databind="ifdef: ProductAdverts[${i}]" class="product-row">
        <td class="col-rank"><span class="rank-badge">TOP ${i + 1}</span></td>
        <td class="col-img">
          <a href="#" data-trixam-databind="target: LinkTarget, href: ProductAdverts[${i}].ClickUrl" style="display:block;">
            <img data-trixam-databind="src: ProductAdverts[${i}].Product.PreviewImage" src="" alt="" class="product-img">
          </a>
        </td>
        <td class="col-name">
          <a href="#" data-trixam-databind="target: LinkTarget, href: ProductAdverts[${i}].ClickUrl" class="product-link">
            <span data-trixam-databind="text: ProductAdverts[${i}].Product.Title"></span>
          </a>
        </td>
        <td class="col-rating">
          <span data-trixam-databind="ifdef: ProductAdverts[${i}].Product.Rating">
            <span class="rating-value" data-trixam-databind="text: ProductAdverts[${i}].Product.RatingString"></span>
            <span class="rating-label">/ 5</span>
          </span>
        </td>
        <td class="col-price">
          <span class="price-value">od <span data-trixam-databind="text: ProductAdverts[${i}].Product.PriceMinString"></span>&nbsp;<span data-trixam-databind="text: Currency">Kč</span></span>
        </td>
        <td class="col-action">
          <a href="#" data-trixam-databind="target: LinkTarget, href: ProductAdverts[${i}].ClickUrl" class="btn-offers">Zobrazit nabídky</a>
        </td>
      </tr>
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
          table { width: 100%; border-collapse: collapse; }
          .product-row { border-bottom: 1px solid #e5e7eb; }
          .product-row:hover { background: #f9fafb; }
          .product-row td { padding: 10px 8px; vertical-align: middle; }
          .col-rank { width: 70px; text-align: center; }
          .rank-badge { display: inline-block; background: #f59e0b; color: #fff; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; white-space: nowrap; }
          .col-img { width: 64px; text-align: center; }
          .product-img { width: 56px; height: 56px; object-fit: contain; border-radius: 4px; background: #f3f4f6; }
          .col-name { font-size: 13px; font-weight: 500; color: #111; }
          .product-link { color: #111; text-decoration: none; }
          .product-link:hover { color: #16a34a; text-decoration: underline; }
          .col-rating { width: 80px; text-align: center; font-size: 13px; }
          .rating-value { font-weight: 700; color: #f59e0b; }
          .rating-label { color: #9ca3af; font-size: 11px; }
          .col-price { width: 120px; white-space: nowrap; }
          .price-value { font-size: 14px; font-weight: 700; color: #16a34a; }
          .col-action { width: 140px; text-align: center; }
          .btn-offers { display: inline-block; padding: 7px 14px; background: #16a34a; color: #fff; font-size: 12px; font-weight: 600; border-radius: 6px; text-decoration: none; white-space: nowrap; }
          .btn-offers:hover { background: #15803d; }
          .footer { text-align: center; padding: 14px 0 4px; }
          .btn-all { display: inline-flex; align-items: center; padding: 10px 20px; background: #16a34a; color: white; font-size: 14px; font-weight: 600; border-radius: 8px; text-decoration: none; }
          .btn-all:hover { background: #15803d; }
          @media (max-width: 640px) {
            table, tbody, tr, td { display: block; width: 100%; }
            .product-row { border-bottom: 1px solid #e5e7eb; padding: 10px 0; display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; }
            .col-rank { width: auto; text-align: left; padding: 0; }
            .col-rating { display: none; }
            .col-img { width: 48px; padding: 0; }
            .product-img { width: 44px; height: 44px; }
            .col-name { flex: 1; min-width: 0; padding: 0; font-size: 12px; }
            .col-price { width: 100%; padding: 4px 0 0 56px; }
            .col-action { width: 100%; text-align: left; padding: 4px 0 0 56px; }
            .btn-offers { padding: 6px 12px; font-size: 11px; }
          }
        </style>
      </head>
      <body>
        <div class="heureka-affiliate-category" data-trixam-positionid="${positionId}" data-trixam-categoryid="${categoryId}" data-trixam-categoryfilters="${categoryFilters}" data-trixam-codetype="plainhtml" data-trixam-linktarget="top">
          <table>
            <tbody>
              ${Array.from({ length: 4 }, (_, i) => rowTemplate(i)).join('')}
            </tbody>
          </table>
          <div class="footer">
            <a href="#" data-trixam-databind="target: LinkTarget, href: CategoryAdvert.ClickUrl" class="btn-all">
              Zobrazit všechny OSB desky
            </a>
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
          // Send height after Trixam renders
          var observer = new MutationObserver(function() { setTimeout(sendHeight, 100); });
          observer.observe(document.body, { childList: true, subtree: true });
          // Also send on load and resize
          window.addEventListener('load', function() { setTimeout(sendHeight, 500); });
          window.addEventListener('resize', sendHeight);
          // Initial send
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

  return (
    <section className="my-6 py-4 px-4 bg-wood-50 rounded-lg border border-wood-200">
      <h2 className="text-lg font-bold text-gray-900 mb-4">{title}</h2>
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
