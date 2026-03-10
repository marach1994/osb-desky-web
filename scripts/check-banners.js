const fs = require('fs')
const path = require('path')

const dir = path.join(__dirname, '..', 'content', 'barvy-a-laky')
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'))

const missing = []
const only1 = []

for (const file of files) {
  const content = fs.readFileSync(path.join(dir, file), 'utf-8')
  if (!content.includes('subcategory: podle-znacek')) continue

  const titleMatch = content.match(/title:\s*"(.+?)"/)
  const title = titleMatch ? titleMatch[1] : file
  const slug = file.replace('.mdx', '')
  const count = (content.match(/<HeurekaProductGrid/g) || []).length

  if (count === 0) missing.push({ slug, title, count })
  else if (count === 1) only1.push({ slug, title, count })
}

console.log('=== BEZ JAKEHOKOLI BANNERU (' + missing.length + ') ===')
missing.forEach(r => console.log(r.slug, '|', r.title))
console.log('')
console.log('=== POUZE 1 BANNER (' + only1.length + ') ===')
only1.forEach(r => console.log(r.slug, '|', r.title))
