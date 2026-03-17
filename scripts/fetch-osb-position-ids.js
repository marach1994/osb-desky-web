// fetch-osb-position-ids.js
// Načte IDs nově vytvořených OSB pozic z Heureka affiliate panelu
// a uloží je do osb-positions.json

const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const fs = require('fs')
const path = require('path')

const EMAIL = 'marach1994@gmail.com'
const PASSWORD = 'MaraCh7779!'
const LOGIN_URL = 'https://affiliate.heureka.cz/login'
const OSB_FILE = path.join(__dirname, 'osb-positions.json')

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }
function normalize(s) { return (s || '').trim().toLowerCase().replace(/\s+/g, ' ') }

async function login(page) {
  await page.goto(LOGIN_URL, { waitUntil: 'networkidle2', timeout: 30000 })
  const inputs = await page.$$('input:not([type="hidden"])')
  await inputs[0].click({ clickCount: 3 }); await inputs[0].type(EMAIL)
  await inputs[1].click({ clickCount: 3 }); await inputs[1].type(PASSWORD)
  await sleep(300)
  const btn = await page.$('button[type="submit"]') || await page.$('button')
  await btn.click()
  await page.waitForFunction(function() {
    return !window.location.href.includes('/login')
  }, { timeout: 15000 }).catch(function() {})
  await sleep(1500)
  const url = page.url()
  if (url.includes('/login')) throw new Error('Login selhal')
  console.log('Přihlášen:', url)
}

async function main() {
  const osbData = JSON.parse(fs.readFileSync(OSB_FILE, 'utf-8'))
  const names = new Set(osbData.map(function(p) { return normalize(p.name) }))
  console.log('Hledám IDs pro', osbData.length, 'pozic')

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1400, height: 900 })

  await page.setRequestInterception(true)
  const capturedResponses = []
  const capturedReqs = []

  page.on('request', function(req) {
    const url = req.url()
    if (url.includes('position') || url.includes('Position') || url.includes('advertpos')) {
      capturedReqs.push({ url, method: req.method(), headers: req.headers(), postData: req.postData() })
    }
    req.continue()
  })

  page.on('response', async function(resp) {
    const url = resp.url()
    if (url.includes('position') || url.includes('Position') || url.includes('advertpos')) {
      try {
        const text = await resp.text()
        if (text.includes('"Id"') || text.includes('"id"') || text.includes('"PositionId"')) {
          capturedResponses.push({ url, text })
        }
      } catch (e) {}
    }
  })

  try {
    await login(page)

    // Načti stránku kde se zobrazuje select s pozicemi - použij OSB kategorii
    const testUrl = 'https://affiliate.heureka.cz/webmaster/webs/25761/positions/category-position?groupName=products-rotator#/?categoryId=6038&categoryFilters='
    console.log('Načítám stránku s OSB pozicemi...')
    await page.goto(testUrl, { waitUntil: 'networkidle2', timeout: 30000 })
    await sleep(5000)

    // Vypis Select options přímo ze stránky
    const selectOptions = await page.evaluate(function() {
      const results = []
      const selects = document.querySelectorAll('select')
      selects.forEach(function(sel) {
        Array.from(sel.options).forEach(function(opt) {
          if (opt.value && opt.text.trim()) {
            results.push({ value: opt.value, text: opt.text.trim() })
          }
        })
      })
      return results
    })

    console.log('Select options nalezeno:', selectOptions.length)
    const nameToId = {}
    selectOptions.forEach(function(o) {
      nameToId[normalize(o.text)] = o.value
    })

    // Také zkus z responses
    capturedResponses.forEach(function(r) {
      try {
        const json = JSON.parse(r.text)
        const items = json.Items || json.items || json.Data || json.data || []
        if (Array.isArray(items)) {
          items.forEach(function(item) {
            const n = item.Name || item.name || ''
            const id = item.Id || item.id || item.PositionId || item.positionId
            if (n && id) nameToId[normalize(n)] = String(id)
          })
        }
      } catch (e) {}
    })

    console.log('Celkem pozic v mapě:', Object.keys(nameToId).length)
    if (Object.keys(nameToId).length > 0) {
      console.log('Ukázka:', JSON.stringify(Object.entries(nameToId).slice(0, 5)))
    }

    let updated = 0, missing = 0
    osbData.forEach(function(p) {
      const key = normalize(p.name)
      const id = nameToId[key]
      if (id) {
        p.positionId = id
        console.log('  ✅', p.name, '→', id)
        updated++
      } else {
        console.log('  ❓', p.name, '(nenalezeno)')
        missing++
      }
    })

    console.log('\nAktualizováno:', updated, '| Nenalezeno:', missing)
    fs.writeFileSync(OSB_FILE, JSON.stringify(osbData, null, 2), 'utf-8')
    console.log('Uloženo:', OSB_FILE)

    // Pokud stále chybí IDs, zkus replikovat request pro více stránek
    if (missing > 0 && capturedReqs.length > 0) {
      console.log('\nZkouším paginated fetch...')
      const reqInfo = capturedReqs.find(function(r) { return r.postData })
      if (reqInfo) {
        for (let page2 = 2; page2 <= 20; page2++) {
          let body = reqInfo.postData
          try {
            const pd = JSON.parse(body)
            pd.pageNumber = page2
            body = JSON.stringify(pd)
          } catch (e) {
            body = body.replace(/pageNumber=\d+/i, 'pageNumber=' + page2)
          }

          const result = await page.evaluate(async function(url, method, headers, body) {
            try {
              const r = await fetch(url, { method, credentials: 'include', headers, body })
              return { status: r.status, text: await r.text() }
            } catch (e) { return { error: e.message } }
          }, reqInfo.url, reqInfo.method, reqInfo.headers, body)

          if (result.error || result.status !== 200) break
          let data
          try { data = JSON.parse(result.text) } catch (e) { break }
          const items = data.Items || data.items || []
          if (items.length === 0) break

          items.forEach(function(item) {
            const n = item.Name || item.name || ''
            const id = item.Id || item.id || item.PositionId || item.positionId
            if (n && id) nameToId[normalize(n)] = String(id)
          })
          console.log('Stránka', page2, ':', items.length, 'položek')
        }

        let updated2 = 0
        osbData.forEach(function(p) {
          if (!p.positionId || p.positionId === null) {
            const key = normalize(p.name)
            const id = nameToId[key]
            if (id) {
              p.positionId = id
              console.log('  ✅', p.name, '→', id)
              updated2++
            }
          }
        })
        if (updated2 > 0) {
          fs.writeFileSync(OSB_FILE, JSON.stringify(osbData, null, 2), 'utf-8')
          console.log('Dodatečně aktualizováno:', updated2)
        }
      }
    }

  } finally {
    await browser.close()
  }
}

main().catch(console.error)
