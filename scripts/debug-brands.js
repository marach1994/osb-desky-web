// debug-brands.js - dumps filter section structure for one category
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
  console.log('Navigating to:', url)
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })

  // Dump all elements that contain filter-related classes
  const result = await page.evaluate(function() {
    // Najdi vsechny elementy s "filter" nebo "Filter" v class
    var allFilterEls = Array.from(document.querySelectorAll('[class*="filter"], [class*="Filter"]'))

    // Unikátní třídy
    var classes = new Set()
    allFilterEls.forEach(function(el) {
      el.className.split(' ').forEach(function(c) {
        if (c && (c.toLowerCase().includes('filter') || c.toLowerCase().includes('facet'))) {
          classes.add(c)
        }
      })
    })

    // Headings uvnitř filtrů
    var headings = Array.from(document.querySelectorAll('[class*="filter"] [class*="title"], [class*="filter"] [class*="label"], [class*="filter"] [class*="heading"], [class*="filter"] h2, [class*="filter"] h3, [class*="filter"] h4, [class*="filter"] strong, [class*="filter"] button'))
      .map(function(el) {
        return {
          tag: el.tagName,
          class: el.className.substring(0, 60),
          text: el.textContent.trim().substring(0, 50)
        }
      })
      .filter(function(el) { return el.text.length > 0 })
      .slice(0, 40)

    // Vsechny filter linky (kompletní seznam)
    var filterLinks = Array.from(document.querySelectorAll('a[href*="/f:"]'))
      .map(function(a) {
        return {
          href: a.getAttribute('href'),
          text: a.textContent.trim().substring(0, 40),
          parentClass: (a.parentElement ? a.parentElement.className.substring(0, 60) : ''),
          grandParentClass: (a.parentElement && a.parentElement.parentElement ? a.parentElement.parentElement.className.substring(0, 60) : '')
        }
      })
      .filter(function(a) { return a.href && a.href.match(/\/f:\d+:\d+\//) })

    return {
      filterClasses: Array.from(classes).slice(0, 30),
      headings: headings,
      filterLinks: filterLinks,
      filterLinksCount: filterLinks.length
    }
  })

  console.log('\n=== Filter classes ===')
  console.log(result.filterClasses)

  console.log('\n=== Headings ===')
  result.headings.forEach(function(h) {
    console.log(h.tag + '.' + h.class + ' -> "' + h.text + '"')
  })

  console.log('\n=== Filter links (' + result.filterLinksCount + ' total) ===')
  result.filterLinks.forEach(function(l) {
    console.log(l.href + ' | "' + l.text + '" | parent: ' + l.parentClass.substring(0, 40))
  })

  fs.writeFileSync(path.join(__dirname, 'debug-brands-dump.json'), JSON.stringify(result, null, 2))
  console.log('\nDump ulozen do scripts/debug-brands-dump.json')

  await browser.close()
}

main().catch(console.error)
