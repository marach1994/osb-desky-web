// fix-missing-ids.js
// 1. Přiřadí positionId k pozicím se spojenými jmény (bug při vytváření)
// 2. Vypíše které pozice je třeba znovu vytvořit

const fs = require('fs')
const path = require('path')

const POSITIONS_FILE = path.join(__dirname, 'heureka-positions.json')
const RAW_FILE = path.join(__dirname, 'heureka-all-positions-raw.json')

const positionsData = JSON.parse(fs.readFileSync(POSITIONS_FILE, 'utf-8'))
const heurekaRaw = JSON.parse(fs.readFileSync(RAW_FILE, 'utf-8'))

function normalize(s) { return (s || '').trim().toLowerCase().replace(/\s+/g, ' ') }

// Mapa jmen (z heureka-all-positions-raw) - obsahuje i spojená jména
const heurekaByName = {}
heurekaRaw.forEach(function(p) {
  heurekaByName[normalize(p.Name)] = p
})

// Najdi pozice bez ID a zkus je namapovat na spojená jména
const missing = positionsData.filter(function(p) { return !p.positionId })

let fixed = 0
const needsRecreation = []

missing.forEach(function(p) {
  const myName = normalize(p.positionName)

  // Hledej v heurekaRaw pozice které OBSAHUJÍ moje jméno jako SUFFIX nebo součást
  const match = heurekaRaw.find(function(h) {
    const hn = normalize(h.Name)
    // Spojené jméno: "JinéJménoMojeJméno" nebo "JinéJméno MojeJméno"
    return hn.endsWith(myName) && hn !== myName
  })

  if (match) {
    p.positionId = String(match.Id)
    console.log('FIXED (concat):', p.positionName, '-> Id:', match.Id, '(', match.Name, ')')
    fixed++
  } else {
    needsRecreation.push(p)
  }
})

console.log('\nOpraveno (concat):', fixed)
console.log('Potřebuje znovu vytvořit:', needsRecreation.length)
console.log('\nK vytvoření:')
needsRecreation.forEach(function(p) {
  console.log(' -', p.positionName, '| categoryId:', p.categoryId, '| filters:', p.categoryFilters)
})

// Uložit
fs.writeFileSync(POSITIONS_FILE, JSON.stringify(positionsData, null, 2), 'utf-8')
console.log('\nUloženo:', POSITIONS_FILE)

// Uložit seznam k re-vytvoření
const toRecreate = needsRecreation.map(function(p) {
  return {
    positionName: p.positionName,
    brand: p.brand,
    category: p.category,
    categoryId: p.categoryId,
    categoryFilters: p.categoryFilters,
    brandUrl: p.brandUrl
  }
})
fs.writeFileSync(path.join(__dirname, 'to-recreate.json'), JSON.stringify(toRecreate, null, 2), 'utf-8')
console.log('Seznam k re-vytvoření uložen: scripts/to-recreate.json')
