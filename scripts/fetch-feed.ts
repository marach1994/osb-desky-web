import { fetchFeed } from '../lib/feed'
import * as fs from 'fs'
import * as path from 'path'

async function main() {
  console.log('Fetching product feed...')

  try {
    const products = await fetchFeed()
    console.log(`Fetched ${products.length} products`)

    const dataDir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    const outputPath = path.join(dataDir, 'products.json')
    fs.writeFileSync(outputPath, JSON.stringify(products, null, 2))
    console.log(`Saved to ${outputPath}`)

    // Log some stats
    const categories = new Set(products.map(p => p.category))
    console.log(`Categories: ${[...categories].join(', ')}`)

    const sizes = new Set(products.filter(p => p.size).map(p => p.size))
    console.log(`Sizes: ${[...sizes].join(', ')}`)
  } catch (error) {
    console.error('Error fetching feed:', error)
    process.exit(1)
  }
}

main()
