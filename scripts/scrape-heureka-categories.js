// scrape-heureka-categories.js
// Scrapes barvy-laky.heureka.cz category structure up to 2 levels deep (= uroven 6 dle Heureka).
// Output: scripts/heureka-categories.json
//
// Usage:
//   node scripts/scrape-heureka-categories.js

const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const fs = require('fs')
const path = require('path')

const ROOT_URL = 'https://barvy-laky.heureka.cz/'
const OUTPUT_FILE = path.join(__dirname, 'heureka-categories.json')
const DELAY_MS = 800

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Zavre cookie/GDPR consent banner pokud existuje
async function dismissConsent(page) {
  try {
    // Didomi consent (Heureka pouziva Didomi)
    const agreed = await page.evaluate(function() {
      var btns = Array.from(document.querySelectorAll('button, a'));
      var acceptBtn = btns.find(function(b) {
        var t = (b.textContent || '').toLowerCase();
        return t.includes('souhlasim') || t.includes('prijmout') || t.includes('accept') || t.includes('agree') || b.id === 'didomi-notice-agree-button';
      });
      if (acceptBtn) { acceptBtn.click(); return true; }
      return false;
    });
    if (agreed) await sleep(500);
  } catch (e) {}
}

async function getPageData(page, url) {
  await sleep(DELAY_MS)
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
  } catch (e) {
    console.warn('  WARN: ' + url + ' - ' + e.message)
    return null
  }

  // Pockej az se vyrenderuje seznam kategorii
  try {
    await page.waitForSelector('.c-categories-list__link', { timeout: 8000 })
  } catch (e) {
    // Stranka nema podkategorie (je to leaf - produkty) - OK
  }

  return await page.evaluate(function() {
    // categoryId - pattern: categoryId":"XXXX"
    var html = document.documentElement.innerHTML
    var idMatch = html.match(/categoryId["\\s]*:["\\s]*["']?(\d+)["']?/)
    var categoryId = idMatch ? idMatch[1] : null

    // Nazev kategorie
    var name = (window.currentCategoryName)
      || (document.querySelector('h1') ? document.querySelector('h1').textContent.trim() : '')

    // Podkategorie
    var subLinks = Array.from(document.querySelectorAll('.c-categories-list__link'))
      .map(function(a) { return { name: a.textContent.trim(), url: a.href } })
      .filter(function(a) { return a.name && a.url && a.url.indexOf('heureka.cz') !== -1 })

    return { name: name, categoryId: categoryId, subLinks: subLinks }
  })
}

async function newPage(browser) {
  const page = await browser.newPage()
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
  )
  return page
}

async function fetchUrl(browser, url) {
  const page = await newPage(browser)
  try {
    return await getPageData(page, url)
  } finally {
    await page.close()
  }
}

async function main() {
  console.log('Spoustim scraper barvy-laky.heureka.cz...\n')

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=cs-CZ'],
  })

  const results = []

  try {
    // Root stranka - nova stranka pro kazde volani
    const root = await fetchUrl(browser, ROOT_URL)
    if (!root) throw new Error('Root page failed')
    console.log('Root: ' + root.subLinks.length + ' L1 kategorii\n')

    for (var i = 0; i < root.subLinks.length; i++) {
      var l1link = root.subLinks[i]
      console.log('[L1] ' + l1link.name + ' -> ' + l1link.url)
      var l1data = await fetchUrl(browser, l1link.url)
      if (!l1data) continue

      var l1entry = {
        name: l1data.name || l1link.name,
        url: l1link.url,
        categoryId: l1data.categoryId,
        children: [],
      }
      console.log('     categoryId: ' + (l1data.categoryId || '?') + '  |  podkategorie: ' + l1data.subLinks.length)

      // L2 = konecna uroven (L6 v Heureka hierarchii)
      for (var j = 0; j < l1data.subLinks.length; j++) {
        var l2link = l1data.subLinks[j]
        console.log('  [L2] ' + l2link.name + ' -> ' + l2link.url)
        var l2data = await fetchUrl(browser, l2link.url)
        if (!l2data) continue

        console.log('       categoryId: ' + (l2data.categoryId || '?'))
        l1entry.children.push({
          name: l2data.name || l2link.name,
          url: l2link.url,
          categoryId: l2data.categoryId,
        })
      }

      results.push(l1entry)
    }
  } finally {
    await browser.close()
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2), 'utf-8')

  // Statistiky
  var total = 0, withId = 0
  results.forEach(function(l1) {
    total++; if (l1.categoryId) withId++
    l1.children.forEach(function(l2) { total++; if (l2.categoryId) withId++ })
  })

  console.log('\n=== HOTOVO ===')
  console.log('Celkem kategorii: ' + total)
  console.log('S categoryId: ' + withId + ' / ' + total)
  console.log('Ulozeno: ' + OUTPUT_FILE)
}

main().catch(console.error)
