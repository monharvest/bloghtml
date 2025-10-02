"use client"

import { useState, useEffect } from "react"
import { PostCard } from "./post-card"
import { CategoryFilter } from "./category-filter"

interface Post {
  id: string
  title: string
  excerpt: string
  category: string
  date: string
  image: string
  slug: string
  metaDescription: string
  content?: string
  published?: boolean
  featured?: boolean
}

export function ArticlesSection() {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      if (response.ok) {
        const posts: Post[] = await response.json()
        const publishedPosts = posts.filter(post => post.published !== false)
        setAllPosts(publishedPosts)
        setFilteredPosts(publishedPosts)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleCategoryChange = (category: string) => {
    if (category === "Бүгд") {
      setFilteredPosts(allPosts)
    } else {
      setFilteredPosts(allPosts.filter(post => post.category === category))
    }
  }

  if (loading) {
    return (
      <section id="articles" className="container mx-auto px-4 py-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">Нийтлэлүүд</h2>
        <CategoryFilter onCategoryChange={handleCategoryChange} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="rounded-xl overflow-hidden shadow-lg bg-card animate-pulse">
              <div className="relative h-48 bg-muted" />
              <div className="p-6">
                <div className="w-16 h-4 bg-muted rounded mb-3" />
                <div className="w-full h-6 bg-muted rounded mb-2" />
                <div className="w-3/4 h-4 bg-muted rounded mb-4" />
                <div className="w-1/2 h-3 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section id="articles" className="container mx-auto px-4 py-12">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">Нийтлэлүүд</h2>

      <CategoryFilter onCategoryChange={handleCategoryChange} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post, index) => (
          <PostCard key={post.id} post={post} index={index} />
        ))}
      </div>
    </section>
  )
}
