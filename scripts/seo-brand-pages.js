// seo-brand-pages.js
// Přidá TOC + "Podobné značky" sekci na všechny brand stránky barvy-a-laky
// Převede ## nadpisy na <h2 id=""> pro fungující kotvy

const fs = require('fs')
const path = require('path')

const MDX_DIR = path.join(__dirname, '..', 'content', 'barvy-a-laky')
const POSITIONS_FILE = path.join(__dirname, 'heureka-positions.json')

const positions = JSON.parse(fs.readFileSync(POSITIONS_FILE, 'utf-8'))

// Primární kategorie pro každou značku (první kategorie v positions.json)
const brandPrimaryCategory = {}
positions.forEach(p => {
  if (!brandPrimaryCategory[p.brand]) brandPrimaryCategory[p.brand] = p.category
})

// Mapa kategorie → [brand slugs] pro podobné značky
function slugify(s) {
  return s.toLowerCase()
    .replace(/[áàä]/g, 'a').replace(/[čć]/g, 'c').replace(/[ď]/g, 'd')
    .replace(/[éě]/g, 'e').replace(/[íï]/g, 'i').replace(/[ňń]/g, 'n')
    .replace(/[óö]/g, 'o').replace(/[řŕ]/g, 'r').replace(/[šś]/g, 's')
    .replace(/[ť]/g, 't').replace(/[úůü]/g, 'u').replace(/[ýÿ]/g, 'y')
    .replace(/[žź]/g, 'z')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

// Kategorie → seznam dostupných brand slugů
const categoryBrands = {}
const mdxFiles = fs.readdirSync(MDX_DIR).filter(f => f.endsWith('.mdx'))
const availableSlugs = new Set(mdxFiles.map(f => f.replace('.mdx', '')))

positions.forEach(p => {
  const cat = p.category
  const slug = slugify(p.brand)
  if (!availableSlugs.has(slug)) return
  if (!categoryBrands[cat]) categoryBrands[cat] = new Set()
  categoryBrands[cat].add(JSON.stringify({ brand: p.brand, slug }))
})

// Převede ## Nadpis na id
function headingToId(heading) {
  return slugify(heading.replace(/^##\s+/, ''))
}

// Parsuje titulek značky z frontmatteru
function parseBrandName(content) {
  const m = content.match(/^title:\s*"(.+?)"/m)
  if (!m) return null
  return m[1].split('–')[0].trim().replace(/^Barvy\s+/, '').trim()
}

// Najde primární kategorii značky
function getBrandCategory(brandName) {
  // Zkus přímou shodu
  if (brandPrimaryCategory[brandName]) return brandPrimaryCategory[brandName]
  // Zkus case-insensitive
  const lower = brandName.toLowerCase()
  for (const [b, cat] of Object.entries(brandPrimaryCategory)) {
    if (b.toLowerCase() === lower) return cat
  }
  return null
}

// Vrátí 4 podobné značky (jiné než aktuální)
function getSimilarBrands(currentSlug, category, count = 4) {
  if (!category || !categoryBrands[category]) return []
  const all = [...categoryBrands[category]]
    .map(s => JSON.parse(s))
    .filter(b => b.slug !== currentSlug)
  // Shuffle deterministicky (podle abecedy) a vezmi prvních N
  return all.sort((a, b) => a.brand.localeCompare(b.brand, 'cs')).slice(0, count)
}

// Kategorie → český název pro "Podobné značky" text
const CAT_LABEL = {
  'Lazury a mořidla na dřevo': 'lazury a mořidla na dřevo',
  'Laky na dřevo': 'laky na dřevo',
  'Oleje na dřevo': 'oleje na dřevo',
  'Vosky na dřevo': 'vosky na dřevo',
  'Barvy na dřevo': 'barvy na dřevo',
  'Interiérové barvy': 'interiérové barvy',
  'Fasádní barvy': 'fasádní barvy',
  'Barvy na kov': 'barvy na kov',
  'Barvy na beton': 'barvy na beton',
  'Barvy ve spreji': 'barvy ve spreji',
  'Malířské nářadí a doplňky': 'malířské nářadí a doplňky',
  'Ředidla a rozpouštědla': 'ředidla a rozpouštědla',
  'Univerzální barvy': 'univerzální barvy',
}

let updated = 0
let skipped = 0

mdxFiles.forEach(file => {
  const filePath = path.join(MDX_DIR, file)
  const content = fs.readFileSync(filePath, 'utf-8')

  // Zpracuj pouze brand stránky
  if (!content.includes('subcategory: podle-znacek')) return

  // Přeskoč pokud už má TOC
  if (content.includes('aria-label="Obsah článku"')) {
    skipped++
    return
  }

  const slug = file.replace('.mdx', '')
  const brandName = parseBrandName(content)
  if (!brandName) { skipped++; return }

  const category = getBrandCategory(brandName)
  const similarBrands = getSimilarBrands(slug, category)

  const lines = content.split('\n')
  const newLines = []
  let inFrontmatter = false
  let frontmatterDone = false
  let fmDashes = 0
  let tocInserted = false
  let podobneInserted = false

  // Sbírej H2 nadpisy pro TOC (mimo frontmatter)
  const h2headings = []
  let scanFm = 0
  for (const l of lines) {
    if (l === '---') { scanFm++; continue }
    if (scanFm < 2) continue
    if (l.startsWith('## ')) h2headings.push(l.replace(/^## /, '').trim())
  }

  // Přidej "Podobné značky" do TOC pokud jsou k dispozici
  const tocHeadings = [...h2headings]
  if (similarBrands.length > 0) {
    // Vlož před FAQ
    const faqIdx = tocHeadings.findIndex(h => h.includes('Kladené') || h.toLowerCase().includes('faq'))
    if (faqIdx > -1) tocHeadings.splice(faqIdx, 0, 'Podobné Značky')
    else tocHeadings.push('Podobné Značky')
  }

  // Generuj TOC HTML
  const tocHtml = `<nav aria-label="Obsah článku" style={{background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:'8px',padding:'1rem 1.25rem',marginBottom:'1.5rem'}}>
  <p style={{fontWeight:700,marginBottom:'0.5rem',fontSize:'0.95rem'}}>Obsah článku</p>
  <ol style={{margin:0,paddingLeft:'1.25rem',fontSize:'0.9rem',lineHeight:'2'}}>
${tocHeadings.map(h => `    <li><a href="#${slugify(h)}">${h}</a></li>`).join('\n')}
  </ol>
</nav>`

  // Generuj "Podobné značky" sekci
  const catLabel = CAT_LABEL[category] || 'barvy a laky'
  const podobneHtml = similarBrands.length > 0 ? `<h2 id="podobne-znacky">Podobné Značky</h2>

<p>Hledáte alternativu nebo chcete porovnat více výrobců? Podívejte se na další značky nabízející ${catLabel}:</p>

<ul>
${similarBrands.map(b => `<li><a href="/barvy-a-laky/${b.slug}">${b.brand}</a></li>`).join('\n')}
</ul>` : null

  // Projdi řádky a uprav obsah
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Frontmatter tracking
    if (line === '---') {
      fmDashes++
      newLines.push(line)
      if (fmDashes === 2) frontmatterDone = true
      continue
    }

    // Mimo frontmatter: převeď ## na <h2 id="">
    if (frontmatterDone && line.startsWith('## ')) {
      const heading = line.replace(/^## /, '').trim()
      const id = slugify(heading)

      // Vlož "Podobné značky" před FAQ
      if (!podobneInserted && podobneHtml && (heading.includes('Kladené') || heading.toLowerCase().includes('faq'))) {
        newLines.push('')
        newLines.push(podobneHtml)
        newLines.push('')
        podobneInserted = true
      }

      newLines.push(`<h2 id="${id}">${heading}</h2>`)
      continue
    }

    // Vlož TOC za první <HeurekaProductGrid /> (standalone, bez props)
    if (frontmatterDone && !tocInserted && line.trim() === '<HeurekaProductGrid />') {
      newLines.push(line)
      newLines.push('')
      newLines.push(tocHtml)
      tocInserted = true
      continue
    }

    newLines.push(line)
  }

  // Pokud nebyl TOC vložen (chybí standalone banner), vlož za H1
  if (!tocInserted) {
    const h1Idx = newLines.findIndex(l => l.startsWith('# ') && !l.startsWith('## '))
    if (h1Idx > -1) {
      newLines.splice(h1Idx + 2, 0, '', tocHtml)
    }
  }

  const newContent = newLines.join('\n').replace(/\n{3,}/g, '\n\n')
  fs.writeFileSync(filePath, newContent, 'utf-8')
  updated++
})

console.log('=== seo-brand-pages HOTOVO ===')
console.log('Aktualizováno:', updated)
console.log('Přeskočeno:', skipped)
