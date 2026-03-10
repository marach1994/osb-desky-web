const d = require('./heureka-positions.json')
const notFound = d.filter(function(x) { return !x.positionId })
console.log('Celkem bez positionId:', notFound.length)
const cats = {}
notFound.forEach(function(x) {
  cats[x.category] = (cats[x.category] || 0) + 1
})
console.log('Po kategoriích:', JSON.stringify(cats, null, 2))
