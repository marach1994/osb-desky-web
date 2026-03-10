// debug - dump všech nadpisů formát-sekcí
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const fs = require('fs')
const path = require('path')

const EMAIL = 'marach1994@gmail.com'
const PASSWORD = 'MaraCh7779!'
const LOGIN_URL = 'https://affiliate.heureka.cz/login'
const SS_DIR = path.join(__dirname, 'afil-screenshots')

if (!fs.existsSync(SS_DIR)) fs.mkdirSync(SS_DIR, { recursive: true })

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function login(page) {
  await page.goto(LOGIN_URL, { waitUntil: 'networkidle2', timeout: 30000 })
  const inputs = await page.$$('input:not([type="hidden"])')
  await inputs[0].click({ clickCount: 3 }); await inputs[0].type(EMAIL)
  await inputs[1].click({ clickCount: 3 }); await inputs[1].type(PASSWORD)
  await sleep(300)
  const btn = await page.$('button[type="submit"]') || await page.$('button')
  await btn.click()
  await sleep(3000)
}

async function main() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 1400, height: 900 })

  await login(page)

  const testUrl = 'https://lazury-moridla-na-drevo.heureka.cz/f:33526:43471788/'

  await page.goto('https://affiliate.heureka.cz/webmaster/webs/0/positions/0/edit?type=products-rotator', { waitUntil: 'networkidle2', timeout: 30000 })
  await sleep(1000)
  await page.click('button.pa-ui-button')
  await sleep(1000)
  const urlInput = await page.$('input[type="text"]')
  await urlInput.click({ clickCount: 3 })
  await urlInput.type(testUrl)
  await sleep(300)
  const btns0 = await page.$$('button')
  for (var i = 0; i < btns0.length; i++) {
    const t = await btns0[i].evaluate(function(b) { return b.textContent.trim() })
    if (t === 'Načíst') { await btns0[i].click(); break }
  }
  await sleep(4000)

  // Dump HTML struktury všech format sekcí - hledej "create-position" buttony a jejich nadřazené sekce
  const sectionInfo = await page.evaluate(function() {
    var createBtns = Array.from(document.querySelectorAll('button.create-position'))
    return createBtns.map(function(btn, idx) {
      // Jdi nahoru přes DOM a hledej nadpis sekce
      var el = btn
      var titles = []
      for (var depth = 0; depth < 20; depth++) {
        el = el.parentElement
        if (!el || el === document.body) break
        // Text přímo v tomto elementu (ne potomci)
        var ownText = Array.from(el.childNodes)
          .filter(function(n) { return n.nodeType === 3 && n.textContent.trim() })
          .map(function(n) { return n.textContent.trim() })
          .join(' ')
        if (ownText) titles.push({ depth: depth, tag: el.tagName, class: el.className.substring(0, 40), text: ownText.substring(0, 80) })
        // H-tagy v tomto elementu (ne v potomcích potomků)
        var hs = Array.from(el.children).filter(function(c) { return ['H1','H2','H3','H4','H5'].includes(c.tagName) })
        hs.forEach(function(h) { titles.push({ depth: depth, tag: h.tagName, class: h.className.substring(0, 40), text: h.textContent.trim().substring(0, 80) }) })
      }
      // Vezmi nejbližší smysluplný nadpis
      var title = titles.find(function(t) { return t.text.length > 3 && !t.text.match(/^\s*$/) })
      return { idx: idx, title: title ? title.text : '?', allTitles: titles.slice(0, 5) }
    })
  })

  console.log('Format sections:')
  sectionInfo.forEach(function(s) {
    console.log('[' + s.idx + '] ' + s.title)
    if (s.allTitles && s.allTitles.length > 0) {
      s.allTitles.forEach(function(t) { console.log('     d' + t.depth + ' ' + t.tag + ' "' + t.text + '"') })
    }
  })

  // Alternativně: dump page source chunk s "vlastní" nebo "bez stylu"
  const source = await page.evaluate(function() {
    return document.documentElement.innerHTML
  })
  const idx = source.indexOf('vlastní')
  if (idx > -1) {
    console.log('\nHTML kolem "vlastní":', source.substring(Math.max(0, idx - 200), idx + 300))
  } else {
    console.log('\n"vlastní" not found in HTML')
  }

  await browser.close()
}

main().catch(console.error)
