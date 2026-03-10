// create-heureka-positions.js
// Automaticky zakládá Heureka affiliate pozice pro všechny záznamy v heureka-brands.json
//
// Pro každou značku+kategorii:
// 1. Načte kategorii z URL (Načíst z Heureky)
// 2. Najde sekci s "HTML bez stylu" (plainhtml)
// 3. Klikne "Vytvořit novou"
// 4. Pojmenuje pozici jako "Značka Kategorie"
// 5. Uloží výsledné positionId zpět do JSON
//
// Usage:
//   node scripts/create-heureka-positions.js
//   node scripts/create-heureka-positions.js --limit 10   (prvních 10)
//   node scripts/create-heureka-positions.js --from 50    (od záznamu 50)
//   node scripts/create-heureka-positions.js --dry-run    (bez ukládání)

const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const fs = require('fs')
const path = require('path')

const EMAIL = 'marach1994@gmail.com'
const PASSWORD = 'MaraCh7779!'
const LOGIN_URL = 'https://affiliate.heureka.cz/login'
const BRANDS_FILE = path.join(__dirname, 'heureka-brands.json')
const OUTPUT_FILE = path.join(__dirname, 'heureka-positions.json')

const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const LIMIT = (() => { const i = args.indexOf('--limit'); return i > -1 ? parseInt(args[i + 1]) : Infinity })()
const FROM = (() => { const i = args.indexOf('--from'); return i > -1 ? parseInt(args[i + 1]) : 0 })()

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

  // Čekej na přesměrování pryč z login stránky
  await page.waitForFunction(function() {
    return !window.location.href.includes('/login')
  }, { timeout: 15000 }).catch(function() {})

  await sleep(1500)
  const url = page.url()
  console.log('Přihlášen:', url)
  if (url.includes('/login')) throw new Error('Login failed - still on login page')
}

async function createPosition(page, categoryId, categoryFilters, positionName) {
  // Přímá navigace na URL s parametry - bez nutnosti klikání "Načíst z Heureky"
  const filtersEncoded = encodeURIComponent(categoryFilters)
  const directUrl = 'https://affiliate.heureka.cz/webmaster/webs/25761/positions/category-position?groupName=products-rotator#/?categoryId=' + categoryId + '&categoryFilters=' + filtersEncoded

  await page.goto(directUrl, { waitUntil: 'networkidle2', timeout: 30000 })

  // Hash URL je SPA - čekej na H3 s názvem kategorie
  try {
    await page.waitForFunction(function() {
      var h3 = document.querySelector('h3')
      return h3 && h3.textContent.trim().length > 0
    }, { timeout: 10000 })
  } catch (e) {
    throw new Error('Category not loaded (H3 timeout)')
  }

  // 6. Najdi "Vytvořit novou" button v sekci s plainhtml (HTML bez stylu)
  //    Strategie: hledej select s value "plainhtml" a v jeho kontejneru najdi create-position button
  const createBtnIndex = await page.evaluate(function() {
    // Najdi select s option "plainhtml"
    var selects = Array.from(document.querySelectorAll('select'))
    for (var si = 0; si < selects.length; si++) {
      var sel = selects[si]
      var hasPlainHtml = Array.from(sel.options).some(function(o) { return o.value === 'plainhtml' })
      if (!hasPlainHtml) continue

      // Najdi "Vytvořit novou" button v nadřazeném kontejneru
      var container = sel
      for (var depth = 0; depth < 10; depth++) {
        container = container.parentElement
        if (!container) break
        var btn = container.querySelector('button.create-position')
        if (btn) {
          // Najdi index tohoto buttonu mezi všemi create-position buttony
          var allBtns = Array.from(document.querySelectorAll('button.create-position'))
          return allBtns.indexOf(btn)
        }
      }
    }
    return -1
  })

  if (createBtnIndex === -1) {
    // Fallback: pokud plainhtml sekce není viditelná, zkus poslední create-position button
    console.log('  WARN: plainhtml section not found, using last create-position button')
  }

  const totalCreateBtns = await page.$$eval('button.create-position', function(btns) { return btns.length })
  if (totalCreateBtns === 0) throw new Error('Vytvořit novou button not found')

  const btnIdx = createBtnIndex > -1 ? createBtnIndex : totalCreateBtns - 1

  if (DRY_RUN) {
    console.log('  DRY-RUN: would click create button [' + btnIdx + '] and name: "' + positionName + '"')
    return { positionId: null, positionName: positionName, dryRun: true }
  }

  // 7. Klikni "Vytvořit novou" přes evaluate (vyhne se stale element)
  await page.evaluate(function(idx) {
    var btns = Array.from(document.querySelectorAll('button.create-position'))
    if (btns[idx]) btns[idx].click()
  }, btnIdx)
  await sleep(1000)

  // 8. Zadej jméno do modalu - čekej na modal input
  await page.waitForSelector('input[type="text"]', { timeout: 5000 })
  // Viditelné inputy - modal má jeden input pro jméno
  const inputs = await page.$$('input[type="text"]')
  const lastInput = inputs[inputs.length - 1]
  await lastInput.click({ clickCount: 3 })
  await lastInput.type(positionName, { delay: 10 })
  await sleep(300)

  // 9. Klikni "VYTVOŘIT" přes evaluate (scroll-safe)
  await page.evaluate(function() {
    var btns = Array.from(document.querySelectorAll('button'))
    var btn = btns.find(function(b) {
      var t = b.textContent.trim()
      return t === 'Vytvořit' || t === 'VYTVOŘIT'
    })
    if (btn) btn.click()
  })
  await sleep(2500)

  // 10. Zachyť nové positionId z URL nebo ze stránky
  const currentUrl = page.url()
  const positionIdMatch = currentUrl.match(/[?&]positionId=(\d+)/) || currentUrl.match(/\/positions\/(\d+)/)
  let positionId = positionIdMatch ? positionIdMatch[1] : null

  // Alternativně ze stránky - hledej pozici v selectu
  if (!positionId) {
    positionId = await page.evaluate(function(name) {
      var selects = Array.from(document.querySelectorAll('select'))
      for (var i = 0; i < selects.length; i++) {
        var opt = Array.from(selects[i].options).find(function(o) { return o.text.trim() === name })
        if (opt) return opt.value || null
      }
      return null
    }, positionName)
  }

  return { positionId: positionId, positionName: positionName, url: currentUrl }
}

