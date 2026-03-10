// recreate-missing.js
// Vytvoří chybějící Heureka affiliate pozice ze scripts/to-recreate.json
// Po vytvoření stáhne ID z getadvertpositions API a uloží do heureka-positions.json

const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const fs = require('fs')
const path = require('path')

const EMAIL = 'marach1994@gmail.com'
const PASSWORD = 'MaraCh7779!'
const LOGIN_URL = 'https://affiliate.heureka.cz/login'
const POSITIONS_FILE = path.join(__dirname, 'heureka-positions.json')
const TO_RECREATE_FILE = path.join(__dirname, 'to-recreate.json')

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

async function createPosition(page, categoryId, categoryFilters, positionName) {
  const filtersEncoded = encodeURIComponent(categoryFilters)
  const directUrl = 'https://affiliate.heureka.cz/webmaster/webs/25761/positions/category-position?groupName=products-rotator#/?categoryId=' + categoryId + '&categoryFilters=' + filtersEncoded

  await page.goto(directUrl, { waitUntil: 'networkidle2', timeout: 30000 })

  try {
    await page.waitForFunction(function() {
      var h3 = document.querySelector('h3')
      return h3 && h3.textContent.trim().length > 0
    }, { timeout: 10000 })
  } catch (e) {
    throw new Error('Category not loaded (H3 timeout)')
  }

  const createBtnIndex = await page.evaluate(function() {
    var selects = Array.from(document.querySelectorAll('select'))
    for (var si = 0; si < selects.length; si++) {
      var sel = selects[si]
      var hasPlainHtml = Array.from(sel.options).some(function(o) { return o.value === 'plainhtml' })
      if (!hasPlainHtml) continue
      var container = sel
      for (var depth = 0; depth < 10; depth++) {
        container = container.parentElement
        if (!container) break
        var btn = container.querySelector('button.create-position')
        if (btn) {
          var allBtns = Array.from(document.querySelectorAll('button.create-position'))
          return allBtns.indexOf(btn)
        }
      }
    }
    return -1
  })

  const totalCreateBtns = await page.$$eval('button.create-position', function(btns) { return btns.length })
  if (totalCreateBtns === 0) throw new Error('Vytvořit novou button not found')

  const btnIdx = createBtnIndex > -1 ? createBtnIndex : totalCreateBtns - 1

  await page.evaluate(function(idx) {
    var btns = Array.from(document.querySelectorAll('button.create-position'))
    if (btns[idx]) btns[idx].click()
  }, btnIdx)
  await sleep(1000)

  await page.waitForSelector('input[type="text"]', { timeout: 5000 })
  const inputs = await page.$$('input[type="text"]')
  const lastInput = inputs[inputs.length - 1]
  await lastInput.click({ clickCount: 3 })
  await lastInput.type(positionName, { delay: 10 })
  await sleep(300)

  // Klikni VYTVOŘIT
  await page.evaluate(function() {
    var btns = Array.from(document.querySelectorAll('button'))
    var btn = btns.find(function(b) {
      var t = b.textContent.trim()
      return t === 'Vytvořit' || t === 'VYTVOŘIT'
    })
    if (btn) btn.click()
  })
  await sleep(2500)

  return { positionName: positionName }
}

async function fetchPositionId(page, positionName) {
  // Stáhni seznam pozic přes intercepted API request
  let heurekaPositions = []
  const respPromise = new Promise(function(resolve) {
    page.once('response', async function handler(resp) {
      if (resp.url().includes('getadvertpositions')) {
        try {
          const json = await resp.json()
          resolve(json.Items || [])
        } catch (e) { resolve([]) }
      }
    })
    setTimeout(function() { resolve([]) }, 8000)
  })

  // Spusť API call – navigací na stránku která ho triggere
  // Nebo přímo přes page.evaluate
  const result = await page.evaluate(async function() {
    try {
      const resp = await fetch('https://affiliate.heureka.cz/api/advertposition/getadvertpositions', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        body: JSON.stringify({ WebId: 25761 })
      })
      const json = await resp.json()
      return json.Items || []
    } catch (e) { return [] }
  })

  heurekaPositions = result.length > 0 ? result : (await respPromise)

  function normalize(s) { return (s || '').trim().toLowerCase().replace(/\s+/g, ' ') }
  const found = heurekaPositions.find(function(p) {
    return normalize(p.Name) === normalize(positionName)
  })

  return found ? String(found.Id) : null
}

async function main() {
  const toRecreate = JSON.parse(fs.readFileSync(TO_RECREATE_FILE, 'utf-8'))
  const positionsData = JSON.parse(fs.readFileSync(POSITIONS_FILE, 'utf-8'))

  console.log('=== Recreate Missing Positions ===')
  console.log('Pozic k vytvoření:', toRecreate.length)

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1400, height: 900 })
  await page.setRequestInterception(true)
  page.on('request', function(req) { req.continue() })

  try {
    await login(page)

    let success = 0, failed = 0

    for (var i = 0; i < toRecreate.length; i++) {
      const entry = toRecreate[i]
      console.log('\n[' + (i + 1) + '/' + toRecreate.length + '] ' + entry.positionName)

      try {
        await createPosition(page, entry.categoryId, entry.categoryFilters, entry.positionName)

        // Stáhni ID ihned po vytvoření
        await sleep(500)
        const positionId = await fetchPositionId(page, entry.positionName)
        console.log('  OK: positionId=' + (positionId || '?'))

        // Aktualizuj v positionsData
        const idx = positionsData.findIndex(function(p) { return p.positionName === entry.positionName })
        if (idx > -1) {
          positionsData[idx].positionId = positionId
        }

        // Ulož průběžně
        fs.writeFileSync(POSITIONS_FILE, JSON.stringify(positionsData, null, 2), 'utf-8')
        success++
      } catch (e) {
        console.log('  ERROR:', e.message)
        failed++
        await sleep(1000)
      }
    }

    console.log('\n=== HOTOVO ===')
    console.log('Úspěšně:', success)
    console.log('Chyby:', failed)
  } finally {
    await browser.close()
  }
}

main().catch(console.error)
