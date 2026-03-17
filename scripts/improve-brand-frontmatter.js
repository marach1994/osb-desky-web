#!/usr/bin/env node
/**
 * improve-brand-frontmatter.js
 *
 * Batch-vylepšuje frontmatter všech brand stránek v barvy-a-laky/:
 * - Přidá updatedAt
 * - Zlepší generický title tag
 * - Zlepší generický description
 * - Rozšíří keywords o H3 sekce z obsahu
 *
 * Přeskočí soubory které NEJSOU na generickém titulu (= already optimized)
 */

const fs = require('fs')
const path = require('path')

const CONTENT_DIR = path.join(__dirname, '../content/barvy-a-laky')
const UPDATED_AT = '2026-03-17'
const GENERIC_TITLE_PATTERN = /– Sortiment, Recenze a Kde Koupit/

// Kategorie pro tvorbu titulů
const H3_TITLE_MAP = {
  'Interiérové Barvy': 'interiérové barvy',
  'Fasádní Barvy': 'fasádní barvy',
  'Barvy na Dřevo': 'barvy na dřevo',
  'Lazury': 'lazury',
  'Oleje na Dřevo': 'oleje na dřevo',
  'Laky na Dřevo': 'laky',
  'Barvy na Kov': 'barvy na kov',
  'Lazury a Oleje': 'lazury a oleje',
  'Barvy ve Spreji': 'barvy ve spreji',
  'Barvy na Beton': 'barvy na beton',
  'Vosky na Dřevo': 'vosky na dřevo',
}

// Přepisovací pravidla pro "Podobné značky" - nahradit generické abecední za tematické
const THEMATIC_SIMILAR = {
  // Pro značky zaměřené na ochranu dřeva
  wood: [
    { href: '/barvy-a-laky/remmers', label: 'Remmers' },
    { href: '/barvy-a-laky/adler-cesko', label: 'Adler Česko' },
    { href: '/barvy-a-laky/osmo', label: 'Osmo' },
    { href: '/barvy-a-laky/sikkens', label: 'Sikkens' },
    { href: '/barvy-a-laky/xyladecor', label: 'Xyladecor' },
    { href: '/barvy-a-laky/belinka', label: 'Belinka' },
  ],
  // Pro značky zaměřené na interiér a fasády
  interior: [
    { href: '/barvy-a-laky/het', label: 'Het' },
    { href: '/barvy-a-laky/colorlak', label: 'Colorlak' },
    { href: '/barvy-a-laky/tikkurila', label: 'Tikkurila' },
    { href: '/barvy-a-laky/dulux', label: 'Dulux' },
    { href: '/barvy-a-laky/caparol', label: 'Caparol' },
    { href: '/barvy-a-laky/primalex', label: 'Primalex' },
  ],
  // Pro české/slovenské značky
  czech: [
    { href: '/barvy-a-laky/balakryl', label: 'Balakryl' },
    { href: '/barvy-a-laky/het', label: 'Het' },
    { href: '/barvy-a-laky/colorlak', label: 'Colorlak' },
    { href: '/barvy-a-laky/sokrates', label: 'Sokrates' },
    { href: '/barvy-a-laky/lazurol', label: 'Lazurol' },
  ],
}

function extractBrandName(title) {
  // "Barvy Dulux – Sortiment..." → "Dulux"
  // "Dulux – Something" → "Dulux"
  const match = title.match(/^(?:Barvy\s+)?([^–]+?)\s*–/)
  return match ? match[1].trim() : null
}

function extractH3Sections(content) {
  const h3s = []
  const regex = /###\s+(.+)/g
  let match
  while ((match = regex.exec(content)) !== null) {
    h3s.push(match[1].trim())
  }
  return h3s
}

function buildBetterTitle(brandName, h3Sections) {
  if (!brandName) return null

  // Najdeme klíčové kategorie ze sekcí
  const categories = []
  for (const h3 of h3Sections) {
    for (const [key, val] of Object.entries(H3_TITLE_MAP)) {
      if (h3.includes(key) && !categories.includes(val)) {
        categories.push(val)
        break
      }
    }
    if (categories.length >= 2) break
  }

  if (categories.length >= 2) {
    const cats = categories.slice(0, 2).join(' a ')
    return `${brandName} – ${cats[0].toUpperCase()}${cats.slice(1)} | Přehled a kde koupit`
  } else if (categories.length === 1) {
    const cat = categories[0]
    return `${brandName} – ${cat[0].toUpperCase()}${cat.slice(1)} | Přehled produktů a kde koupit`
  }

  // Fallback - aspoň odstraníme "Sortiment, Recenze a Kde Koupit"
  return `${brandName} – Přehled Nátěrových Hmot a Kde Koupit v ČR`
}

