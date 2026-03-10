// debug-brands2.js - inspects "Značka" filter section in detail
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const fs = require('fs')
const path = require('path')

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=cs-CZ'],
  })
  const page = await browser.newPage()
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/121.0.0.0 Safari/537.36')

  const url = 'https://barvy-na-drevo.heureka.cz/'
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })

  const result = await page.evaluate(function() {
    // Najdi "Značka" sekci
    var h3s = Array.from(document.querySelectorAll('h3.c-filter-group-list__item__header'))
    var znackaH3 = h3s.find(function(h) { return h.textContent.trim() === 'Značka' })
    if (!znackaH3) return { error: 'Značka H3 not found', h3s: h3s.map(function(h) { return h.textContent.trim() }) }

    var section = znackaH3.closest('.c-filter-group-list__item')
    if (!section) return { error: 'No .c-filter-group-list__item parent' }

    // Dump celý HTML sekce
    var html = section.innerHTML.substring(0, 3000)

    // Vsechny <a> linky v sekci
    var aLinks = Array.from(section.querySelectorAll('a[href]')).map(function(a) {
      return { href: a.getAttribute('href'), text: a.textContent.trim().substring(0, 40) }
    })

    // Vsechny inputy (checkboxy) v sekci
    var inputs = Array.from(section.querySelectorAll('input')).map(function(inp) {
      return {
        type: inp.type,
        name: inp.name,
        value: inp.value,
        id: inp.id,
        dataAttrs: inp.dataset ? JSON.stringify(inp.dataset) : ''
      }
    })

    // Labels
    var labels = Array.from(section.querySelectorAll('label, .c-filter__label')).map(function(l) {
      return { text: l.textContent.trim().substring(0, 40), forAttr: l.getAttribute('for'), class: l.className.substring(0, 50) }
    })

    // Všechny data-* atributy na všech potomcích
    var dataAttrs = []
    Array.from(section.querySelectorAll('*')).forEach(function(el) {
      if (el.dataset && Object.keys(el.dataset).length > 0) {
        dataAttrs.push({ tag: el.tagName, class: el.className.substring(0, 40), dataset: JSON.stringify(el.dataset).substring(0, 100) })
      }
    })

    return { html: html, aLinks: aLinks, inputs: inputs, labels: labels, dataAttrs: dataAttrs }
  })

  if (result.error) {
    console.log('ERROR:', result.error)
    if (result.h3s) console.log('H3s found:', result.h3s)
    return
  }

  console.log('\n=== <a> links in Značka section ===')
  console.log(result.aLinks)

  console.log('\n=== Inputs ===')
  console.log(result.inputs)

  console.log('\n=== Labels ===')
  result.labels.forEach(function(l) { console.log(l.text + ' | for:' + l.forAttr) })

  console.log('\n=== data-* attributes ===')
  result.dataAttrs.forEach(function(d) { console.log(d.tag + '.' + d.class + ' -> ' + d.dataset) })

  console.log('\n=== HTML sekce ===')
  console.log(result.html)

  fs.writeFileSync(path.join(__dirname, 'debug-brands2-dump.json'), JSON.stringify(result, null, 2))
  await browser.close()
}

main().catch(console.error)
