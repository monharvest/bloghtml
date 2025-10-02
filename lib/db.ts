import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Handle build-time when DATABASE_URL might not be available
const createPrismaClient = () => {
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL not found, using mock data for build')
    return null
  }
  
  try {
    return new PrismaClient()
  } catch (error) {
    console.warn('Database not available during build, using mock client')
    return null
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma
}

// Mock data for build time
const mockPosts = [
  {
    id: '1',
    title: 'Sample Post',
    slug: 'sample-post',
    excerpt: 'This is a sample post for build time',
    content: 'Sample content',
    category: 'Technology',
    image: '/placeholder.jpg',
    metaDescription: 'Sample meta description',
    published: true,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Post-related database operations
export const db = {
  // Get all posts
  getPosts: async () => {
    if (!prisma) return mockPosts
    return await prisma.post.findMany({
      orderBy: { createdAt: 'desc' }
    })
  },

  // Get published posts only
  getPublishedPosts: async () => {
    if (!prisma) return mockPosts
    return await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' }
    })
  },

  // Get post by slug
  getPostBySlug: async (slug: string) => {
    if (!prisma) return mockPosts.find(p => p.slug === slug) || null
    return await prisma.post.findUnique({
      where: { slug }
    })
  },

  // Get posts by category
  getPostsByCategory: async (category: string) => {
    if (!prisma) return mockPosts
    
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
    if (!prisma) return []
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
    if (!prisma) throw new Error('Database not available')
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
    if (!prisma) throw new Error('Database not available')
    return await prisma.post.update({
      where: { id },
      data
    })
  },

  // Delete post
  deletePost: async (id: string) => {
    if (!prisma) throw new Error('Database not available')
    return await prisma.post.delete({
      where: { id }
    })
  },

  // Get categories
  getCategories: async () => {
    if (!prisma) return [{ id: '1', name: 'Technology', slug: 'technology', createdAt: new Date(), updatedAt: new Date() }]
    return await prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
  },

  // Create category
  createCategory: async (data: {
    name: string
    slug: string
  }) => {
    if (!prisma) throw new Error('Database not available')
    return await prisma.category.create({
      data
    })
  }
}