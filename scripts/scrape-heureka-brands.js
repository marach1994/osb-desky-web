// scrape-heureka-brands.js
// Pro každou kategorii z heureka-categories-clean.json scrapuje značky z filtru "Značka".
// Output: scripts/heureka-brands.json
//
// Usage:
//   node scripts/scrape-heureka-brands.js

const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const fs = require('fs')
const path = require('path')

const INPUT_FILE = path.join(__dirname, 'heureka-categories-clean.json')
const OUTPUT_FILE = path.join(__dirname, 'heureka-brands.json')
const DELAY_MS = 800

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function newPage(browser) {
  const page = await browser.newPage()
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
  )
  return page
}

async function scrapeBrands(browser, categoryName, categoryId, categoryUrl) {
  await sleep(DELAY_MS)
  const page = await newPage(browser)

  try {
    try {
      await page.goto(categoryUrl, { waitUntil: 'networkidle2', timeout: 30000 })
    } catch (e) {
      console.warn('  WARN goto: ' + e.message)
      return null
    }

    // Pockej na sidebar
    try {
      await page.waitForSelector('h3.c-filter-group-list__item__header', { timeout: 8000 })
    } catch (e) {}

    // Najdi brand sekci a klikni na "Zobrazit další"
    const hasMore = await page.evaluate(function() {
      var h3s = Array.from(document.querySelectorAll('h3.c-filter-group-list__item__header'))
      var headingNames = ['Značka', 'Výrobce']
      for (var hi = 0; hi < headingNames.length; hi++) {
        var h3 = h3s.find(function(h) { return h.textContent.trim() === headingNames[hi] })
        if (!h3) continue
        var section = h3.closest('.c-filter-group-list__item')
        if (!section) continue
        var btn = section.querySelector('button[data-testid="Collapsible-button"]')
        if (btn) { btn.click(); return true }
      }
      return false
    })

    if (hasMore) {
      await sleep(400)
    }

    // Scrapuj značky ze sekce "Značka" nebo "Výrobce"
    const result = await page.evaluate(function(catName, catUrl) {
      var h3s = Array.from(document.querySelectorAll('h3.c-filter-group-list__item__header'))

      // Zkus obe mozne sekce - "Značka" i "Výrobce"
      var section = null
      var headingNames = ['Značka', 'Výrobce']
      for (var hi = 0; hi < headingNames.length; hi++) {
        var h3 = h3s.find(function(h) { return h.textContent.trim() === headingNames[hi] })
        if (!h3) continue
        var sec = h3.closest('.c-filter-group-list__item')
        if (!sec) continue
        // Overeni ze sekce obsahuje brand buttons (ne price-)
        var testBtns = Array.from(sec.querySelectorAll('button[data-testid="CheckBox-input"][id]'))
          .filter(function(b) { return b.id && b.id.match(/^\d+-\d+$/) })
        if (testBtns.length > 0) { section = sec; break }
      }

      if (!section) return { brands: [], brandFilterId: null, error: 'no brand section found' }

      // Checkboxy: <button id="filterId-valueId" value="valueId">
      var buttons = Array.from(section.querySelectorAll('button[id][data-testid="CheckBox-input"]'))
      var brandFilterId = null
      var brands = []

      buttons.forEach(function(btn) {
        var btnId = btn.getAttribute('id') // "25827-33233359"
        var value = btn.getAttribute('value') // "33233359"
        if (!btnId || !value) return

        var parts = btnId.split('-')
        if (parts.length < 2) return
        var filterId = parts[0]
        var valueId = parts[1]

        if (!brandFilterId) brandFilterId = filterId

        // Najdi label pro tento button
        var label = section.querySelector('label[for="' + btnId + '"]')
        var brandName = label ? label.textContent.trim().replace(/\s+/g, ' ') : ''
        if (!brandName) return

        var filterParam = 'f:' + filterId + ':' + valueId
        var url = catUrl.replace(/\/$/, '') + '/' + filterParam + '/'

        brands.push({
          name: brandName + ' ' + catName,
          brand: brandName,
          valueId: valueId,
          categoryFilters: filterParam,
          url: url
        })
      })

      return { brands: brands, brandFilterId: brandFilterId, error: null }
    }, categoryName, categoryUrl)

    if (result.error) {
      console.log('  WARN: ' + result.error)
    } else {
      console.log('  brandFilterId: ' + result.brandFilterId + ' | značky: ' + result.brands.length)
    }

    return {
      category: categoryName,
      categoryId: categoryId,
      categoryUrl: categoryUrl,
      brandFilterId: result.brandFilterId,
      brands: result.brands
    }
  } finally {
    await page.close()
  }
}

async function main() {
  const categories = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'))

  // Flat seznam unikátních kategorií (L1 + L2)
  const seen = new Set()
  const flat = []
  categories.forEach(function(l1) {
    if (!seen.has(l1.url)) {
      seen.add(l1.url)
      flat.push({ name: l1.name, categoryId: l1.categoryId, url: l1.url })
    }
    l1.children.forEach(function(l2) {
      if (!seen.has(l2.url)) {
        seen.add(l2.url)
        flat.push({ name: l2.name, categoryId: l2.categoryId, url: l2.url })
      }
    })
  })

  console.log('Spoustim scraper znacek...')
  console.log('Celkem kategorii: ' + flat.length + '\n')

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=cs-CZ'],
  })

  const results = []

  try {
    for (var i = 0; i < flat.length; i++) {
      var cat = flat[i]
      console.log('[' + (i + 1) + '/' + flat.length + '] ' + cat.name + ' (' + cat.categoryId + ')')
      var data = await scrapeBrands(browser, cat.name, cat.categoryId, cat.url)
      if (data) results.push(data)
    }
  } finally {
    await browser.close()
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2), 'utf-8')

  // Statistiky
  var totalBrands = results.reduce(function(sum, r) { return sum + r.brands.length }, 0)
  var withBrands = results.filter(function(r) { return r.brands.length > 0 }).length

  console.log('\n=== HOTOVO ===')
  console.log('Kategorii celkem: ' + results.length)
  console.log('Kategorii se značkami: ' + withBrands + ' / ' + results.length)
  console.log('Značek celkem: ' + totalBrands)
  console.log('Ulozeno: ' + OUTPUT_FILE)
}

main().catch(console.error)