function buildBetterDescription(brandName, h3Sections, currentDesc) {
  if (!brandName) return null

  // Pokud je description generická šablona, vylepšíme ji
  if (!currentDesc.includes('přehled sortimentu, hodnocení produktů a kde koupit za nejlepší cenu')) {
    return null // Nechaj existující (je lepší než šablona)
  }

  const cats = h3Sections
    .filter(h3 => Object.keys(H3_TITLE_MAP).some(k => h3.includes(k)))
    .slice(0, 3)
    .map(h3 => {
      for (const [key, val] of Object.entries(H3_TITLE_MAP)) {
        if (h3.includes(key)) return val
      }
      return null
    })
    .filter(Boolean)

  if (cats.length >= 2) {
    const catStr = cats.slice(0, 2).join(', ')
    return `${brandName} nabízí ${catStr} a další nátěrové hmoty. Přehled produktů, vlastnosti, recenze a kde koupit v České republice.`
  }

  return `${brandName} – nátěrové hmoty pro profesionály i kutily. Přehled produktů, ceny, recenze a kde koupit v ČR.`
}

function buildBetterKeywords(brandName, h3Sections, currentKeywords) {
  if (!brandName) return null

  const brandLower = brandName.toLowerCase()
  const newKeywords = [...currentKeywords]

  // Přidáme keywords z H3 sekcí
  const keywordMap = {
    'Interiérové Barvy': `${brandLower} interiérová barva`,
    'Fasádní Barvy': `${brandLower} fasádní barva`,
    'Barvy na Dřevo': `${brandLower} barva na dřevo`,
    'Lazury': `${brandLower} lazura`,
    'Lazury a Oleje': `${brandLower} lazura na dřevo`,
    'Oleje na Dřevo': `${brandLower} olej na dřevo`,
    'Laky na Dřevo': `${brandLower} lak na dřevo`,
    'Barvy na Kov': `${brandLower} barva na kov`,
    'Barvy ve Spreji': `${brandLower} sprej`,
    'Vosky na Dřevo': `${brandLower} vosk na dřevo`,
    'Barvy na Beton': `${brandLower} barva na beton`,
    'Impregnace': `${brandLower} impregnace`,
  }

  for (const h3 of h3Sections) {
    for (const [key, kw] of Object.entries(keywordMap)) {
      if (h3.includes(key) && !newKeywords.includes(kw)) {
        newKeywords.push(kw)
      }
    }
  }

  // Přidáme "kde koupit" variantu
  const koupit = `${brandLower} kde koupit`
  if (!newKeywords.includes(koupit) && newKeywords.length < 8) {
    newKeywords.push(koupit)
  }

  return newKeywords
}

