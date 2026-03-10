// add-banners-v2.js
// Druhý průchod - přidá bannery po H3 s fuzzy matchingem kategorií
// Přeskočí H3 které už mají HeurekaProductGrid za svým paragrafem

const fs = require('fs')
const path = require('path')

const POSITIONS_FILE = path.join(__dirname, 'heureka-positions.json')
const MDX_DIR = path.join(__dirname, '..', 'content', 'barvy-a-laky')

const positions = JSON.parse(fs.readFileSync(POSITIONS_FILE, 'utf-8'))
  .filter(p => p.positionId)

// Kategorie → klíčová slova pro matching H3 textu
const CAT_KEYWORDS = {
  'Lazury a mořidla na dřevo': ['lazur', 'mořid', 'morid'],
  'Laky na dřevo': ['lak'],
  'Oleje na dřevo': ['olej'],
  'Vosky na dřevo': ['vosk', 'wax'],
  'Barvy na dřevo': ['barv.*dřev', 'barv.*drev', 'wood'],
  'Interiérové barvy': ['interiér', 'interier', 'vnitřní', 'vnitrni'],
  'Fasádní barvy': ['fasád', 'fasad', 'exteriér', 'exterier', 'vnější', 'vnejsi'],
  'Barvy na kov': ['kov', 'metal', 'anticor', 'antikoroz'],
  'Malířské nářadí a doplňky': ['nářad', 'narad', 'malíř', 'malir', 'štětec', 'stetec', 'váleček', 'valecek'],
  'Barvy ve spreji': ['sprej', 'spray', 'aerosol'],
  'Ředidla a rozpouštědla': ['ředid', 'redid', 'rozpouš', 'rozpous', 'ředění', 'redeni'],
  'Barvy na beton': ['beton'],
  'Univerzální barvy': ['univer'],
}

// Kategorie priority pro frontmatter (hlavní banner)
const CAT_PRIORITY = [
  'Lazury a mořidla na dřevo', 'Interiérové barvy', 'Fasádní barvy',
  'Laky na dřevo', 'Oleje na dřevo', 'Barvy na dřevo', 'Vosky na dřevo',
  'Barvy na kov', 'Barvy na beton', 'Barvy ve spreji',
  'Malířské nářadí a doplňky', 'Ředidla a rozpouštědla', 'Univerzální barvy'
]

