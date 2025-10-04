"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
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

export default function HeroSection() {
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null)

  useEffect(() => {
    async function loadFeaturedPost() {
      try {
        const response = await fetch('/static-data/posts.json')
        const posts: Post[] = await response.json()
        const featured = posts.find(post => post.featured) || posts[0]
        setFeaturedPost(featured)
      } catch (error) {
        console.error('Error loading featured post:', error)
      }
    }

    loadFeaturedPost()
  }, [])

  if (!featuredPost) {
    return (
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative h-64 rounded-3xl overflow-hidden bg-gray-200 dark:bg-slate-700 animate-pulse">
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <div className="max-w-2xl">
              <div className="h-6 bg-gray-300 dark:bg-slate-600 rounded mb-2 w-24"></div>
              <div className="h-8 bg-gray-300 dark:bg-slate-600 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-full"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-slate-800 dark:bg-slate-900 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="relative h-64 lg:h-80 rounded-3xl overflow-hidden group transition-transform duration-300 hover:-translate-y-2 shadow-xl hover:shadow-2xl">
            <Link href={`/post/${featuredPost.slug}`} className="block w-full h-full">
              <div className="relative w-full h-full">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </Link>
          </div>
          
          <div className="text-white">
            <Link href={`/post/${featuredPost.slug}`} className="block group">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 group-hover:text-blue-300 transition-colors duration-200">
                {featuredPost.title}
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed mb-6 group-hover:text-gray-200 transition-colors duration-200">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>{featuredPost.date}</span>
                <span>•</span>
                <span className="text-blue-400">{featuredPost.category}</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}