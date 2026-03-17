// debug-osb-ids.js - vypíše všechny pozice z API pro OSB kategorii a najde OSB pozice

const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const fs = require('fs')
const path = require('path')

const EMAIL = 'marach1994@gmail.com'
const PASSWORD = 'MaraCh7779!'
const OSB_FILE = path.join(__dirname, 'osb-positions.json')

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function login(page) {
  await page.goto('https://affiliate.heureka.cz/login', { waitUntil: 'networkidle2', timeout: 30000 })
  const inputs = await page.$$('input:not([type="hidden"])')
  await inputs[0].click({ clickCount: 3 }); await inputs[0].type(EMAIL)
  await inputs[1].click({ clickCount: 3 }); await inputs[1].type(PASSWORD)
  await sleep(300)
  const btn = await page.$('button[type="submit"]') || await page.$('button')
  await btn.click()
  await page.waitForFunction(() => !window.location.href.includes('/login'), { timeout: 15000 }).catch(() => {})
  await sleep(2000)
}

async function main() {
  const osbData = JSON.parse(fs.readFileSync(OSB_FILE, 'utf-8'))

  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 1400, height: 900 })

  const allCaptured = []
  page.on('response', async function(resp) {
    const url = resp.url()
    try {
      const ct = resp.headers()['content-type'] || ''
      if (ct.includes('json') && (url.includes('heureka') || url.includes('affiliate'))) {
        const text = await resp.text()
        if (text.length > 100 && text.length < 500000) {
          try {
            const json = JSON.parse(text)
            allCaptured.push({ url, json })
          } catch (e) {}
        }
      }
    } catch (e) {}
  })

  try {
    await login(page)

    // Načteme stránku se select boxem pro OSB
    await page.goto('https://affiliate.heureka.cz/webmaster/webs/25761/positions/category-position?groupName=products-rotator#/?categoryId=6038&categoryFilters=',
      { waitUntil: 'networkidle2', timeout: 30000 })
    await sleep(6000)

    console.log('Zachyceno API odpovědí:', allCaptured.length)

    // Vypis všech responses
    allCaptured.forEach(function(r, i) {
      const keys = Object.keys(r.json)
      console.log('\n[' + i + ']', r.url.substring(0, 100))
      console.log('Keys:', keys)
      if (r.json.Items) console.log('Items count:', r.json.Items.length, '| Sample:', JSON.stringify(r.json.Items[0]).substring(0, 200))
      if (r.json.items) console.log('items count:', r.json.items.length, '| Sample:', JSON.stringify(r.json.items[0]).substring(0, 200))
      if (Array.isArray(r.json)) console.log('Array length:', r.json.length, '| Sample:', JSON.stringify(r.json[0]).substring(0, 200))
    })

    // Zkus najít pozice přímo ze select elementů na stránce
    const positions = await page.evaluate(function() {
      // Najdi select s pozicemi (pravděpodobně má value jako číslo)
      const results = []
      const selects = document.querySelectorAll('select')
      selects.forEach(function(sel) {
        const opts = Array.from(sel.options).filter(function(o) {
          return /^\d+$/.test(o.value) // jen číselné hodnoty = positionIds
        })
        if (opts.length > 0) {
          opts.forEach(function(o) {
            results.push({ id: o.value, name: o.text.trim() })
          })
        }
      })
      return results
    })

    console.log('\n=== Select s číselnými hodnotami (positionIds) ===')
    console.log('Počet:', positions.length)

    // Hledej OSB pozice
    const osbPositions = positions.filter(function(p) {
      return p.name.toLowerCase().includes('osb')
    })
    console.log('\nOSB pozice:', osbPositions.length)
    osbPositions.forEach(function(p) { console.log(' ', p.id, '|', p.name) })

    // Prvních 20 pro přehled
    if (positions.length > 0) {
      console.log('\nPrvních 20 pozic:')
      positions.slice(0, 20).forEach(function(p) { console.log(' ', p.id, '|', p.name) })
    }

    // Aktualizuj osb-positions.json
    if (osbPositions.length > 0) {
      function normalize(s) { return (s || '').trim().toLowerCase().replace(/\s+/g, ' ') }
      const nameToId = {}
      osbPositions.forEach(function(p) { nameToId[normalize(p.name)] = p.id })

      let updated = 0
      osbData.forEach(function(p) {
        const key = normalize(p.name)
        if (nameToId[key]) {
          p.positionId = nameToId[key]
          updated++
        }
      })

      if (updated > 0) {
        fs.writeFileSync(OSB_FILE, JSON.stringify(osbData, null, 2))
        console.log('\nAktualizováno:', updated, 'pozic v', OSB_FILE)
      }
    }

  } finally {
    await browser.close()
  }
}

main().catch(console.error)
