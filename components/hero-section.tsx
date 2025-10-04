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
      <section className="bg-slate-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="relative h-64 bg-slate-700 rounded-2xl animate-pulse"></div>
            <div className="space-y-6">
              <div className="w-32 h-6 bg-slate-700 rounded-full animate-pulse"></div>
              <div className="w-full h-8 bg-slate-700 rounded animate-pulse"></div>
              <div className="w-3/4 h-6 bg-slate-700 rounded animate-pulse"></div>
              <div className="w-1/2 h-4 bg-slate-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!featuredPost) return null

  return (
    <section className="bg-slate-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          {/* Featured Post Card */}
          <div className="relative">
            <Link href={`/post/${featuredPost.slug}`}>
              <div className="relative rounded-2xl overflow-hidden group cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={featuredPost.image || "/placeholder.svg?height=400&width=600"}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                </div>
              </div>
            </Link>
          </div>

          {/* Right Side Content */}
          <div className="space-y-6">
            <Link href={`/post/${featuredPost.slug}`} className="block group">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold leading-tight group-hover:text-blue-300 transition-colors duration-200">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed group-hover:text-gray-200 transition-colors duration-200">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{featuredPost.date}</span>
                  <span>•</span>
                  <span>{featuredPost.category}</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
