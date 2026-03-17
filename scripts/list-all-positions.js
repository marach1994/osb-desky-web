// list-all-positions.js - Zobrazí všechny pozice z Heureka affiliate panelu

const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const fs = require('fs')
const path = require('path')

const EMAIL = 'marach1994@gmail.com'
const PASSWORD = 'MaraCh7779!'
const OSB_FILE = path.join(__dirname, 'osb-positions.json')

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }
function normalize(s) { return (s || '').trim().toLowerCase().replace(/\s+/g, ' ') }

async function login(page) {
  await page.goto('https://affiliate.heureka.cz/login', { waitUntil: 'networkidle2', timeout: 30000 })
  const inputs = await page.$$('input:not([type="hidden"])')
  await inputs[0].click({ clickCount: 3 }); await inputs[0].type(EMAIL)
  await inputs[1].click({ clickCount: 3 }); await inputs[1].type(PASSWORD)
  await sleep(300);
  (await page.$('button[type="submit"]') || await page.$('button')).click()
  await page.waitForFunction(() => !window.location.href.includes('/login'), { timeout: 15000 }).catch(() => {})
  await sleep(2000)
  console.log('Přihlášen:', page.url())
}

async function main() {
  const osbData = JSON.parse(fs.readFileSync(OSB_FILE, 'utf-8'))

  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 1400, height: 900 })

  const apis = []
  page.on('response', async function(resp) {
    const url = resp.url()
    if (!url.includes('heureka')) return
    try {
      const ct = resp.headers()['content-type'] || ''
      if (!ct.includes('json')) return
      const text = await resp.text()
      if (text.length < 50 || text.length > 2000000) return
      const json = JSON.parse(text)
      apis.push({ url: url.replace('https://affiliate.heureka.cz', ''), json })
    } catch (e) {}
  })

  try {
    await login(page)

    // Navigace na stránku se seznamem pozic
    console.log('\nNaviguji na seznam pozic...')
    await page.goto('https://affiliate.heureka.cz/webmaster/webs/25761/positions', { waitUntil: 'networkidle2', timeout: 30000 })
    await sleep(4000)
    console.log('URL:', page.url())

    // Zkus přímé API volání
    const apiResult = await page.evaluate(async function() {
      try {
        // Zkus různé endpointy
        const endpoints = [
          '/api/positions/getpositions?webId=25761',
          '/api/positions/list?webId=25761',
          '/api/advertpositions/getadvertpositions',
          '/api/heurekaapi/getadvertpositions',
          '/webmaster/webs/25761/positions/getpositions',
        ]
        const results = []
        for (const ep of endpoints) {
          try {
            const r = await fetch('https://affiliate.heureka.cz' + ep, {
              credentials: 'include',
              headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
            })
            if (r.ok) {
              const text = await r.text()
              results.push({ ep, status: r.status, preview: text.substring(0, 300) })
            } else {
              results.push({ ep, status: r.status })
            }
          } catch (e) {
            results.push({ ep, error: e.message })
          }
        }
        return results
      } catch (e) { return [{ error: e.message }] }
    })

    console.log('\n=== Přímé API testy ===')
    apiResult.forEach(function(r) {
      console.log(r.ep, '->', r.status || r.error)
      if (r.preview) console.log('  Preview:', r.preview.substring(0, 150))
    })

    // Zachycené API calls
    console.log('\n=== Zachycené API calls ===')
    apis.forEach(function(a, i) {
      const keys = Object.keys(a.json)
      const isArr = Array.isArray(a.json)
      const cnt = isArr ? a.json.length : (a.json.Items?.length || a.json.items?.length || '?')
      console.log('[' + i + ']', a.url, '| keys:', isArr ? 'array[' + cnt + ']' : keys.join(','))
      if (cnt && cnt > 0) {
        const sample = isArr ? a.json[0] : (a.json.Items?.[0] || a.json.items?.[0])
        if (sample) console.log('  Sample keys:', Object.keys(sample).join(','))
      }
    })

    // Hledej pozice v zachycených datech
    let allPositions = []
    apis.forEach(function(a) {
      const items = Array.isArray(a.json) ? a.json : (a.json.Items || a.json.items || [])
      if (Array.isArray(items) && items.length > 0) {
        const first = items[0]
        const hasId = first && (first.Id || first.id || first.PositionId || first.positionId)
        const hasName = first && (first.Name || first.name)
        if (hasId && hasName) {
          allPositions = allPositions.concat(items)
          console.log('\nNalezeny pozice v:', a.url, '(' + items.length + ')')
        }
      }
    })

    if (allPositions.length > 0) {
      const nameToId = {}
      allPositions.forEach(function(p) {
        const n = p.Name || p.name || ''
        const id = p.Id || p.id || p.PositionId || p.positionId
        if (n && id) nameToId[normalize(n)] = String(id)
      })

      const osbFound = Object.entries(nameToId).filter(([n]) => n.includes('osb'))
      console.log('\nOSB pozice:', osbFound.length)
      osbFound.forEach(([n, id]) => console.log(' ', id, '|', n))

      let updated = 0
      osbData.forEach(function(p) {
        const id = nameToId[normalize(p.name)]
        if (id) { p.positionId = id; updated++ }
      })
      if (updated > 0) {
        fs.writeFileSync(OSB_FILE, JSON.stringify(osbData, null, 2))
        console.log('\n✅ Aktualizováno', updated, 'pozic')
        osbData.forEach(p => console.log(' ', p.positionId, '|', p.name))
      }
    }

    // Fallback: zobraz HTML stránky
    const pageText = await page.evaluate(() => document.body.innerText)
    console.log('\n=== Obsah stránky (prvních 1000 znaků) ===')
    console.log(pageText.substring(0, 1000))

  } finally {
    await browser.close()
  }
}

main().catch(console.error)
