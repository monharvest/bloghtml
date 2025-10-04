// Static data loader for production builds
import fs from 'fs'
import path from 'path'

// Types
interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  image: string
  metaDescription: string
  published: boolean
  featured: boolean
  createdAt: string | Date
  updatedAt: string | Date
}

interface Category {
  id: string
  name: string
  slug: string
  createdAt: string | Date
  updatedAt: string | Date
}

// Load static data functions
function loadStaticPosts(): Post[] {
  if (typeof window !== 'undefined') {
    // Client-side: Return empty array, let components fetch from /static-data/posts.json
    return []
  } else {
    // Server-side during build: read from file system
    try {
      const filePath = path.join(process.cwd(), 'public', 'static-data', 'posts.json')
      const data = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.warn('Static posts data not found, using empty array')
      return []
    }
  }
}

function loadStaticCategories(): Category[] {
  if (typeof window !== 'undefined') {
    // Client-side: Return empty array, let components fetch from /static-data/categories.json
    return []
  } else {
    // Server-side during build: read from file system
    try {
      const filePath = path.join(process.cwd(), 'public', 'static-data', 'categories.json')
      const data = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.warn('Static categories data not found, using empty array')
      return []
    }
  }
}

// Database operations (now using static data)
export const db = {
  // Get all posts
  getPosts: async (): Promise<Post[]> => {
    return loadStaticPosts()
  },

  // Get published posts only
  getPublishedPosts: async (): Promise<Post[]> => {
    const posts = loadStaticPosts()
    return posts.filter(post => post.published)
  },

  // Get post by slug
  getPostBySlug: async (slug: string): Promise<Post | null> => {
    const posts = loadStaticPosts()
    return posts.find(post => post.slug === slug) || null
  },

  // Get posts by category
  getPostsByCategory: async (category: string): Promise<Post[]> => {
    const posts = loadStaticPosts()
    
    if (category === 'Бүгд') {
      return posts.filter(post => post.published)
    }
    
    return posts.filter(post => post.category === category && post.published)
  },

  // Get featured posts
  getFeaturedPosts: async (): Promise<Post[]> => {
    const posts = loadStaticPosts()
    return posts.filter(post => post.featured && post.published)
  },

  // Get categories
  getCategories: async (): Promise<Category[]> => {
    return loadStaticCategories()
  }
}