function slugify(s) {
  return s.toLowerCase()
    .replace(/[áàä]/g, 'a').replace(/[čć]/g, 'c').replace(/[ď]/g, 'd')
    .replace(/[éě]/g, 'e').replace(/[íï]/g, 'i').replace(/[ňń]/g, 'n')
    .replace(/[óö]/g, 'o').replace(/[řŕ]/g, 'r').replace(/[šś]/g, 's')
    .replace(/[ť]/g, 't').replace(/[úůü]/g, 'u').replace(/[ýÿ]/g, 'y')
    .replace(/[žź]/g, 'z')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function matchCategoryToH3(h3text, category) {
  const h3norm = h3text.toLowerCase()
  const keywords = CAT_KEYWORDS[category] || []
  return keywords.some(kw => {
    try { return new RegExp(kw).test(h3norm) }
    catch (e) { return h3norm.includes(kw) }
  })
}

// Seskup pozice podle značky
const byBrand = {}
positions.forEach(p => {
  const key = p.brand
  if (!byBrand[key]) byBrand[key] = []
  byBrand[key].push(p)
})

// Najdi MDX soubor pro danou značku
function findMdx(brand) {
  const slug = slugify(brand)
  const candidates = [
    slug + '.mdx',
    slug.replace(/-+/g, '-') + '.mdx',
  ]
  for (const c of candidates) {
    const fp = path.join(MDX_DIR, c)
    if (fs.existsSync(fp)) return fp
  }
  // Zkus partial match
  const files = fs.readdirSync(MDX_DIR).filter(f => f.endsWith('.mdx'))
  for (const f of files) {
    const fslug = f.replace('.mdx', '')
    if (fslug === slug) return path.join(MDX_DIR, f)
  }
  return null
}

// Parsuj MDX na tokeny: frontmatter, h3, p, heurekaGrid, other
function parseMdx(content) {
  const lines = content.split('\n')
  const tokens = []
  let i = 0

  // Frontmatter
  if (lines[0] === '---') {
    let fmEnd = 1
    while (fmEnd < lines.length && lines[fmEnd] !== '---') fmEnd++
    tokens.push({ type: 'frontmatter', lines: lines.slice(0, fmEnd + 1), raw: lines.slice(0, fmEnd + 1).join('\n') })
    i = fmEnd + 1
    // Skip blank line after frontmatter
    if (i < lines.length && lines[i] === '') { tokens.push({ type: 'blank', raw: '' }); i++ }
  }

  while (i < lines.length) {
    const line = lines[i]
    if (line.startsWith('<h3>')) {
      tokens.push({ type: 'h3', raw: line, text: line.replace(/<\/?h3>/g, '').trim() })
      i++
    } else if (line.startsWith('<HeurekaProductGrid')) {
      tokens.push({ type: 'heurekaGrid', raw: line })
      i++
    } else if (line === '') {
      tokens.push({ type: 'blank', raw: '' })
      i++
    } else {
      tokens.push({ type: 'other', raw: line })
      i++
    }
  }

  return tokens
}

function tokensToString(tokens) {
  return tokens.map(t => t.raw).join('\n')
}

function updateFrontmatter(fmLines, positionId, categoryId, categoryFilters) {
  // Remove existing heureka fields
  const cleaned = fmLines.filter(l =>
    !l.startsWith('heurekaPositionId:') &&
    !l.startsWith('heurekaCategoryId:') &&
    !l.startsWith('heurekaCategoryFilters:')
  )
  // Insert before last ---
  const lastDash = cleaned.lastIndexOf('---')
  cleaned.splice(lastDash, 0,
    `heurekaPositionId: "${positionId}"`,
    `heurekaCategoryId: "${categoryId}"`,
    `heurekaCategoryFilters: "${categoryFilters}"`
  )
  return cleaned
}

let totalUpdated = 0, totalSkipped = 0, noMdx = 0

const brandNames = Object.keys(byBrand)

brandNames.forEach(brand => {
  const mdxPath = findMdx(brand)
  if (!mdxPath) {
    noMdx++
    return
  }

  const brandPositions = byBrand[brand]
  const content = fs.readFileSync(mdxPath, 'utf-8')
  const tokens = parseMdx(content)

  let changed = false

  // 1. Update frontmatter if needed
  const fmToken = tokens.find(t => t.type === 'frontmatter')
  const hasPosId = fmToken && fmToken.raw.includes('heurekaPositionId:')

  if (!hasPosId && fmToken) {
    // Pick best position for frontmatter
    let mainPos = null
    for (const cat of CAT_PRIORITY) {
      mainPos = brandPositions.find(p => p.category === cat)
      if (mainPos) break
    }
    if (!mainPos) mainPos = brandPositions[0]

    if (mainPos) {
      const newFmLines = updateFrontmatter(fmToken.lines, mainPos.positionId, mainPos.categoryId, mainPos.categoryFilters)
      fmToken.raw = newFmLines.join('\n')
      fmToken.lines = newFmLines
      changed = true

      // Add <HeurekaProductGrid /> after intro (before ## Sortiment)
      const sortimentIdx = tokens.findIndex(t => t.type === 'other' && t.raw.startsWith('## Sortiment'))
      if (sortimentIdx > -1) {
        // Find last <p> before ## Sortiment
        let insertIdx = sortimentIdx
        for (let j = sortimentIdx - 1; j >= 0; j--) {
          if (tokens[j].type === 'other' && tokens[j].raw.startsWith('<p>')) {
            insertIdx = j + 1
            break
          }
        }
        // Check there's no HeurekaProductGrid already there
        const alreadyHasGrid = tokens.slice(insertIdx, sortimentIdx).some(t => t.type === 'heurekaGrid')
        if (!alreadyHasGrid) {
          tokens.splice(insertIdx, 0,
            { type: 'blank', raw: '' },
            { type: 'heurekaGrid', raw: '<HeurekaProductGrid />' },
            { type: 'blank', raw: '' }
          )
        }
      }
    }
  }

  // 2. For each H3 in the MDX, check if it has a banner and if we have a matching position
  // Re-scan tokens (they may have shifted)
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i]
    if (tok.type !== 'h3') continue

    const h3text = tok.text
    // Skip FAQ H3s (contain brand name or question words)
    if (h3text.includes('?') || h3text.toLowerCase().includes('vzorník') || h3text.toLowerCase().includes('kombinovat')) continue

    // Find matching position for this H3
    let matchedPos = null
    for (const cat of CAT_PRIORITY) {
      if (matchCategoryToH3(h3text, cat)) {
        matchedPos = brandPositions.find(p => p.category === cat)
        if (matchedPos) break
      }
    }
    if (!matchedPos) continue

    // Find the paragraph(s) after this H3
    // Look ahead to find where to insert (after the <p> block, before next h3 or ## or end)
    let insertAfter = i
    for (let j = i + 1; j < tokens.length; j++) {
      const t = tokens[j]
      if (t.type === 'h3' || (t.type === 'other' && t.raw.startsWith('##'))) break
      if (t.type === 'heurekaGrid') { insertAfter = -1; break } // already has one
      if (t.type === 'other' && t.raw.startsWith('<p>')) insertAfter = j
      else if (t.type === 'other' && t.raw.startsWith('</p>')) insertAfter = j
      else if (t.type === 'other' && t.raw.startsWith('<ul>')) insertAfter = j
      else if (t.type === 'other' && t.raw.startsWith('</ul>')) insertAfter = j
    }

    if (insertAfter === -1) continue // already has banner

    const tag = `<HeurekaProductGrid positionId="${matchedPos.positionId}" categoryId="${matchedPos.categoryId}" categoryFilters="${matchedPos.categoryFilters}" />`

    tokens.splice(insertAfter + 1, 0,
      { type: 'blank', raw: '' },
      { type: 'heurekaGrid', raw: tag },
      { type: 'blank', raw: '' }
    )
    i += 3 // skip inserted tokens
    changed = true
  }

  // 3. For positions that weren't matched to any H3, add before "## Kde Použít"
  const usedPositionIds = new Set(
    tokens.filter(t => t.type === 'heurekaGrid')
      .map(t => {
        const m = t.raw.match(/positionId="(\d+)"/)
        return m ? m[1] : null
      })
      .filter(Boolean)
  )
  // Also mark frontmatter positionId as used
  if (fmToken) {
    const m = fmToken.raw.match(/heurekaPositionId:\s*"(\d+)"/)
    if (m) usedPositionIds.add(m[1])
  }

  const unusedPositions = brandPositions.filter(p => !usedPositionIds.has(p.positionId))

  if (unusedPositions.length > 0) {
    const kdeIdx = tokens.findIndex(t => t.type === 'other' && t.raw.startsWith('## Kde Použít'))
    const insertAt = kdeIdx > -1 ? kdeIdx : tokens.length - 1

    const newTokens = unusedPositions.map(p => ({
      type: 'heurekaGrid',
      raw: `<HeurekaProductGrid positionId="${p.positionId}" categoryId="${p.categoryId}" categoryFilters="${p.categoryFilters}" />`
    }))

    tokens.splice(insertAt, 0, ...newTokens.flatMap(t => [t, { type: 'blank', raw: '' }]))
    changed = true
  }

  if (changed) {
    const newContent = tokensToString(tokens)
    // Fix double blank lines
    const cleaned = newContent.replace(/\n{3,}/g, '\n\n')
    fs.writeFileSync(mdxPath, cleaned, 'utf-8')
    totalUpdated++
  } else {
    totalSkipped++
  }
})

console.log('=== add-banners-v2 HOTOVO ===')
console.log('Aktualizováno:', totalUpdated)
console.log('Přeskočeno (beze změny):', totalSkipped)
console.log('Bez MDX souboru:', noMdx)