function improveSimilarBrands(content, brandName, h3Sections) {
  // Detekce zaměření značky
  const hasWood = h3Sections.some(h => h.includes('Lazur') || h.includes('Oleje') || h.includes('Vosk'))
  const hasInterior = h3Sections.some(h => h.includes('Interiér') || h.includes('Fasád'))

  const genericPattern = /(<h2[^>]*>Podobné Značky<\/h2>[\s\S]*?<ul>)([\s\S]*?)(<\/ul>)/

  const genericLinks = [
    '<li><a href="/barvy-a-laky/abamal">Abamal</a></li>',
    '<li><a href="/barvy-a-laky/adler-cesko">Adler Česko</a></li>',
    '<li><a href="/barvy-a-laky/akzo">Akzo</a></li>',
    '<li><a href="/barvy-a-laky/amarit">Amarit</a></li>',
  ]

  const match = content.match(genericPattern)
  if (!match) return content

  const currentLinks = match[2]
  const isGeneric = genericLinks.some(gl => currentLinks.includes(gl.substring(0, 40)))
  if (!isGeneric) return content // Nechaj stávající pokud není generické

  const brandSlug = brandName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  let similar = hasWood ? THEMATIC_SIMILAR.wood : THEMATIC_SIMILAR.interior
  // Odfiltrujeme samotnou značku ze seznamu
  similar = similar.filter(s => !s.href.includes(brandSlug))

  const newLinks = similar.slice(0, 5).map(s =>
    `<li><a href="${s.href}">${s.label}</a></li>`
  ).join('\n')

  return content.replace(genericPattern, `$1\n${newLinks}\n$3`)
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')

  // Parsujeme frontmatter
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/)
  if (!fmMatch) return { changed: false }

  const fm = fmMatch[1]
  const body = content.slice(fmMatch[0].length)

  // Přeskočíme již optimalizované soubory (= nemají generický title)
  const titleMatch = fm.match(/^title:\s*"(.+)"/m)
  if (!titleMatch) return { changed: false }
  const currentTitle = titleMatch[1]

  // Přeskočíme soubory, které již nemají generický titulek
  if (!GENERIC_TITLE_PATTERN.test(currentTitle)) {
    // Ale přidáme updatedAt pokud chybí
    if (!fm.includes('updatedAt:')) {
      const newFm = fm + `\nupdatedAt: "${UPDATED_AT}"`
      const newContent = `---\n${newFm}\n---${body}`
      fs.writeFileSync(filePath, newContent)
      return { changed: true, reason: 'added-updatedAt-only' }
    }
    return { changed: false }
  }

  const brandName = extractBrandName(currentTitle)
  const h3Sections = extractH3Sections(body)

  let newFm = fm

  // 1. updatedAt
  if (!newFm.includes('updatedAt:')) {
    newFm = newFm.replace(/^publishedAt:.*$/m, (m) => `${m}\nupdatedAt: "${UPDATED_AT}"`)
  }

  // 2. Title
  const betterTitle = buildBetterTitle(brandName, h3Sections)
  if (betterTitle) {
    newFm = newFm.replace(/^title:.*$/m, `title: "${betterTitle}"`)
  }

  // 3. Description
  const descMatch = newFm.match(/^description:\s*"(.+)"/m)
  if (descMatch) {
    const betterDesc = buildBetterDescription(brandName, h3Sections, descMatch[1])
    if (betterDesc) {
      newFm = newFm.replace(/^description:.*$/m, `description: "${betterDesc}"`)
    }
  }

  // 4. Keywords
  const kwMatch = newFm.match(/^keywords:\n((?:  - .+\n?)+)/m)
  if (kwMatch) {
    const currentKws = kwMatch[1].split('\n').filter(l => l.trim()).map(l => l.replace(/^  - /, '').trim())
    const betterKws = buildBetterKeywords(brandName, h3Sections, currentKws)
    if (betterKws && betterKws.length > currentKws.length) {
      const kwBlock = betterKws.map(k => `  - ${k}`).join('\n')
      newFm = newFm.replace(/^keywords:\n((?:  - .+\n?)+)/m, `keywords:\n${kwBlock}\n`)
    }
  }

  // 5. Podobné značky - vylepšit generické
  let newBody = body
  if (brandName) {
    newBody = improveSimilarBrands(body, brandName, h3Sections)
  }

  const newContent = `---\n${newFm}\n---${newBody}`
  fs.writeFileSync(filePath, newContent)
  return { changed: true, reason: 'full-improvement', brandName }
}

// Spustíme na všechny soubory
const files = fs.readdirSync(CONTENT_DIR)
  .filter(f => f.endsWith('.mdx'))
  .map(f => path.join(CONTENT_DIR, f))

let changed = 0
let skipped = 0
let updatedAtOnly = 0
const errors = []

for (const file of files) {
  try {
    const result = processFile(file)
    if (result.changed) {
      if (result.reason === 'added-updatedAt-only') {
        updatedAtOnly++
      } else {
        changed++
        console.log(`✅ ${path.basename(file)} – ${result.brandName || '?'}`)
      }
    } else {
      skipped++
    }
  } catch (err) {
    errors.push({ file: path.basename(file), err: err.message })
    console.error(`❌ ${path.basename(file)}: ${err.message}`)
  }
}

console.log(`\n=== Výsledky ===`)
console.log(`Plně vylepšeno: ${changed}`)
console.log(`Pouze updatedAt: ${updatedAtOnly}`)
console.log(`Přeskočeno (již optimalizováno): ${skipped}`)
console.log(`Chyby: ${errors.length}`)
if (errors.length) {
  errors.forEach(e => console.log(`  ❌ ${e.file}: ${e.err}`))
}
