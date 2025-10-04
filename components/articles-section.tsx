"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
  createdAt?: string
}

export function ArticlesSection() {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = async () => {
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
      <section id="articles" className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-48 h-8 bg-gray-300 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="w-96 h-4 bg-gray-300 rounded mx-auto animate-pulse"></div>
          </div>
          <div className="flex justify-center mb-12">
            <div className="w-96 h-12 bg-white rounded-full shadow-lg animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="w-20 h-6 bg-gray-300 rounded-full mb-3"></div>
                  <div className="w-full h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="w-3/4 h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="w-20 h-3 bg-gray-300 rounded"></div>
                    <div className="w-16 h-3 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="articles" className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Нийтлэлүүд</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Сүнслэг удирдлага, амьдралын сургаалт, хувьсгалтай нийтлэлүүд
          </p>
        </div>

        <CategoryFilter onCategoryChange={handleCategoryChange} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <Link href={`/post/${post.slug}`}>
                <div className="relative">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image || "/placeholder.svg?height=300&width=400"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {post.category}
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-lg leading-tight line-clamp-2 mb-3 text-gray-900">{post.title}</h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{post.date}</span>
                      <span className="text-blue-600 font-medium group-hover:text-blue-800 transition-colors">
                        Унших →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
