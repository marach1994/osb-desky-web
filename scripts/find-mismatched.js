// Porovná nenalezené pozice se seznamem ze SPA (getadvertpositions)
// Zachytí response přímo a uloží ji pro analýzu

const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const fs = require('fs')
const path = require('path')

const EMAIL = 'marach1994@gmail.com'
const PASSWORD = 'MaraCh7779!'
const LOGIN_URL = 'https://affiliate.heureka.cz/login'

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

const notFound = [
  'Het Interiérové barvy', 'Dulux Interiérové barvy', 'Flügger Interiérové barvy',
  'Tikkurila Interiérové barvy', 'Primalex Interiérové barvy', 'San Marco Interiérové barvy',
  'Barvy a Laky Hostivař Interiérové barvy', 'Colorlak Interiérové barvy',
  'Akzo Interiérové barvy', 'Kittfort Interiérové barvy', 'Sniezka Interiérové barvy',
  'Mapei Interiérové barvy', 'Jub Interiérové barvy', 'Adler Česko Interiérové barvy',
  'Obi Interiérové barvy', 'Caparol Interiérové barvy', 'Barvy a laky Teluria Interiérové barvy',
  'Swingcolor Interiérové barvy', 'Hornbach Interiérové barvy', 'Herbol Interiérové barvy',
  'Austis Interiérové barvy', 'Den Braven Interiérové barvy', 'HET Oleje na dřevo',
  'Balakryl Laky na dřevo', 'Jansen Laky na dřevo', 'Koopmans Laky na dřevo',
  'ADLER Česko Barvy na dřevo', 'Multi tools Malířské nářadí a doplňky',
  'Biopol Barvy na kov', 'BUILDING PLAST Barvy na kov', 'Peugeot Barvy ve spreji',
  'Alkapren Ředidla a rozpouštědla', 'Sokrates Univerzální barvy'
]

async function main() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 1400, height: 900 })
  await page.setRequestInterception(true)

  let heurekaPositions = []

  page.on('request', req => req.continue())
  page.on('response', async function(resp) {
    if (resp.url().includes('getadvertpositions')) {
      try {
        const json = await resp.json()
        heurekaPositions = json.Items || []
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
    await sleep(1000)

    // Načti stránku která spustí getadvertpositions
    await page.goto(
      'https://affiliate.heureka.cz/webmaster/webs/25761/positions/category-position?groupName=products-rotator#/?categoryId=3555&categoryFilters=f%3A15929%3A557910',
      { waitUntil: 'networkidle2', timeout: 30000 }
    )
    await sleep(4000)

    console.log('Staženo ze SPA:', heurekaPositions.length, 'pozic')

    // Hledej podobná jména k nenalezeným
    function normalize(s) { return (s || '').trim().toLowerCase().replace(/\s+/g, ' ') }

    const notFoundNorm = notFound.map(normalize)

    console.log('\n=== Analýza nenalezených ===')
    notFoundNorm.forEach(function(nfn, i) {
      const original = notFound[i]
      // Přesná shoda
      const exact = heurekaPositions.find(p => normalize(p.Name) === nfn)
      if (exact) {
        console.log('FOUND (exact):', original, '-> Id:', exact.Id, 'Status:', exact.StatusName)
        return
      }
      // Částečná shoda
      const partial = heurekaPositions.filter(p => normalize(p.Name).includes(nfn.split(' ')[0].toLowerCase()))
      if (partial.length > 0) {
        console.log('PARTIAL:', original)
        partial.slice(0, 3).forEach(p => console.log('  ->', p.Name, '(Id:', p.Id + ')'))
      } else {
        console.log('NOT FOUND:', original)
      }
    })

    // Uložit kompletní seznam pro analýzu
    fs.writeFileSync(
      path.join(__dirname, 'heureka-all-positions-raw.json'),
      JSON.stringify(heurekaPositions, null, 2)
    )
    console.log('\nUložen kompletní seznam:', heurekaPositions.length, 'pozic -> scripts/heureka-all-positions-raw.json')

  } finally {
    await browser.close()
  }
}

main().catch(console.error)
