// fetch-position-ids.js
// Stáhne seznam všech pozic z Heureka affiliate panelu a doplní positionId do heureka-positions.json

const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const fs = require('fs')
const path = require('path')

const EMAIL = 'marach1994@gmail.com'
const PASSWORD = 'MaraCh7779!'
const LOGIN_URL = 'https://affiliate.heureka.cz/login'
const POSITIONS_FILE = path.join(__dirname, 'heureka-positions.json')
const DRY_RUN = process.argv.includes('--dry-run')

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function login(page) {
  console.log('Přihlašování...')
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
  if (url.includes('/login')) throw new Error('Login failed')
  console.log('Přihlášen:', url)
}

async function main() {
  const positionsData = JSON.parse(fs.readFileSync(POSITIONS_FILE, 'utf-8'))
  console.log('Pozic v souboru:', positionsData.length)
  if (DRY_RUN) console.log('MODE: DRY RUN\n')

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1400, height: 900 })

  // Intercept: zachyť přesné requestyi response pro getadvertpositions
  await page.setRequestInterception(true)

  const capturedRequests = []
  const capturedResponses = []

  page.on('request', function(req) {
    const url = req.url()
    if (url.includes('getadvertpositions') || url.includes('getpositions') || url.includes('position')) {
      capturedRequests.push({
        url,
        method: req.method(),
        headers: req.headers(),
        postData: req.postData()
      })
    }
    req.continue()
  })

  page.on('response', async function(resp) {
    const url = resp.url()
    if (url.includes('getadvertpositions') || url.includes('getpositions')) {
      try {
        const json = await resp.json()
        capturedResponses.push({ url, json })
      } catch (e) {}
    }
  })

  try {
    await login(page)

    // Načti category-position stránku která zavolá getadvertpositions pro select
    const testUrl = 'https://affiliate.heureka.cz/webmaster/webs/25761/positions/category-position?groupName=products-rotator#/?categoryId=3555&categoryFilters=f%3A15929%3A557910'
    console.log('Načítám stránku...')
    await page.goto(testUrl, { waitUntil: 'networkidle2', timeout: 30000 })
    await sleep(5000)

    console.log('\n=== Zachycené requests ===')
    capturedRequests.forEach(function(r) {
      console.log('URL:', r.url)
      console.log('Method:', r.method)
      console.log('PostData:', r.postData ? r.postData.substring(0, 300) : '(none)')
      console.log('Headers:', JSON.stringify(r.headers).substring(0, 500))
      console.log('---')
    })

    console.log('\n=== Zachycené responses ===')
    capturedResponses.forEach(function(r) {
      console.log('URL:', r.url)
      const items = r.json.Items || r.json.items || []
      console.log('Items count:', items.length)
      if (items.length > 0) console.log('Sample:', JSON.stringify(items.slice(0, 2)))
      console.log('TotalItemsCount:', r.json.TotalItemsCount)
      console.log('---')
    })

    // Pokud máme response s positions, použij je rovnou
    let allPositions = []
    for (const r of capturedResponses) {
      const items = r.json.Items || r.json.items || []
      if (items.length > 0 && (items[0].Id || items[0].id)) {
        allPositions = [...allPositions, ...items]
      }
    }

    // Pokud nemáme dost, replikuj request pro všechny stránky
    if (capturedRequests.length > 0 && capturedResponses.length > 0) {
      const firstReq = capturedRequests[0]
      const firstResp = capturedResponses[0]
      const totalCount = firstResp.json.TotalItemsCount || 0
      console.log('\nCelkem pozic na serveru:', totalCount)

      // Zjisti pageSize z requestu
      let pageSize = 10
      if (firstReq.postData) {
        try {
          const pd = JSON.parse(firstReq.postData)
          pageSize = pd.pageSize || pd.PageSize || pd.take || 10
        } catch (e) {
          // URL encoded
          const m = firstReq.postData.match(/pageSize=(\d+)/i)
          if (m) pageSize = parseInt(m[1])
        }
      }
      console.log('PageSize:', pageSize)

      const totalPages = Math.ceil(totalCount / pageSize)
      console.log('Celkem stránek:', totalPages)

      // Stáhni zbývající stránky replikováním requestu
      for (let pn = 2; pn <= totalPages; pn++) {
        let body = firstReq.postData || ''

        // Uprav pageNumber v body
        try {
          const pd = JSON.parse(body)
          pd.pageNumber = pn
          pd.PageNumber = pn
          body = JSON.stringify(pd)
        } catch (e) {
          body = body.replace(/pageNumber=\d+/i, 'pageNumber=' + pn)
          if (!body.includes('pageNumber')) body += '&pageNumber=' + pn
        }

        const result = await page.evaluate(async function(url, method, headers, body) {
          try {
            const resp = await fetch(url, {
              method: method,
              credentials: 'include',
              headers: Object.assign({}, headers, { 'Accept': 'application/json' }),
              body: body || undefined
            })
            const text = await resp.text()
            return { status: resp.status, text: text }
          } catch (e) {
            return { error: e.message }
          }
        }, firstReq.url, firstReq.method, firstReq.headers, body)

        if (result.error || result.status !== 200) {
          console.log('Stránka', pn, 'error:', result.error || result.status)
          break
        }

        let data
        try {
          data = JSON.parse(result.text)
        } catch (e) {
          console.log('Parse error page', pn)
          break
        }

        const items = data.Items || data.items || []
        allPositions = [...allPositions, ...items]
        console.log('Stránka', pn, ':', items.length, 'položek, celkem:', allPositions.length)
        if (items.length === 0) break
      }
    }

    console.log('\nCelkem stažených pozic:', allPositions.length)

    if (allPositions.length === 0) {
      console.log('Nepodařilo se stáhnout pozice!')
      return
    }

    // Mapuj positionId podle jména
    function normalize(s) { return (s || '').trim().toLowerCase().replace(/\s+/g, ' ') }

    const nameToId = {}
    allPositions.forEach(function(p) {
      const name = p.Name || p.name || ''
      const id = p.Id || p.id || p.PositionId || p.positionId
      if (name && id) nameToId[normalize(name)] = String(id)
    })

    let updated = 0, notFound = 0
    const notFoundNames = []
    positionsData.forEach(function(p) {
      const key = normalize(p.positionName)
      const id = nameToId[key]
      if (id) {
        p.positionId = id
        updated++
      } else {
        notFound++
        if (notFoundNames.length < 20) notFoundNames.push(p.positionName)
      }
    })

    console.log('\n=== Výsledek ===')
    console.log('Aktualizováno:', updated)
    console.log('Nenalezeno:', notFound)
    if (notFoundNames.length > 0) {
      console.log('Nenalezené (první):', notFoundNames.slice(0, 10))
    }

    if (!DRY_RUN && updated > 0) {
      fs.writeFileSync(POSITIONS_FILE, JSON.stringify(positionsData, null, 2), 'utf-8')
      console.log('\nUloženo:', POSITIONS_FILE)
    }

  } finally {
    await browser.close()
  }
}

main().catch(console.error)
