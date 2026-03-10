// add-banner-text.js
// Najde za sebou jdoucí HeurekaProductGrid bannery bez textu a přidá H3 + odstavec před každý

const fs = require('fs')
const path = require('path')

const POSITIONS_FILE = path.join(__dirname, 'heureka-positions.json')
const MDX_DIR = path.join(__dirname, '..', 'content', 'barvy-a-laky')

// Mapa categoryId → H3 nadpis + krátký odstavec
// Zjistíme z positions.json
const positions = JSON.parse(fs.readFileSync(POSITIONS_FILE, 'utf-8'))

const catIdToInfo = {}
positions.forEach(p => {
  if (!p.categoryId || catIdToInfo[p.categoryId]) return
  catIdToInfo[p.categoryId] = { category: p.category }
})

// Texty pro každou kategorii
const CAT_TEXTS = {
  'Interiérové barvy': {
    h3: 'Interiérové Barvy',
    para: 'Malířské barvy pro stěny a stropy v interiéru. Dostupné v různých třídách omyvatelnosti a krycí schopnosti, od ekonomických variant až po prémiové produkty.'
  },
  'Fasádní barvy': {
    h3: 'Fasádní Barvy',
    para: 'Exteriérové barvy odolné vůči povětrnostním vlivům, UV záření a biologickému napadení. Chrání fasádu a zachovávají estetický vzhled po dlouhá léta.'
  },
  'Lazury a mořidla na dřevo': {
    h3: 'Lazury a Mořidla na Dřevo',
    para: 'Transparentní a tónované lazury zachovávají přirozenou kresbu dřeva a zároveň ho chrání před vlhkostí a UV záření. Vhodné pro exteriér i interiér.'
  },
  'Laky na dřevo': {
    h3: 'Laky na Dřevo',
    para: 'Ochranné laky vytvářejí odolný film na povrchu dřeva. Dostupné v matném, polomatném i lesklém provedení – vhodné pro podlahy, nábytek i dřevěné obklady.'
  },
  'Oleje na dřevo': {
    h3: 'Oleje na Dřevo',
    para: 'Penetrační oleje pronikají do struktury dřeva, vyživují ho zevnitř a zvýrazňují přirozenou kresbu. Ideální pro masivní dřevěné podlahy, nábytek a terasy.'
  },
  'Vosky na dřevo': {
    h3: 'Vosky na Dřevo',
    para: 'Tvrdé a tekuté vosky dodávají dřevu hedvábný lesk, příjemný hmat a ochranu před vlhkostí. Používají se jako finální povrchová úprava podlah i nábytku.'
  },
  'Barvy na dřevo': {
    h3: 'Barvy na Dřevo',
    para: 'Krycí barvy s výbornou přilnavostí na dřevo. Chrání povrch před povětrností a mechanickým poškozením – vhodné pro okna, dveře, zahradní nábytek i ploty.'
  },
  'Barvy na kov': {
    h3: 'Barvy na Kov',
    para: 'Antikorozní a dekorativní barvy pro kovové povrchy. Poskytují dlouhodobou ochranu před rzí, povětrnostními vlivy i mechanickým namáháním.'
  },
  'Barvy na beton': {
    h3: 'Barvy na Beton a Minerální Povrchy',
    para: 'Speciální nátěry pro betonové, cementové a minerální povrchy. Odolné vůči zátěži, chemikáliím, oleji a vlhkosti – vhodné pro podlahy garáží, sklepy i průmyslové prostory.'
  },
  'Barvy ve spreji': {
    h3: 'Barvy ve Spreji',
    para: 'Sprejové barvy umožňují rychlou a rovnoměrnou aplikaci bez štětce nebo válečku. Vhodné pro opravy, dekoraci, modelářství i průmyslové použití.'
  },
  'Malířské nářadí a doplňky': {
    h3: 'Malířské Nářadí a Doplňky',
    para: 'Štětce, válečky, malířské vany, pásky a ochranné pomůcky pro profesionální i domácí malování. Správné nářadí zajistí čistý výsledek a šetří čas.'
  },
  'Ředidla a rozpouštědla': {
    h3: 'Ředidla a Rozpouštědla',
    para: 'Ředidla umožňují úpravu konzistence barev a laků před aplikací. Rozpouštědla slouží k čištění nářadí, odstraňování starých nátěrů a odmašťování povrchů.'
  },
  'Univerzální barvy': {
    h3: 'Univerzální Barvy',
    para: 'Všestranné barvy vhodné na různé typy povrchů bez nutnosti speciální přípravy podkladu. Šetří čas i peníze tam, kde není potřeba specializovaný nátěr.'
  },
}

function getCategoryFromId(categoryId) {
  const info = catIdToInfo[categoryId]
  return info ? info.category : null
}

function isGridLine(line) {
  return line.trim().startsWith('<HeurekaProductGrid')
}

function isBlankLine(line) {
  return line.trim() === ''
}

function extractCategoryId(line) {
  const m = line.match(/categoryId="(\d+)"/)
  return m ? m[1] : null
}

let totalUpdated = 0

fs.readdirSync(MDX_DIR).forEach(file => {
  if (!file.endsWith('.mdx')) return

  const fp = path.join(MDX_DIR, file)
  const content = fs.readFileSync(fp, 'utf-8')
  const lines = content.split('\n')

  const newLines = []
  let changed = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Zkontroluj: je tato linka banner a předchází mu JINÝ banner (s případnými blank line mezitím)?
    if (isGridLine(line)) {
      // Najdi co bylo před tímto bannerem (přeskakuj blank lines)
      let prevContentIdx = newLines.length - 1
      while (prevContentIdx >= 0 && isBlankLine(newLines[prevContentIdx])) {
        prevContentIdx--
      }

      const prevContent = prevContentIdx >= 0 ? newLines[prevContentIdx] : ''
      const prevIsGrid = isGridLine(prevContent)

      if (prevIsGrid) {
        // Tenhle banner následuje hned po jiném banneru → přidej H3 + para
        const categoryId = extractCategoryId(line)
        const category = categoryId ? getCategoryFromId(categoryId) : null
        const texts = category ? CAT_TEXTS[category] : null

        if (texts) {
          newLines.push('')
          newLines.push(`<h3>${texts.h3}</h3>`)
          newLines.push('')
          newLines.push(`<p>${texts.para}</p>`)
          newLines.push('')
          changed = true
        } else {
          // Fallback: aspoň prázdný řádek navíc (already there) — neznámá kategorie
          newLines.push('')
        }
      }
    }

    newLines.push(line)
  }

  if (changed) {
    // Odstraň triple+ blank lines
    const cleaned = newLines.join('\n').replace(/\n{3,}/g, '\n\n')
    fs.writeFileSync(fp, cleaned, 'utf-8')
    totalUpdated++
  }
})

console.log('=== add-banner-text HOTOVO ===')
console.log('Aktualizováno souborů:', totalUpdated)
