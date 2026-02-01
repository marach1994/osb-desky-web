import { Article } from '@/types'

export function getRelatedArticles(
  current: Article,
  all: Article[],
  limit = 3
): Article[] {
  return all
    .filter(a => a.slug !== current.slug || a.category !== current.category)
    .map(article => {
      let score = 0
      if (article.category === current.category) score += 10
      if (article.subcategory && article.subcategory === current.subcategory) score += 5
      const shared = article.keywords.filter(kw => current.keywords.includes(kw))
      score += shared.length * 2
      if (current.relatedArticles?.includes(`${article.category}/${article.slug}`)) score += 100
      return { article, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.article)
}
