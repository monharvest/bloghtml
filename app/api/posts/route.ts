import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const posts = await db.getPosts()
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { title, excerpt, content, category, image, metaDescription, published, featured } = body
    
    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    const post = await db.createPost({
      title,
      slug,
      excerpt,
      content,
      category,
      image: image || `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(title)}`,
      metaDescription,
      published: published ?? true,
      featured: featured ?? false
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}