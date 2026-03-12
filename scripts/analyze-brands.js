const fs = require('fs')
const path = require('path')

const positions = JSON.parse(fs.readFileSync(path.join(__dirname, 'heureka-positions.json'), 'utf-8'))

// Primární kategorie pro každou značku
const brandCategory = {}
positions.forEach(p => {
  if (!brandCategory[p.brand]) brandCategory[p.brand] = p.category
})

const catCount = {}
Object.values(brandCategory).forEach(cat => {
  catCount[cat] = (catCount[cat] || 0) + 1
})

console.log('Značky per primární kategorie:')
Object.entries(catCount).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(v, k))

// Struktura brand stránek
const mdxDir = path.join(__dirname, '..', 'content', 'barvy-a-laky')
const sample = fs.readFileSync(path.join(mdxDir, 'balakryl.mdx'), 'utf-8')
const h2s = sample.split('\n').filter(l => l.startsWith('## '))
console.log('\nH2 nadpisy v balakryl.mdx:')
h2s.forEach(h => console.log(h))
