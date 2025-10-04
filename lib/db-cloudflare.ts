import { PrismaClient } from '@prisma/client'

// For Cloudflare D1 compatibility
declare global {
  var __prisma: PrismaClient | undefined
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Database configuration that works in both local and Cloudflare environments
const getDatabaseUrl = () => {
  // For Cloudflare Pages/Workers with D1
  if (process.env.CF_PAGES || process.env.CLOUDFLARE_ENV) {
    return process.env.DATABASE_URL || 'file:./dev.db'
  }
  
  // For local development
  return process.env.DATABASE_URL || 'file:./dev.db'
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: getDatabaseUrl()
    }
  }
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Post-related database operations
export const db = {
  // Get all posts
  getPosts: async () => {
    return await prisma.post.findMany({
      orderBy: { createdAt: 'desc' }
    })
  },

  // Get published posts only
  getPublishedPosts: async () => {
    return await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' }
    })
  },

  // Get post by slug
  getPostBySlug: async (slug: string) => {
    return await prisma.post.findUnique({
      where: { slug }
    })
  },

  // Get posts by category
  getPostsByCategory: async (category: string) => {
    if (category === 'Бүгд') {
      return await prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' }
      })
    }
    
    return await prisma.post.findMany({
      where: { 
        category,
        published: true 
      },
      orderBy: { createdAt: 'desc' }
    })
  },

  // Get featured posts
  getFeaturedPosts: async () => {
    return await prisma.post.findMany({
      where: { 
        featured: true,
        published: true 
      },
      orderBy: { createdAt: 'desc' }
    })
  },

  // Create new post
  createPost: async (data: {
    title: string
    slug: string
    excerpt: string
    content: string
    category: string
    image: string
    metaDescription: string
    published?: boolean
    featured?: boolean
  }) => {
    return await prisma.post.create({
      data
    })
  },

  // Update post
  updatePost: async (id: string, data: {
    title?: string
    slug?: string
    excerpt?: string
    content?: string
    category?: string
    image?: string
    metaDescription?: string
    published?: boolean
    featured?: boolean
  }) => {
    return await prisma.post.update({
      where: { id },
      data
    })
  },

  // Delete post
  deletePost: async (id: string) => {
    return await prisma.post.delete({
      where: { id }
    })
  },

  // Get categories
  getCategories: async () => {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
  },

  // Create category
  createCategory: async (data: {
    name: string
    slug: string
  }) => {
    return await prisma.category.create({
      data
    })
  }
}