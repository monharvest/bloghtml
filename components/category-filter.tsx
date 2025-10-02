"use client"

import { useState } from "react"
import { categories } from "@/lib/posts"

interface CategoryFilterProps {
  onCategoryChange: (category: string) => void
}

export function CategoryFilter({ onCategoryChange }: CategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState("Бүгд")

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category)
    onCategoryChange(category)
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryClick(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeCategory === category
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
