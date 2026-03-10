const fs = require('fs')
const path = require('path')

const dir = path.join(__dirname, '..', 'content', 'barvy-a-laky')
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'))

const rows = []

for (const file of files) {
  const content = fs.readFileSync(path.join(dir, file), 'utf-8')
  if (!content.includes('subcategory: podle-znacek')) continue

  const count = (content.match(/<HeurekaProductGrid/g) || []).length
  if (count === 0) continue

  const titleMatch = content.match(/title:\s*"(.+?)"/)
  const title = titleMatch ? titleMatch[1] : file
  let brand = title.split('–')[0].trim().replace(/^Barvy\s+/, '').trim()

  const slug = file.replace('.mdx', '')
  const url = 'https://www.osb-desky.cz/barvy-a-laky/' + slug

  rows.push({ brand, url, count })
}

rows.sort((a, b) => a.brand.localeCompare(b.brand, 'cs'))

const csv = 'Znacka,URL,Pocet banneru\n' + rows.map(r => `"${r.brand}","${r.url}","${r.count}"`).join('\n')
fs.writeFileSync(path.join(__dirname, '..', 'znacky-s-bannery.csv'), csv, 'utf-8')

console.log('Celkem znacek s bannery:', rows.length)
rows.forEach(r => console.log(r.brand + ' | ' + r.url + ' | ' + r.count))
