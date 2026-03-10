// debug-recreate.js - debuguje proč se nepodaří vytvořit pozici
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const fs = require('fs')
const path = require('path')

const EMAIL = 'marach1994@gmail.com'
const PASSWORD = 'MaraCh7779!'
const LOGIN_URL = 'https://affiliate.heureka.cz/login'
const SS_DIR = path.join(__dirname, 'debug-recreate-ss')

if (!fs.existsSync(SS_DIR)) fs.mkdirSync(SS_DIR)

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }
let ssIdx = 0
async function ss(page, label) {
  const file = path.join(SS_DIR, (ssIdx++).toString().padStart(2, '0') + '-' + label + '.png')
  await page.screenshot({ path: file, fullPage: false })
  console.log('  [SS]', path.basename(file))
}

async function main() {
  const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox'], defaultViewport: { width: 1400, height: 900 } })
  const page = await browser.newPage()
  await page.setRequestInterception(true)

  const apiLogs = []
  page.on('request', req => req.continue())
  page.on('response', async function(resp) {
    const url = resp.url()
    if (url.includes('/api/') && !url.includes('analytics')) {
      try {
        const ct = resp.headers()['content-type'] || ''
        if (ct.includes('json')) {
          const j = await resp.json()
          apiLogs.push({ url, json: j })
        }
      } catch (e) {}
    }
  })

  try {
    // Login
    await page.goto(LOGIN_URL, { waitUntil: 'networkidle2', timeout: 30000 })
    const inputs = await page.$$('input:not([type="hidden"])')
    await inputs[0].click({ clickCount: 3 }); await inputs[0].type(EMAIL)
    await inputs[1].click({ clickCount: 3 }); await inputs[1].type(PASSWORD)
    await sleep(300)
    const btn = await page.$('button[type="submit"]') || await page.$('button')
    await btn.click()
    await page.waitForFunction(() => !window.location.href.includes('/login'), { timeout: 15000 }).catch(() => {})
    await sleep(1500)
    console.log('Logged in:', page.url())

    // Naviguj na Het Interiérové barvy
    // categoryId: 3555, filters: f:15929:557910
    const url = 'https://affiliate.heureka.cz/webmaster/webs/25761/positions/category-position?groupName=products-rotator#/?categoryId=3555&categoryFilters=f%3A15929%3A557910'
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })

    await page.waitForFunction(() => {
      const h3 = document.querySelector('h3')
      return h3 && h3.textContent.trim().length > 0
    }, { timeout: 10000 })
    await sleep(1000)

    await ss(page, 'after-load')

    // Zjisti stav create-position buttonů
    const btnInfo = await page.evaluate(function() {
      const btns = Array.from(document.querySelectorAll('button.create-position'))
      return btns.map(function(b, i) {
        return { idx: i, text: b.textContent.trim(), disabled: b.disabled, visible: b.offsetParent !== null }
      })
    })
    console.log('create-position buttons:', JSON.stringify(btnInfo))

    // Najdi plainhtml button
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
    console.log('plainhtml create-position button index:', createBtnIndex)

    const totalBtns = await page.$$eval('button.create-position', b => b.length)
    console.log('total create-position buttons:', totalBtns)

    const btnIdx = createBtnIndex > -1 ? createBtnIndex : totalBtns - 1
    console.log('Using button index:', btnIdx)

    // Klikni na button
    await page.evaluate(function(idx) {
      const btns = Array.from(document.querySelectorAll('button.create-position'))
      console.log('Clicking button', idx, btns[idx] ? btns[idx].textContent : 'NOT FOUND')
      if (btns[idx]) btns[idx].click()
    }, btnIdx)
    await sleep(1500)

    await ss(page, 'after-create-click')

    // Zkontroluj jestli se modal otevřel
    const modalInfo = await page.evaluate(function() {
      const inputs = Array.from(document.querySelectorAll('input[type="text"]'))
      const modal = document.querySelector('.modal, [class*="modal"], [class*="dialog"]')
      return {
        inputCount: inputs.length,
        inputs: inputs.map(function(inp) {
          return { id: inp.id, name: inp.name, value: inp.value, placeholder: inp.placeholder, visible: inp.offsetParent !== null }
        }),
        modalExists: !!modal,
        modalClass: modal ? modal.className.substring(0, 50) : null,
        // Hledej "Vytvořit" button
        createBtn: (function() {
          var btns = Array.from(document.querySelectorAll('button'))
          var b = btns.find(function(b) { return b.textContent.trim() === 'Vytvořit' || b.textContent.trim() === 'VYTVOŘIT' })
          return b ? { text: b.textContent.trim(), disabled: b.disabled, visible: b.offsetParent !== null } : null
        })()
      }
    })
    console.log('Modal info:', JSON.stringify(modalInfo, null, 2))

    if (modalInfo.inputCount > 0) {
      // Zadej jméno
      const inputs = await page.$$('input[type="text"]')
      const lastInput = inputs[inputs.length - 1]
      await lastInput.click({ clickCount: 3 })
      await lastInput.type('TEST Het Interiérové barvy DEBUG', { delay: 10 })
      await sleep(500)

      await ss(page, 'after-type')

      // Zobraz co je v inputu
      const inputValue = await page.evaluate(function() {
        const inputs = Array.from(document.querySelectorAll('input[type="text"]'))
        return inputs.map(function(inp) { return { value: inp.value, placeholder: inp.placeholder } })
      })
      console.log('Input values after typing:', JSON.stringify(inputValue))

      // Klikni VYTVOŘIT
      await page.evaluate(function() {
        var btns = Array.from(document.querySelectorAll('button'))
        var btn = btns.find(function(b) { return b.textContent.trim() === 'Vytvořit' || b.textContent.trim() === 'VYTVOŘIT' })
        if (btn) { console.log('Clicking VYTVOŘIT'); btn.click() }
        else console.log('VYTVOŘIT not found')
      })
      await sleep(3000)

      await ss(page, 'after-vytvorit')

      // API response po vytvoření
      console.log('\nAPI calls po vytvoření:')
      apiLogs.forEach(function(r) {
        if (r.url.includes('create') || r.url.includes('Create') || r.url.includes('save') || r.url.includes('position')) {
          console.log('  URL:', r.url)
          console.log('  Data:', JSON.stringify(r.json).substring(0, 300))
        }
      })
    } else {
      console.log('MODAL SE NEOTEVŘEL!')
    }

    console.log('\nScreenshots uloženy v:', SS_DIR)
    console.log('Čekám 10s na prohlédnutí...')
    await sleep(10000)
  } finally {
    await browser.close()
  }
}

main().catch(console.error)
