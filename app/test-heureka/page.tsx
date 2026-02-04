'use client'

import { useEffect, useRef } from 'react'

export default function TestHeurekaPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Insert raw HTML
    containerRef.current.innerHTML = `
      <div class="heureka-affiliate-category" data-trixam-positionid="260397" data-trixam-categoryid="6038" data-trixam-categoryfilters="" data-trixam-codetype="plainhtml" data-trixam-linktarget="top">
        <div data-trixam-databind="ifdef: ProductAdverts[0]">
          <p>Produkt: <span data-trixam-databind="text: ProductAdverts[0].Product.Title"></span></p>
          <p>Cena: <span data-trixam-databind="text: ProductAdverts[0].Product.PriceMinString"></span> Kc</p>
        </div>
      </div>
    `

    // Load script
    const script = document.createElement('script')
    script.src = '//serve.affiliate.heureka.cz/js/trixam.min.js'
    script.async = true
    document.body.appendChild(script)
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Heureka Widget</h1>
      <p>Position ID: 260397, Category ID: 6038</p>
      <hr />
      <div ref={containerRef}></div>
      <hr />
      <p>Pokud výše vidíš název produktu a cenu, widget funguje.</p>
    </div>
  )
}
