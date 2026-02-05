import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Article } from '@/types'

const contentDirectory = path.join(process.cwd(), 'content')

export function getArticleBySlug(category: string, slug: string): Article | null {
  const filePath = path.join(contentDirectory, category, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { data } = matter(fileContent)

  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    category: data.category || category,
    subcategory: data.subcategory,
    keywords: data.keywords || [],
    relatedArticles: data.relatedArticles,
    publishedAt: data.publishedAt || new Date().toISOString(),
    updatedAt: data.updatedAt,
    heurekaWidget: data.heurekaWidget,
    heurekaPositionId: data.heurekaPositionId,
    heurekaCategoryId: data.heurekaCategoryId,
    heurekaCategoryFilters: data.heurekaCategoryFilters,
  }
}

export function getArticleContent(category: string, slug: string): string | null {
  const filePath = path.join(contentDirectory, category, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { content } = matter(fileContent)
  return content
}

export function getAllArticles(): Article[] {
  const articles: Article[] = []
  const categories = ['osb-desky', 'navody', 'dalsi-typy-desek']

  for (const category of categories) {
    const categoryDir = path.join(contentDirectory, category)
    if (!fs.existsSync(categoryDir)) continue

    const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.mdx'))
    for (const file of files) {
      const slug = file.replace('.mdx', '')
      const article = getArticleBySlug(category, slug)
      if (article) articles.push(article)
    }
  }

  return articles
}

export function getArticlesByCategory(category: string): Article[] {
  return getAllArticles().filter(a => a.category === category)
}
