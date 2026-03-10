const fs = require('fs')
const path = require('path')

const dir = path.join(__dirname, '..', 'content', 'barvy-a-laky')
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'))
const rows = []

for (const file of files) {
  const content = fs.readFileSync(path.join(dir, file), 'utf-8')
  if (!content.includes('subcategory: podle-znacek')) continue

  const titleMatch = content.match(/^title:\s*"(.+?)"/m)
  const title = titleMatch ? titleMatch[1] : file.replace('.mdx', '')

  // Extract brand name from title: "Barvy Značka – ..." → "Značka"
  let brand = title.split('–')[0].trim().replace(/^Barvy\s+/, '').trim()

  const slug = file.replace('.mdx', '')
  const url = 'https://www.osb-desky.cz/barvy-a-laky/' + slug

  rows.push({ brand, url })
}

rows.sort((a, b) => a.brand.localeCompare(b.brand, 'cs'))

const csv = 'Znacka,URL\n' + rows.map(r => `"${r.brand}","${r.url}"`).join('\n')
const outPath = path.join(__dirname, '..', 'znacky-urls.csv')
fs.writeFileSync(outPath, csv, 'utf-8')

console.log('Celkem znacek:', rows.length)
console.log('Ulozeno do:', outPath)
console.log('Prvnich 5:')
rows.slice(0, 5).forEach(r => console.log(r.brand, '|', r.url))
