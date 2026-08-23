'use client'

import { useCallback, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Heureka affiliate widget — recenzni zebricek.
 *
 * Obalovy div musi zustat presne takhle — trixam se na nej vaze a bez nej
 * se nemeri provize. Uvnitr je HTML libovolne, nesmi se jen menit obsah
 * atributu data-trixam-databind.
 */

interface Props {
  positionId: string
  categoryId: string
  categoryFilters?: string
  title?: string
  pocet?: number
}

export default function HeurekaZebricek({
  positionId,
  categoryId,
  categoryFilters = '',
  title = 'Nejprodávanější podle hodnocení',
  pocet = 6,
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const pathname = usePathname()

  const onMessage = useCallback((event: MessageEvent) => {
    if (event.data?.type === 'heurekaResize' && iframeRef.current) {
      iframeRef.current.style.height = `${event.data.height}px`
    }
  }, [])

  useEffect(() => {
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [onMessage])

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const polozka = (i: number) => `
      <li class="polozka" data-trixam-databind="ifdef: ProductAdverts[${i}]">
        <span class="poradi">${i + 1}</span>
        <a class="foto" href="#" data-trixam-databind="target: LinkTarget, href: ProductAdverts[${i}].ClickUrl">
          <img data-trixam-databind="src: ProductAdverts[${i}].Product.PreviewImage" src="" alt="" width="150" height="150" loading="lazy">
        </a>
        <div class="popis">
          <a class="nazev" href="#" data-trixam-databind="target: LinkTarget, href: ProductAdverts[${i}].ClickUrl">
            <span data-trixam-databind="text: ProductAdverts[${i}].Product.Title"></span>
          </a>
          <span class="hodnoceni" data-trixam-databind="ifdef: ProductAdverts[${i}].Product.Rating">
            <span class="hvezda">&#9733;</span><span data-trixam-databind="text: ProductAdverts[${i}].Product.Rating"></span>&nbsp;%
          </span>
          <p class="anotace" data-trixam-databind="text: ProductAdverts[${i}].Product.DescriptionShort"></p>
        </div>
        <div class="akce">
          <span class="cena">
            od <strong data-trixam-databind="text: ProductAdverts[${i}].Product.PriceMinString"></strong>&nbsp;<span data-trixam-databind="text: Currency">Kč</span>
          </span>
          <a class="cta" href="#" data-trixam-databind="target: LinkTarget, href: ProductAdverts[${i}].ClickUrl">Porovnat ceny</a>
        </div>
      </li>`

    const dokument = `<!DOCTYPE html>
<html lang="cs"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;background:transparent;color:#1c1917}
  ol{list-style:none}
  .polozka{display:grid;grid-template-columns:34px 96px 1fr 150px;gap:14px;align-items:center;
           padding:14px 12px;background:#fff;border:1px solid #e7e5e4;border-radius:12px;margin-bottom:8px}
  .polozka:hover{border-color:#d6d3d1;box-shadow:0 2px 12px rgba(0,0,0,.06)}
  .poradi{display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;
          background:#166534;color:#fff;font-size:13px;font-weight:700}
  .foto{display:block;background:#fafaf9;border-radius:8px;padding:8px}
  .foto img{width:100%;height:78px;object-fit:contain;display:block}
  .popis{min-width:0;display:flex;flex-direction:column;gap:4px}
  .nazev{font-size:14px;font-weight:650;color:#1c1917;text-decoration:none;line-height:1.35;
         display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .nazev:hover{color:#166534}
  .hodnoceni{display:inline-flex;align-items:center;gap:3px;align-self:flex-start;
             background:#f0fdf4;color:#166534;border:1px solid #bbf7d0;border-radius:999px;
             padding:1px 9px;font-size:12px;font-weight:700}
  .hvezda{font-size:11px;line-height:1}
  .anotace{font-size:12px;color:#78716c;line-height:1.45;
           display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .akce{display:flex;flex-direction:column;align-items:stretch;gap:6px;text-align:center}
  .cena{font-size:13px;color:#57534e}
  .cena strong{font-size:17px;color:#1c1917}
  .cta{display:block;padding:9px 10px;background:#166534;color:#fff;font-size:12.5px;font-weight:650;
       border-radius:8px;text-decoration:none}
  .cta:hover{background:#14532d}
  .paticka{text-align:center;margin-top:12px}
  .vse{display:inline-block;padding:8px 22px;border:1.5px solid #166534;color:#166534;
       font-size:13px;font-weight:650;border-radius:8px;text-decoration:none}
  .vse:hover{background:#166534;color:#fff}
  @media(max-width:640px){
    .polozka{grid-template-columns:28px 72px 1fr;gap:10px}
    .akce{grid-column:2 / -1;flex-direction:row;align-items:center;justify-content:space-between}
    .cta{padding:8px 18px}
  }
</style></head>
<body>
<div class="heureka-affiliate-category"
     data-trixam-positionid="${positionId}"
     data-trixam-categoryid="${categoryId}"
     data-trixam-categoryfilters="${categoryFilters}"
     data-trixam-codetype="plainhtml"
     data-trixam-linktarget="blank">
  <ol>${Array.from({ length: pocet }, (_, i) => polozka(i)).join('')}</ol>
  <div class="paticka">
    <a class="vse" href="#" data-trixam-databind="target: LinkTarget, href: CategoryAdvert.ClickUrl">
      Zobrazit celou nabídku &rarr;
    </a>
  </div>
</div>
<script src="https://serve.affiliate.heureka.cz/js/trixam.min.js"><\/script>
<script>
  var casovac = null

  // Merit pres body.scrollHeight nejde: kdyz je obsah nizsi nez iframe, vrati
  // vysku iframu misto obsahu, takze by vyska umela jen rust. Po uklidu polozek
  // je potreba, aby se ram i stahl - meri se proto spodni hrana widgetu.
  function posliVysku(){
    var widget = document.querySelector('.heureka-affiliate-category')
    var h = widget ? Math.ceil(widget.getBoundingClientRect().bottom) + 4
                   : document.body.scrollHeight
    if (h > 0) window.parent.postMessage({type:'heurekaResize', height:h}, '*')
  }

  // Trixam ma v ifdef chybu o jedna: kdyz kategorie vrati min produktu, nez
  // je v zebricku polozek, prebytecne li sice odstrani, ale posledni nechá
  // navazane na neexistujici produkt a vypise "undefined". Doklizime rucne.
  // Zadne regexy - v template literalu komponenty by se zpetne lomitko snedlo.
  function uklid(){
    var polozky = document.querySelectorAll('.polozka')
    var platnych = 0
    for (var i = 0; i < polozky.length; i++) {
      var li = polozky[i]
      var nazevEl = li.querySelector('.nazev')
      var cenaEl = li.querySelector('.cena')
      var nazev = nazevEl ? nazevEl.textContent : ''
      var cena = cenaEl ? cenaEl.textContent : ''
      var rozbita = nazev.trim() === '' || (nazev + cena).indexOf('undefined') !== -1
      if (rozbita) {
        li.parentNode.removeChild(li)
        continue
      }
      platnych++
      var poradi = li.querySelector('.poradi')
      if (poradi && poradi.textContent != platnych) poradi.textContent = platnych
    }
    // Prazdna kategorie - schovat cely widget, at nezustane prazdny ram.
    var widget = document.querySelector('.heureka-affiliate-category')
    if (widget) widget.style.display = platnych === 0 ? 'none' : ''
    return platnych
  }

  function dorovnej(){ uklid(); posliVysku() }

  // Debounce: uklizet se smi az kdyz trixam dorenderuje, jinak bychom smazali
  // polozku, ktera jeste nema vyplneny nazev.
  new MutationObserver(function(){
    clearTimeout(casovac)
    casovac = setTimeout(dorovnej, 500)
  }).observe(document.body, {childList:true, subtree:true})

  window.addEventListener('load', function(){ setTimeout(posliVysku, 400) })
  window.addEventListener('resize', posliVysku)
  ;[800, 1600, 3000].forEach(function(t){ setTimeout(dorovnej, t) })
<\/script>
</body></html>`

    const doc = iframe.contentDocument || iframe.contentWindow?.document
    if (doc) {
      doc.open()
      doc.write(dokument)
      doc.close()
    }
  }, [positionId, categoryId, categoryFilters, pocet, pathname])

  return (
    <section className="my-8">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
        {title}
      </h3>
      <iframe
        ref={iframeRef}
        title={title}
        style={{ width: '100%', height: 560, border: 'none' }}
      />
      <p className="mt-2 text-center text-xs text-stone-400">
        Hodnocení a ceny včetně DPH pocházejí ze srovnávače Heureka.cz a aktualizují
        se průběžně. Odkazy se otevírají v novém okně.
      </p>
    </section>
  )
}
