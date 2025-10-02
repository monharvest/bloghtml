import { db } from './db'

export interface Post {
  id: string
  title: string
  excerpt: string
  category: string
  date: string  // Formatted date string for compatibility
  image: string
  slug: string
  metaDescription: string
  content?: string
  published?: boolean
  featured?: boolean
  createdAt?: Date
  updatedAt?: Date
}

// Convert database date to formatted string for compatibility
function formatPostDate(post: any): Post {
  return {
    ...post,
    date: new Date(post.createdAt).toLocaleDateString("en-GB")
  }
}

export async function getPosts(): Promise<Post[]> {
  try {
    const posts = await db.getPosts()
    return posts.map(formatPostDate)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export async function getPublishedPosts(): Promise<Post[]> {
  try {
    const posts = await db.getPublishedPosts()
    return posts.map(formatPostDate)
  } catch (error) {
    console.error('Error fetching published posts:', error)
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  try {
    const post = await db.getPostBySlug(slug)
    return post ? formatPostDate(post) : undefined
  } catch (error) {
    console.error('Error fetching post:', error)
    return undefined
  }
}

export async function getPostsByCategory(categorySlugOrName: string): Promise<Post[]> {
  try {
    const posts = await db.getPostsByCategory(categorySlugOrName)
    return posts.map(formatPostDate)
  } catch (error) {
    console.error('Error fetching posts by category:', error)
    return []
  }
}

// Legacy compatibility functions for client-side usage
export function getPostsSync(): Post[] {
  // This will only work on client-side with localStorage fallback
  if (typeof window === "undefined") return []
  
  const stored = localStorage.getItem("blog_posts")
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return []
    }
  }
  return []
}

export function getPublishedPostsSync(): Post[] {
  return getPostsSync().filter((post) => post.published !== false)
}

export function savePosts(posts: Post[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("blog_posts", JSON.stringify(posts))
  }
}

export const categorySlugToName: Record<string, string> = {
  'sain-medee': "Сайн мэдээ",
  'surgaalt-zuirleluud': "Сургаалт зүйрлэлүүд",
  'advent': "Advent",
  'ukhal-ba-amiral': "Ухал ба амилал",
  'munkh-uunii-oilgolt': "Мөнх үүний өйлгөлт",
  'tamyn-tukhai': "Тамын тухай",
}

export const categories = [
  "Бүгд",
  "Сайн мэдээ",
  "Сургаалт зүйрлэлүүд",
  "Advent",
  "Ухал ба амилал",
  "Мөнх үүний өйлгөлт",
  "Тамын тухай",
]