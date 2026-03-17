#!/usr/bin/env node
/**
 * create-osb-positions.js
 *
 * Vytvoří dedikované Heureka affiliate pozice pro OSB desky kategoriální stránky.
 * Výsledná positionId se uloží do scripts/osb-positions.json
 *
 * Usage:
 *   node scripts/create-osb-positions.js
 *   node scripts/create-osb-positions.js --dry-run
 */

const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const fs = require('fs')
const path = require('path')

const EMAIL = 'marach1994@gmail.com'
const PASSWORD = 'MaraCh7779!'
const LOGIN_URL = 'https://affiliate.heureka.cz/login'
const OUTPUT_FILE = path.join(__dirname, 'osb-positions.json')

const DRY_RUN = process.argv.includes('--dry-run')

// Pozice ke vytvoření: název, categoryId, categoryFilters (prázdný = vše)
// categoryId 6038 = OSB desky na Heurece
const POSITIONS_TO_CREATE = [
  {
    name: 'OSB desky - hlavní stránka',
    categoryId: '6038',
    categoryFilters: '',
    page: '/osb-desky',
  },
  {
    name: 'OSB desky - podle síly',
    categoryId: '6038',
    categoryFilters: '',
    page: '/osb-desky/podle-silly',
  },
  {
    name: 'OSB desky 8mm',
    categoryId: '6038',
    categoryFilters: '',
    page: '/osb-desky/8mm',
  },
  {
    name: 'OSB desky 12mm',
    categoryId: '6038',
    categoryFilters: '',
    page: '/osb-desky/12mm',
  },
  {
    name: 'OSB desky 15mm',
    categoryId: '6038',
    categoryFilters: '',
    page: '/osb-desky/15mm',
  },
  {
    name: 'OSB desky 18mm',
    categoryId: '6038',
    categoryFilters: 'f:30959:42465755',
    page: '/osb-desky/18mm',
  },
  {
    name: 'OSB desky 22mm',
    categoryId: '6038',
    categoryFilters: 'f:30959:42465760',
    page: '/osb-desky/22mm',
  },
  {
    name: 'OSB desky 25mm',
    categoryId: '6038',
    categoryFilters: 'f:30959:42465756',
    page: '/osb-desky/25mm',
  },
  {
    name: 'OSB desky - podlaha',
    categoryId: '6038',
    categoryFilters: '',
    page: '/osb-desky/podlaha',
  },
  {
    name: 'OSB desky - garáž',
    categoryId: '6038',
    categoryFilters: '',
    page: '/osb-desky/garaz',
  },
  {
    name: 'OSB desky - příslušenství',
    categoryId: '6038',
    categoryFilters: '',
    page: '/osb-desky/prislusenstvi',
  },
]

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
  if (url.includes('/login')) throw new Error('Login selhal')
  console.log('Přihlášen:', url)
}

async function createPosition(page, pos) {
  const filtersEncoded = pos.categoryFilters ? encodeURIComponent(pos.categoryFilters) : ''
  let directUrl = 'https://affiliate.heureka.cz/webmaster/webs/25761/positions/category-position?groupName=products-rotator#/?categoryId=' + pos.categoryId
  if (filtersEncoded) directUrl += '&categoryFilters=' + filtersEncoded

  await page.goto(directUrl, { waitUntil: 'networkidle2', timeout: 30000 })

  try {
    await page.waitForFunction(function() {
      var h3 = document.querySelector('h3')
      return h3 && h3.textContent.trim().length > 0
    }, { timeout: 10000 })
  } catch (e) {
    throw new Error('Kategorie nenačtena (H3 timeout)')
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
  if (totalCreateBtns === 0) throw new Error('Tlačítko "Vytvořit novou" nenalezeno')

  const btnIdx = createBtnIndex > -1 ? createBtnIndex : totalCreateBtns - 1

  if (DRY_RUN) {
    console.log('  DRY-RUN: by vytvořil pozici "' + pos.name + '"')
    return null
  }

  await page.evaluate(function(idx) {
    var btns = Array.from(document.querySelectorAll('button.create-position'))
    if (btns[idx]) btns[idx].click()
  }, btnIdx)
  await sleep(1000)

  await page.waitForSelector('input[type="text"]', { timeout: 5000 })
  const inputs = await page.$$('input[type="text"]')
  const lastInput = inputs[inputs.length - 1]
  await lastInput.click({ clickCount: 3 })
  await lastInput.type(pos.name, { delay: 10 })
  await sleep(300)

  await page.evaluate(function() {
    var btns = Array.from(document.querySelectorAll('button'))
    var btn = btns.find(function(b) {
      var t = b.textContent.trim()
      return t === 'Vytvořit' || t === 'VYTVOŘIT'
    })
    if (btn) btn.click()
  })
  await sleep(2500)

  const currentUrl = page.url()
  const positionIdMatch = currentUrl.match(/[?&]positionId=(\d+)/) || currentUrl.match(/\/positions\/(\d+)/)
  let positionId = positionIdMatch ? positionIdMatch[1] : null

  if (!positionId) {
    positionId = await page.evaluate(function(name) {
      var selects = Array.from(document.querySelectorAll('select'))
      for (var i = 0; i < selects.length; i++) {
        var opt = Array.from(selects[i].options).find(function(o) { return o.text.trim() === name })
        if (opt) return opt.value || null
      }
      return null
    }, pos.name)
  }

  return positionId
}

async function main() {
  console.log('=== Heureka OSB Position Creator ===')
  if (DRY_RUN) console.log('MODE: DRY RUN')
  console.log('')

  let results = []
  if (fs.existsSync(OUTPUT_FILE)) {
    results = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'))
    console.log('Existující výsledky: ' + results.length)
  }
  const existingNames = new Set(results.map(function(r) { return r.name }))

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1400, height: 900 })

  try {
    await login(page)

    let success = 0, skipped = 0, failed = 0

    for (var i = 0; i < POSITIONS_TO_CREATE.length; i++) {
      const pos = POSITIONS_TO_CREATE[i]
      console.log('[' + (i + 1) + '/' + POSITIONS_TO_CREATE.length + '] ' + pos.name)

      if (existingNames.has(pos.name)) {
        console.log('  SKIP: již existuje')
        skipped++
        continue
      }

      try {
        const positionId = await createPosition(page, pos)
        console.log('  OK: positionId=' + (positionId || '?'))

        results.push({
          name: pos.name,
          positionId: positionId,
          categoryId: pos.categoryId,
          categoryFilters: pos.categoryFilters,
          page: pos.page,
          createdAt: new Date().toISOString(),
        })
        existingNames.add(pos.name)
        success++

        if (!DRY_RUN) {
          fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2), 'utf-8')
        }

        await sleep(700)
      } catch (e) {
        console.log('  ERROR: ' + e.message)
        failed++
        await sleep(1000)
      }
    }

    console.log('\n=== HOTOVO ===')
    console.log('Vytvořeno: ' + success)
    console.log('Přeskočeno: ' + skipped)
    console.log('Chyby: ' + failed)
    if (!DRY_RUN) console.log('Uloženo: ' + OUTPUT_FILE)

  } finally {
    await browser.close()
  }
}

main().catch(console.error)
