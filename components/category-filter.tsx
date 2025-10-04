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
            "Ухал ба амилал",
            "Сайн мэдээ",
            "Сургаалт зүйрлэлүүд",
            "Мөнх үүний өйлгөлт",
            "Тамын тухай",
          ])
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        // Fallback to default categories
        setCategories([
          "Бүгд",
          "Advent",
          "Ухал ба амилал",
          "Сайн мэдээ",
          "Сургаалт зүйрлэлүүд",
          "Мөнх үүний өйлгөлт",
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
    <div className="flex justify-center mb-12">
      <div className="flex flex-wrap gap-3 p-2 bg-white rounded-full shadow-lg">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCategory === category
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}
