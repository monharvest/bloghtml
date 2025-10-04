"use client"

import { useState, useEffect } from "react"

interface CategoryFilterProps {
  onCategoryChange: (category: string) => void
}

export function CategoryFilter({ onCategoryChange }: CategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState("Бүгд")
  const [categories, setCategories] = useState<string[]>(["Бүгд"])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        let posts: any[] = []
        
        // Load from static data
        try {
          const staticResponse = await fetch('/static-data/posts.json')
          if (staticResponse.ok) {
            posts = await staticResponse.json()
          }
        } catch (staticError) {
          console.error('Error fetching static data:', staticError)
        }

        if (posts.length > 0) {
          const uniqueCategories = Array.from(new Set(posts.map(post => post.category)))
          setCategories(["Бүгд", ...uniqueCategories])
        } else {
          // Fallback to default categories
          setCategories([
            "Бүгд",
            "Advent",
            "Үхэл ба амилал",
            "Сайн мэдээ",
            "Сургаалт зүйрлэлүүд",
            "Мөнх үгийн ойлголт",
            "Тамын тухай",
          ])
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        // Fallback to default categories
        setCategories([
          "Бүгд",
          "Advent",
          "Үхэл ба амилал",
          "Сайн мэдээ",
          "Сургаалт зүйрлэлүүд",
          "Мөнх үгийн ойлголт",
          "Тамын тухай",
        ])
      }
    }

    fetchCategories()
  }, [])

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category)
    onCategoryChange(category)
  }

  return (
    <>
      {/* Mobile Version - Small flex buttons in one section */}
      <div className="md:hidden flex justify-center mb-12 px-4">
        <div className="flex flex-wrap gap-2 justify-center w-full">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`py-2 px-4 rounded-full text-xs font-medium transition-all duration-200 ${
                activeCategory === category
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Version - Original pill style */}
      <div className="hidden md:flex justify-center mb-12">
        <div className="flex flex-wrap gap-3 p-2 bg-white dark:bg-slate-800 rounded-full shadow-lg transition-colors duration-200">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === category
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
