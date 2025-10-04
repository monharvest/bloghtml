"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

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
  createdAt?: string
}

export function HeroSection() {
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedPost = async () => {
      try {
        let posts: Post[] = []
        
        // Load from static data
        try {
          const staticResponse = await fetch('/static-data/posts.json')
          if (staticResponse.ok) {
            posts = await staticResponse.json()
            // Convert createdAt to date format for static data
            posts = posts.map(post => ({
              ...post,
              date: post.createdAt ? new Date(post.createdAt).toLocaleDateString("en-GB") : post.date
            }))
          }
        } catch (staticError) {
          console.error('Error fetching static data:', staticError)
        }

        if (posts.length > 0) {
          const featured = posts.find((post) => post.featured && post.published !== false)
          const fallback = posts.find((post) => post.published !== false) || posts[0]
          setFeaturedPost(featured || fallback || null)
        }
      } catch (error) {
        console.error('Error fetching featured post:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedPost()
  }, [])

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-0.5">
        <div className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-lg bg-card">
          <div className="relative min-h-[60px] md:min-h-[80px] overflow-hidden bg-muted animate-pulse" />
          <div className="p-1.5 md:p-2 flex flex-col justify-center bg-card">
            <div className="w-20 h-4 bg-muted rounded-full mb-1.5 animate-pulse" />
            <div className="w-full h-5 bg-muted rounded mb-1.5 animate-pulse" />
            <div className="w-3/4 h-3 bg-muted rounded mb-1.5 animate-pulse" />
            <div className="w-1/2 h-3 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </section>
    )
  }

  if (!featuredPost) return null

  return (
    <section className="container mx-auto px-4 py-0.5">
      <Link href={`/post/${featuredPost.slug}`}>
        <div className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-card">
          <div className="relative min-h-[60px] md:min-h-[80px] overflow-hidden">
            <img
              src={featuredPost.image || "/placeholder.svg?height=400&width=600"}
              alt={featuredPost.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="p-1.5 md:p-2 flex flex-col justify-center bg-card">
            <span className="inline-block px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-full mb-1.5 w-fit">
              {featuredPost.category}
            </span>
            <h3 className="text-base md:text-lg font-bold mb-1.5 text-card-foreground">{featuredPost.title}</h3>
            <p className="text-muted-foreground mb-1.5 leading-relaxed text-xs">{featuredPost.excerpt}</p>
            <time className="text-xs text-muted-foreground">{featuredPost.date}</time>
          </div>
        </div>
      </Link>
    </section>
  )
}
