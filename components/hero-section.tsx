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
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative h-80 bg-slate-700 rounded-2xl animate-pulse"></div>
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
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Featured Post Card */}
          <div className="relative">
            <Link href={`/post/${featuredPost.slug}`}>
              <div className="relative rounded-2xl overflow-hidden group cursor-pointer">
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={featuredPost.image || "/placeholder.svg?height=400&width=600"}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                  
                  {/* Number Badge */}
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  
                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2 leading-tight">{featuredPost.title}</h3>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Right Side Content */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="inline-block px-3 py-1 bg-blue-500 text-white text-sm rounded-full">
                Онцлох нийтлэл
              </div>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                {featuredPost.title}
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>{featuredPost.date}</span>
                <span>•</span>
                <span>{featuredPost.category}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