async function main() {
  const brands = JSON.parse(fs.readFileSync(BRANDS_FILE, 'utf-8'))

  // Flat seznam všech brand entries
  const allEntries = []
  brands.forEach(function(cat) {
    cat.brands.forEach(function(b) {
      allEntries.push({ category: cat.category, categoryId: cat.categoryId, brand: b })
    })
  })

  const entries = allEntries.slice(FROM, FROM + LIMIT)
  const total = entries.length

  console.log('=== Heureka Affiliate Position Creator ===')
  console.log('Celkem k zpracování: ' + total + ' (z ' + allEntries.length + ')')
  if (DRY_RUN) console.log('MODE: DRY RUN (bez ukládání)')
  console.log('')

  // Načti existující výsledky pokud soubor existuje
  let results = []
  if (fs.existsSync(OUTPUT_FILE)) {
    results = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'))
    console.log('Existující výsledky: ' + results.length + ' pozic')
  }

  const existingNames = new Set(results.map(function(r) { return r.positionName }))

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1400, height: 900 })

  try {
    await login(page)

    let success = 0, skipped = 0, failed = 0

    for (var i = 0; i < entries.length; i++) {
      const entry = entries[i]
      const brand = entry.brand
      const positionName = brand.name // "Remmers Lazury a mořidla na dřevo"

      console.log('[' + (i + 1) + '/' + total + '] ' + positionName)

      // Přeskoč pokud již existuje
      if (existingNames.has(positionName)) {
        console.log('  SKIP: already exists')
        skipped++
        continue
      }

      try {
        const result = await createPosition(page, entry.categoryId, brand.categoryFilters, positionName)
        console.log('  OK: positionId=' + (result.positionId || '?'))

        results.push({
          positionName: positionName,
          positionId: result.positionId,
          brand: brand.brand,
          category: entry.category,
          categoryId: entry.categoryId,
          categoryFilters: brand.categoryFilters,
          brandUrl: brand.url,
          createdAt: new Date().toISOString()
        })

        existingNames.add(positionName)
        success++

        // Ulož průběžně
        if (!DRY_RUN) {
          fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2), 'utf-8')
        }

        await sleep(500) // Pauza mezi požadavky
      } catch (e) {
        console.log('  ERROR: ' + e.message)
        failed++
        // Pokračuj na další
        await sleep(1000)
      }
    }

    console.log('\n=== HOTOVO ===')
    console.log('Úspěšně: ' + success)
    console.log('Přeskočeno: ' + skipped)
    console.log('Chyby: ' + failed)
    if (!DRY_RUN) console.log('Uloženo: ' + OUTPUT_FILE)
  } finally {
    await browser.close()
  }
}

main().catch(console.error)
